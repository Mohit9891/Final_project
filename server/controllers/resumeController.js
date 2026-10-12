
import fs from "fs";
import mongoose from "mongoose";
import imagekitConfig from "../configs/imageKit.js";
import Resume from "../models/Resume.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const ALLOWED_UPDATE_FIELDS = [
  "title",
  "professional_summary",
  "skills",
  "personal_info",
  "experience",
  "projects",
  "education",
  "template",
  "accentColor",
  "public",
];

const sanitizeUpdate = (input = {}) => {
  const out = {};
  for (const key of ALLOWED_UPDATE_FIELDS) {
    if (input[key] !== undefined) out[key] = input[key];
  }
  return out;
};

// CREATE RESUME
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    const cleanTitle =
      typeof title === "string" && title.trim() ? title.trim().slice(0, 100) : "Untitled Resume";

    const newResume = await Resume.create({ userId, title: cleanTitle });

    return res.status(201).json({
      message: "Resume created successfully",
      resume: newResume,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE RESUME
// DELETE /api/resumes/:resumeId
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    if (!isValidId(resumeId)) {
      return res.status(400).json({ message: "Invalid resume id" });
    }

    const deletedResume = await Resume.findOneAndDelete({
      userId,
      _id: resumeId,
    });

    if (!deletedResume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET RESUME (PRIVATE)
export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    if (!isValidId(resumeId)) {
      return res.status(400).json({ message: "Invalid resume id" });
    }

    const resume = await Resume.findOne({ userId, _id: resumeId })
      .select("-__v -createdAt -updatedAt")
      .lean();

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET RESUME (PUBLIC)
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;

    if (!isValidId(resumeId)) {
      return res.status(400).json({ message: "Invalid resume id" });
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      public: true,
    }).select("-__v -createdAt -updatedAt -userId");

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/// UPDATE RESUME
// PUT /api/resumes/update
export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file;

    if (!resumeId || !isValidId(resumeId)) {
      if (image) fs.unlink(image.path, () => {});
      return res.status(400).json({ message: "Valid resumeId is required" });
    }

    let parsed;
    if (typeof resumeData === "string") {
      try {
        parsed = JSON.parse(resumeData);
      } catch {
        if (image) fs.unlink(image.path, () => {});
        return res.status(400).json({ message: "Invalid resumeData JSON" });
      }
    } else if (resumeData && typeof resumeData === "object") {
      parsed = structuredClone(resumeData);
    } else {
      if (image) fs.unlink(image.path, () => {});
      return res.status(400).json({ message: "resumeData is required" });
    }

    const resumeDataCopy = sanitizeUpdate(parsed);

    // 🖼️ upload image if exists
    if (image) {
      try {
        const wantBgRemove =
          removeBackground === true ||
          removeBackground === "yes" ||
          removeBackground === "true";
        const imageBufferData = fs.createReadStream(image.path);
        const response = await imagekitConfig.instance.files.upload({
          file: imageBufferData,
          fileName: `resume-${userId}-${Date.now()}.png`,
          folder: "user-resumes",
          transformation: {
            pre:
              "w-300,h-300,fo-face,z-0.75" +
              (wantBgRemove ? ",e-bgremove" : ""),
          },
        });

        resumeDataCopy.personal_info = {
          ...(resumeDataCopy.personal_info || {}),
          image: response.url,
        };
      } finally {
        fs.unlink(image.path, () => {});
      }
    }


    const resume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId },
      { $set: resumeDataCopy },
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({
      message: "Saved successfully",
      resume,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
