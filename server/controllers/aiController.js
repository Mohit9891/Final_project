import Resume from "../models/Resume.js";
import ai from "../configs/ai.js";

// controller for enhancing a resume professional summary
// POST : /api/ai/enhance-pro-sum

export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await ai.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing . Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience , and career objectives .Make it compelling and ATS-friendly. and only return text no options or anything else .",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.choices[0].message.content;

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// controller for enhancing a resume job-description
// POST : /api/ai/enhance-job-desc

export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing . Your task is to enhance the job description of a resume. The job description should be only in 1-2 sentence also highlighting key responsibilities and achievemnts , Use action verbs and quatifiable results where possible. Make it ATS-friendly. and only return text no options or anything else ",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.choices[0].message.content;

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// controller for uploading a resume to database
// POST : /api/ai/upload-resume
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText || !title) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const safeText = resumeText.slice(0, 8000);

    const response = await ai.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [
        {
          role: "system",
          content: "Extract structured resume data and return ONLY valid JSON.",
        },
        {
          role: "user",
          content: safeText,
        },
      ],
    });

    const raw = response.choices[0].message.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsedData;
    try {
      parsedData = JSON.parse(raw);
    } catch {
      console.error("AI RAW:", raw);
      return res.status(500).json({ message: "Invalid AI JSON" });
    }

    const newResume = await Resume.create({
      userId,
      title,
      ...parsedData,
    });

    return res.json({ resumeId: newResume._id });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};


