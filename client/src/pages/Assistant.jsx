import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../configs/api";
import { Bot, Send, User, Sparkles, Loader2 } from "lucide-react";

const examplePrompts = [
  "Improve my resume",
  "Find jobs I qualify for",
  "What skills am I missing?",
  "Prepare me for interview",
  "Analyze this job description",
  "Rewrite my project description",
];

const Assistant = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "ai",
      content: "Hi! I'm your career copilot. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const buildSystemPrompt = () => {
    const skills = user?.skills || [];
    const experience = user?.experience || [];
    const projects = user?.projects || [];
    const summary = user?.professional_summary || "";
    const targetRole = user?.personal_info?.profession || "Software Engineer";

    let context = `You are a career copilot AI assistant. The user's profile:
- Target Role: ${targetRole}
- Skills: ${skills.join(", ") || "Not specified"}
- Experience: ${experience.length} positions
- Projects: ${projects.length} projects
- Summary: ${summary || "Not provided"}

Provide concise, actionable career advice. Be specific and reference their actual experience when possible.`;

    return context;
  };

  const handleSend = async (text) => {
    const content = text || input.trim();
    if (!content || isLoading) return;

    const userMsg = { id: Date.now(), role: "user", content };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const systemPrompt = buildSystemPrompt();
      const { data } = await api.post(
        "/api/ai/enhance-pro-sum",
        { userContent: `${systemPrompt}\n\nUser question: ${content}` },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const aiMsg = {
        id: Date.now() + 1,
        role: "ai",
        content: data.enhancedContent || "I couldn't generate a response. Please try again.",
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const aiMsg = {
        id: Date.now() + 1,
        role: "ai",
        content: "Sorry, I couldn't process your request. Please try again.",
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (prompt) => {
    handleSend(prompt);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <Bot size={24} className="text-primary-600" />
          <h1 className="text-2xl font-semibold text-surface-900">Career Copilot</h1>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-surface-200 shadow-sm flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex items-start gap-2 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "user"
                      ? "bg-primary-100 text-primary-600"
                      : "bg-surface-100 text-surface-600"
                  }`}
                >
                  {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-primary-600 text-white rounded-br-md"
                      : "bg-surface-100 text-surface-800 rounded-bl-md"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        {messages.length === 1 && (
          <div className="px-4 pb-4">
            <p className="text-xs text-surface-400 mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleExampleClick(prompt)}
                  className="px-3 py-1.5 text-xs font-medium text-surface-600 bg-white border border-surface-200 rounded-full hover:bg-surface-50 hover:border-primary-300 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-surface-200 p-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your career..."
              className="flex-1 px-4 py-2.5 bg-white border border-surface-200 rounded-lg text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="p-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;