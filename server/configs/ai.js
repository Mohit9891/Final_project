import OpenAI from "openai";

const ai = new OpenAI({
    apiKey: process.env.GROQ_API,
    baseURL: process.env.AI_BASE_URL || "https://api.groq.com/openai/v1",
});

export default ai;