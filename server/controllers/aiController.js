import Resume from "../models/Resume.js";
import aiConfig from "../configs/ai.js";

const CHAT_MODEL = process.env.MODEL || "qwen/qwen3.8-27b";
const FALLBACK_MODELS = [
  CHAT_MODEL,
  "qwen/qwen3.8-27b",
  "llama-3.1-8b-instant",
].filter((m, i, arr) => m && arr.indexOf(m) === i);

const stripThinkTags = (text) =>
  text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

const isModelUnavailable = (error) => {
  const msg = String(error?.message || "");
  return (
    error?.status === 404 ||
    /does not exist|do not have access|model_not_found|invalid model|decommissioned|deprecated/i.test(
      msg,
    )
  );
};

// Calls the configured model, falling back to known-good ones if Groq has
// retired or renamed it (e.g. MODEL=llama-3.3-70b-versatile no longer exists).
const chatCompletion = async (payload) => {
  let lastError;
  for (const model of FALLBACK_MODELS) {
    try {
      return await aiConfig.instance.chat.completions.create({ ...payload, model });
    } catch (error) {
      lastError = error;
      if (!isModelUnavailable(error)) throw error;
      console.warn(`Model "${model}" unavailable, trying next: ${error.message}`);
    }
  }
  throw lastError;
};

// controller for enhancing a resume professional summary
// POST : /api/ai/enhance-pro-sum

export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent || typeof userContent !== "string") {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await chatCompletion({
      max_tokens: 256,
      messages: [
        {
          role: "system",
          content:
            "Enhance this resume professional summary in 1-2 sentences. Be compelling, ATS-friendly, highlight key skills. Return only the text.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = stripThinkTags(response.choices?.[0]?.message?.content || "");
    if (!enhancedContent) {
      return res.status(502).json({ message: "AI returned no content" });
    }

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

    if (!userContent || typeof userContent !== "string") {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await chatCompletion({
      max_tokens: 256,
      messages: [
        {
          role: "system",
          content:
            "Enhance this job description in 1-2 sentences. Use action verbs, quantify results. Be ATS-friendly. Return only the text.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = stripThinkTags(response.choices?.[0]?.message?.content || "");
    if (!enhancedContent) {
      return res.status(502).json({ message: "AI returned no content" });
    }

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

    const safeText = resumeText.slice(0, 1000);

    const response = await chatCompletion({
      max_tokens: 768,
      messages: [
        {
          role: "system",
          content: `Return ONLY valid JSON:
{"professional_summary":"","skills":[],"personal_info":{"full_name":"","profession":"","email":"","phone":"","location":"","linkedin":"","website":"","image":""},"experience":[{"company":"","position":"","start_date":"","end_date":"","description":"","is_current":false}],"projects":[{"name":"","type":"","description":""}],"education":[{"institution":"","degree":"","field":"","graduation_date":"","gpa":""}]}
No markdown, no backticks, no explanation. Only JSON.`,
        },
        { role: "user", content: safeText },
      ],
    });

    const raw = stripThinkTags(response.choices?.[0]?.message?.content || "")
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    if (!raw) {
      return res.status(502).json({ message: "AI returned no content" });
    }

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

    const newResume = await Resume.create({
      userId,
      title,
      professional_summary: parsedData.professional_summary || "",
      skills: Array.isArray(parsedData.skills)
        ? parsedData.skills.filter((s) => typeof s === "string")
        : [],
      personal_info: parsedData.personal_info || {},
      experience: experienceToSave,
      projects: projectsToSave,
      education: educationToSave,
    });

    return res.json({ resumeId: newResume._id });
  } catch (err) {
    console.error("UPLOAD ERROR:", err.message);
    return res.status(500).json({ message: err.message });
  }
};
