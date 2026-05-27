import express from "express";
import cors from "cors";
import "dotenv/config"; 
import connectDB from "./configs/db.js";
import userRoutes from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
await connectDB();

// 1. ALWAYS PLACE CORS AT THE VERY TOP OF YOUR MIDDLEWARE STACK
const allowedOrigins = [
    "http://localhost:5173", 
    "http://localhost:3000", 
    "https://final-projectfrontend-indol.vercel.app" // Put your explicit Vercel domain here directly as a safety fallback
];

// If process.env.FRONTEND_URL exists, push it into the array dynamically
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

// 2. PARSERS RUN AFTER CORS
app.use(express.json());

// 3. ROUTES RUN LAST
app.get('/', (req, res) => {
    res.send("server is running");
});

app.use('/api/users', userRoutes);
app.use('/api/resumes', resumeRouter);
app.use('/api/ai', aiRouter);

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});