import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
} from "../controllers/applicationController.js";

const applicationRouter = express.Router();

applicationRouter.post("/", protect, createApplication);
applicationRouter.get("/", protect, getApplications);
applicationRouter.put("/:applicationId", protect, updateApplication);
applicationRouter.delete("/:applicationId", protect, deleteApplication);

export default applicationRouter;