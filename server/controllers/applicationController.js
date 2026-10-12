import Application from "../models/Application.js";
import mongoose from "mongoose";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createApplication = async (req, res) => {
  try {
    const userId = req.userId;
    const { jobId, jobTitle, company, companyLogo, location, salary, applyUrl, source } = req.body;

    if (!jobId || !jobTitle || !company) {
      return res.status(400).json({ message: "jobId, jobTitle, and company are required" });
    }

    const existing = await Application.findOne({ userId, jobId });
    if (existing) {
      return res.status(409).json({ message: "Application already exists", application: existing });
    }

    const application = await Application.create({
      userId,
      jobId,
      jobTitle,
      company,
      companyLogo,
      location,
      salary,
      applyUrl,
      source,
      status: "applied",
    });

    return res.status(201).json({ message: "Application created", application });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getApplications = async (req, res) => {
  try {
    const userId = req.userId;
    const { status } = req.query;

    const filter = { userId };
    if (status) filter.status = status;

    const applications = await Application.find(filter).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ applications });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const userId = req.userId;
    const { applicationId } = req.params;
    const { status, notes } = req.body;

    if (!isValidId(applicationId)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    const application = await Application.findOneAndUpdate(
      { _id: applicationId, userId },
      { ...(status && { status }), ...(notes !== undefined && { notes }) },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.status(200).json({ message: "Application updated", application });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const userId = req.userId;
    const { applicationId } = req.params;

    if (!isValidId(applicationId)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    const application = await Application.findOneAndDelete({ _id: applicationId, userId });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.status(200).json({ message: "Application deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// export { createApplication, getApplications, updateApplication, deleteApplication };