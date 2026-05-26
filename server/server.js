import express from "express";
import cors from "cors";
import "dotenv/config"; // This handles your dotenv config automatically
import connectDB from "./configs/db.js";
import userRoutes from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
await connectDB();

app.use(express.json());

// 1. Configured CORS properly for production
const allowedOrigins = [
    "http://localhost:5173", // Default Vite local port
    "http://localhost:3000", // Default React local port
    process.env.FRONTEND_URL  // Your future Vercel URL
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.get('/', (req, res) => {
    res.send("server is running");
});

app.use('/api/users', userRoutes);
app.use('/api/resumes', resumeRouter);
app.use('/api/ai', aiRouter);

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});