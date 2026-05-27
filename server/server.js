import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRoutes from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Connect DB first
await connectDB();

// 2. CORS before everything
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// 3. Parsers
app.use(express.json());

// 4. Routes
app.get("/", (req, res) => {
    res.send("Server is running");
});

app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiRouter);

// 5. 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
});

// 6. Global error handler
app.use((err, req, res, next) => {
    console.error("Server error:", err.message);
    res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});

// 7. Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
