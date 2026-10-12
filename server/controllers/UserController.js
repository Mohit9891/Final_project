import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import Resume from "../models/Resume.js"; // ⚠️ make sure this path is correct

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// POST /api/users/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id);

    newUser.password = undefined;

    res.status(201).json({
      message: "User created successfully",
      token,
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ FIX: use bcrypt.compare directly instead of comparePassword instance method
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(existingUser._id);

    existingUser.password = undefined;

    res.status(200).json({
      message: "Login successful",
      token,
      user: existingUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/users/data
export const getUserById = async (req, res) => {
  try {
    const userId = req.userId;

    // ✅ FIX: was `User.findById` (missing call) — now `User.findById(userId)`
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/users/resumes
export const getUserResumes = async (req, res) => {
  try {
    const userId = req.userId;

    const resumes = await Resume.find({ userId });
    return res.status(200).json({ resumes });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/users/skills — aggregate all skills from user's resumes
export const getUserSkills = async (req, res) => {
  try {
    const userId = req.userId;

    const resumes = await Resume.find({ userId }).select("skills experience projects education personal_info").lean();

    const skillSet = new Set();
    const roles = new Set();

    for (const resume of resumes) {
      // From skills array
      if (Array.isArray(resume.skills)) {
        resume.skills.forEach((s) => {
          if (typeof s === "string" && s.trim()) skillSet.add(s.trim());
        });
      }

      // From experience descriptions — extract tech keywords
      if (Array.isArray(resume.experience)) {
        resume.experience.forEach((exp) => {
          if (exp.description) extractTechKeywords(exp.description, skillSet);
          if (exp.position) roles.add(exp.position);
        });
      }

      // From projects descriptions
      if (Array.isArray(resume.projects)) {
        resume.projects.forEach((proj) => {
          if (proj.description) extractTechKeywords(proj.description, skillSet);
          if (proj.type) skillSet.add(proj.type);
        });
      }

      // From professional summary
      if (resume.professional_summary) {
        extractTechKeywords(resume.professional_summary, skillSet);
      }

      // From personal_info
      if (resume.personal_info?.profession) {
        roles.add(resume.personal_info.profession);
      }
    }

    return res.status(200).json({
      skills: [...skillSet],
      roles: [...roles],
      resumeCount: resumes.length,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const TECH_KEYWORDS = [
  "JavaScript", "TypeScript", "React", "React.js", "Next.js", "NextJS",
  "Vue", "Vue.js", "Angular", "Node.js", "NodeJS", "Express", "Express.js",
  "Python", "Django", "Flask", "FastAPI",
  "Java", "Spring", "Spring Boot",
  "C++", "C#", ".NET", "Go", "Golang", "Rust", "Ruby", "Rails", "PHP", "Laravel",
  "Swift", "Kotlin", "Flutter", "React Native",
  "HTML", "HTML5", "CSS", "CSS3", "SASS", "SCSS", "Tailwind", "Tailwind CSS", "Bootstrap",
  "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "DynamoDB", "Cassandra",
  "AWS", "Azure", "GCP", "Google Cloud", "Docker", "Kubernetes", "K8s", "Terraform",
  "CI/CD", "Jenkins", "GitHub Actions", "GitLab CI",
  "Git", "GitHub", "GitLab", "Bitbucket",
  "REST", "REST API", "REST APIs", "GraphQL", "gRPC", "WebSocket",
  "Redux", "Zustand", "MobX", "Context API",
  "Webpack", "Vite", "Babel", "ESLint",
  "Jest", "Mocha", "Cypress", "Playwright", "Selenium",
  "Linux", "Nginx", "Apache",
  "Figma", "Adobe XD", "Sketch",
  "TensorFlow", "PyTorch", "Machine Learning", "ML", "AI", "Artificial Intelligence",
  "LangChain", "OpenAI", "LLM", "NLP",
  "Kafka", "RabbitMQ", "ActiveMQ",
  "Agile", "Scrum", "Jira", "Confluence",
  "Pandas", "NumPy", "SciPy", "Matplotlib",
  "S3", "Lambda", "EC2", "CloudFront", "DynamoDB",
  "OAuth", "JWT", "Authentication",
  "Microservices", "Serverless", "API Gateway",
  "Postman", "Swagger", "OpenAPI",
  "Data Structures", "Algorithms", "DSA", "System Design",
];

const extractTechKeywords = (text, skillSet) => {
  if (!text) return;
  const lower = text.toLowerCase();
  for (const kw of TECH_KEYWORDS) {
    if (lower.includes(kw.toLowerCase())) {
      skillSet.add(kw);
    }
  }
};
