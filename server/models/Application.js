import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    companyLogo: {
      type: String,
    },
    location: {
      type: String,
    },
    salary: {
      type: String,
    },
    applyUrl: {
      type: String,
    },
    source: {
      type: String,
    },
    status: {
      type: String,
      enum: ["saved", "applied", "oa", "interview", "offer", "rejected"],
      default: "saved",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

ApplicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

const Application = mongoose.model("Application", ApplicationSchema);

export default Application;