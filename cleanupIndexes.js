// import mongoose from "mongoose";

// const MONGO_URI = "mongodb+srv://algobitcoder_db_user:zJS9qKPYheJpDZFR@cluster0.9nh0tut.mongodb.net/educational_platform?retryWrites=true&w=majority&appName=Cluster0"; // 👈 Replace this

// (async () => {
//   try {
//     // 1️⃣ Connect to your MongoDB
//     await mongoose.connect(MONGO_URI);
//     console.log("✅ Connected to MongoDB");

//     // 2️⃣ Access the users collection
//     const collection = mongoose.connection.collection("users");

//     // 3️⃣ Get existing indexes
//     const indexes = await collection.indexes();
//     console.log("Existing indexes:", indexes);

//     // 4️⃣ Drop the old coverImage index if found
//     for (const index of indexes) {
//       if (index.name !== "_id_" && index.name.includes("coverImage")) {
//         console.log(`🧹 Dropping old index: ${index.name}`);
//         await collection.dropIndex(index.name);
//       }
//     }

//     console.log("🎉 Cleanup complete!");
//     process.exit(0);
//   } catch (err) {
//     console.error("❌ Error while cleaning indexes:", err);
//     process.exit(1);
//   }
// })();
