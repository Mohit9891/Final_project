import express from "express";
import { searchJobs, getJobDetails } from "../controllers/jobController.js";

const jobRouter = express.Router();

jobRouter.get("/search", searchJobs);
jobRouter.get("/details/:jobId", getJobDetails);

export default jobRouter;
