import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";

// Import routes
import authRoutes from "./routes/user.routes.js";
import studentRoutes from "./routes/student.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import courseRoutes from "./routes/course.routes.js";
import reportRoutes from "./routes/report.routes.js";
import messageRoutes from "./routes/message.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import testRoutes from  "./routes/test.routes.js";
import walletRoutes from "./routes/wallet.routes.js";

// Import ApiError for proper error handling
import { ApiError } from "./utils/ApiError.js";

dotenv.config();

// Connect Database
connectDB();

const app = express();

// ----------------- Middlewares -----------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  exposedHeaders: ["*"],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.use(cookieParser());
app.use(morgan("dev"));

// Serve static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ----------------- Routes -----------------
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/wallet", walletRoutes);

// Convenience aliases for student routes
app.use("/api/performance", studentRoutes);
app.use("/api/schedule", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/payments", paymentRoutes);

  
// Health check
app.get("/", (req, res) => {
  res.send("✅ Educational Platform API is running...");
});

// ----------------- Error Handling Middleware -----------------
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);

  // Ensure CORS headers in error responses
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// ----------------- Start Server -----------------
const PORT = process.env.PORT || 8080;
const httpServer = createServer(app);

// ----------------- Socket.IO Setup -----------------
const io = new Server(httpServer, {
  cors: {
    origin: true,
    credentials: true,
  },
});

// userId -> Set(socketId)
const activeUsers = new Map();

const addUserSocket = (userId, socketId) => {
  const userIdStr = userId?.toString();
  if (!userIdStr) return;

  const existing = activeUsers.get(userIdStr);
  if (existing) {
    existing.add(socketId);
  } else {
    activeUsers.set(userIdStr, new Set([socketId]));
  }
};

const removeUserSocket = (userId, socketId) => {
  const userIdStr = userId?.toString();
  if (!userIdStr) return;

  const existing = activeUsers.get(userIdStr);
  if (!existing) return;

  existing.delete(socketId);
  if (existing.size === 0) {
    activeUsers.delete(userIdStr);
  }
};

io.on("connection", (socket) => {
  // socket connected

  // Prefer handshake auth to avoid timing issues
  const handshakeUserId = socket.handshake?.auth?.userId;
  if (handshakeUserId) {
    socket.data.userId = handshakeUserId.toString();
    addUserSocket(socket.data.userId, socket.id);
  }

  // Store user connection
  socket.on("authenticate", (userId) => {
    const userIdStr = userId?.toString();
    if (!userIdStr) return;
    socket.data.userId = userIdStr;
    addUserSocket(userIdStr, socket.id);
  });

  // Handle incoming messages
  socket.on("sendMessage", (messageData) => {
    const { receiverId } = messageData;
    
    if (!receiverId) {
      return;
    }
    
    const receiverIdStr = receiverId.toString();
    const receiverSocketIds = activeUsers.get(receiverIdStr);

    if (receiverSocketIds && receiverSocketIds.size > 0) {
      for (const receiverSocketId of receiverSocketIds) {
        io.to(receiverSocketId).emit("receiveMessage", messageData);
      }
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    const userIdStr = socket.data?.userId;
    if (userIdStr) {
      removeUserSocket(userIdStr, socket.id);
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
