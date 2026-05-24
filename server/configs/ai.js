import OpenAI from "openai";

const ai = new OpenAI({
    apiKey: process.env.GROQ_API,
    baseURL: process.env.BASE_URL,
});

export default ai;