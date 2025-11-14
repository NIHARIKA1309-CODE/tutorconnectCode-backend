import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import morgan from "morgan";

// Import routes
import authRoutes from "./routes/user.routes.js";
import studentRoutes from "./routes/student.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import courseRoutes from "./routes/course.routes.js";
import reportRoutes from "./routes/report.routes.js";
import messageRoutes from "./routes/message.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import testRoutes from  "./routes/test.routes.js";

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
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
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

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// ----------------- Start Server -----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
