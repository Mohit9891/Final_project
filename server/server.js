import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRoutes from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("Server is running"));
app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiRouter);

// Global error handler (catches unhandled errors in route handlers)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});

// Connect DB first, THEN start server
const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected!");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Failed to connect to database:", error.message);
    process.exit(1); // crash loudly so Render shows the real error
  }
};

startServer();