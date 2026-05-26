
import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";

// CREATE RESUME
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    const newResume = await Resume.create({ userId, title });

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

    const resume = await Resume.findOne({ userId, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    resume.__v = undefined;
    resume.createdAt = undefined;
    resume.updatedAt = undefined;

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET RESUME (PUBLIC)
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;

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

    let resumeDataCopy ;
    if(typeof resumeData === 'string'){
      resumeDatacopy = await JSON.parse(resumeData)
    }else{
      resumeDataCopy = structuredClone(resumeData)
    }


   

    // 🖼️ upload image if exists
  if (image) {

    const imageBufferData = fs.createReadStream(image.path)
  const response = await imagekit.files.upload({
    file: imageBufferData, // ✅ FIX
    fileName: `resume.png`,
    folder: "user-resumes",
    transformation: {
      pre:
        "w-300,h-300,fo-face,z-0.75" +
        (removeBackground ? ",e-bgremove" : ""),
    },
  });

  resumeDataCopy.personal_info = {
    ...resumeDataCopy.personal_info,
    image: response.url,
  };
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
