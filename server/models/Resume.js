import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, default: "Untitled Resume" },
    public: { type: Boolean, default: false },
    template: { type: String, default: "classic" },
    accentColor: { type: String, default: "#3B82F6" },

    professional_summary: { type: String, default: "" },
    skills: [{ type: String }],

    personal_info: {
      image: { type: String, default: "" },
      full_name: { type: String, default: "" },
      profession: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      website: { type: String, default: "" },
    },

    experience: [
      {
        _id: false,
        company: String,
        position: String,
        start_date: String,
        end_date: String,
        description: String,
        is_current: Boolean,
      },
    ],

    projects: [
      {
        _id: false,
        name: String,
        type: { type: String, default: "" }, // ✅ fix: wrap 'type' to avoid Mongoose reserved keyword conflict
        description: String,
      },
    ],

    education: [
      {
        _id: false,
        institution: String,
        degree: String,
        field: String,
        graduation_date: String,
        gpa: String,
      },
    ],
  },
  { timestamps: true, minimize: false }
);

const Resume = mongoose.model("Resume", ResumeSchema);

export default Resume;