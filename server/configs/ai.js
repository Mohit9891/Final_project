import OpenAI from "openai";

let _ai = null;

const getAI = () => {
  if (!_ai) {
    _ai = new OpenAI({
      apiKey: process.env.GROQ_API,
      baseURL: process.env.AI_BASE_URL || "https://api.groq.com/openai/v1",
    });
  }
  return _ai;
};

export default { get instance() { return getAI(); } };
