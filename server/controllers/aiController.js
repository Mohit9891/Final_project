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
      model: process.env.MODEL, // ✅ fixed: was hardcoded "gemini-3-flash-preview"
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
  console.log("🔥 NEW CODE RUNNING");
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText || !title) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const safeText = resumeText.slice(0, 1500);

    const response = await ai.chat.completions.create({
      model: process.env.MODEL,
      messages: [
        {
          role: "system",
          content: `Extract resume data and return ONLY a valid JSON object with exactly this structure:
{"professional_summary":"string","skills":["skill1"],"personal_info":{"full_name":"","profession":"","email":"","phone":"","location":"","linkedin":"","website":"","image":""},"experience":[{"company":"","position":"","start_date":"","end_date":"","description":"","is_current":false}],"projects":[{"name":"","type":"","description":""}],"education":[{"institution":"","degree":"","field":"","graduation_date":"","gpa":""}]}
CRITICAL: Use double quotes only. Return ONLY the JSON. No markdown, no backticks, no explanation.`,
        },
        { role: "user", content: safeText },
      ],
    });

    const raw = response.choices[0].message.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("AI RAW OUTPUT:", raw.slice(0, 300));

    let parsedData;
    try {
      parsedData = JSON.parse(raw);
    } catch {
      return res.status(500).json({ message: "Invalid AI JSON response" });
    }

    // force all array fields to only contain plain objects
    const safeArray = (val) => {
      if (!Array.isArray(val)) return [];
      return val.filter(
        (item) =>
          typeof item === "object" && item !== null && !Array.isArray(item),
      );
    };

    const projectsToSave = safeArray(parsedData.projects);
    const experienceToSave = safeArray(parsedData.experience);
    const educationToSave = safeArray(parsedData.education);

    console.log("PROJECTS:", JSON.stringify(projectsToSave));
    console.log("EXPERIENCE:", JSON.stringify(experienceToSave));
    console.log("EDUCATION:", JSON.stringify(educationToSave));

    const newResume = await Resume.create({
      userId,
      title,
      professional_summary: parsedData.professional_summary || "",
      skills: Array.isArray(parsedData.skills)
        ? parsedData.skills.filter((s) => typeof s === "string")
        : [],
      personal_info: parsedData.personal_info || {},
      experience: safeArray(parsedData.experience),
      projects: safeArray(parsedData.projects),
      education: safeArray(parsedData.education),
    });

    return res.json({ resumeId: newResume._id });
  } catch (err) {
    console.error("UPLOAD ERROR:", err.message);
    return res.status(500).json({ message: err.message });
  }
};
