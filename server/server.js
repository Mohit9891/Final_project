import express from "express";
import cors from "cors";
import "dotenv/config"; 
import connectDB from "./configs/db.js";
import userRoutes from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Open CORS completely using the wildcard policy
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// 2. Parsers
app.use(express.json());

// 3. Routes
app.get('/', (req, res) => {
    res.send("server is running");
});

app.use('/api/users', userRoutes);
app.use('/api/resumes', resumeRouter);
app.use('/api/ai', aiRouter);

// 4. Start server & database connection cleanly
app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(`Server running on port ${PORT} and DB connected cleanly!`);
    } catch (error) {
        console.error("Database connection failed during startup:", error);
    }
});