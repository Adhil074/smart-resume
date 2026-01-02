"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatbotPage() {
  const { status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi! I'm your AI Career Assistant. I can help you with:

1. Rewrite resume sections professionally
2. Simplify job descriptions
3. Generate interview questions
4. Create quizzes on any topic
5. Provide career advice
6. Teach you any skill

What would you like help with today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("general");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          type: selectedType,
          context: messages.slice(-6),
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { label: "Rewrite Resume", type: "rewrite_resume" },
    { label: "Simplify JD", type: "simplify_jd" },
    { label: "Interview Prep", type: "interview_questions" },
    { label: "Generate Quiz", type: "generate_quiz" },
    { label: "Career Advice", type: "career_advice" },
    { label: "Teach Skill", type: "teach_skill" },
  ];

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 py-10 px-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-bold text-white mb-2">
            AI Career Assistant
          </h1>
          <p className="text-slate-300">
            Your personal AI-powered career coach
          </p>
        </header>

        {/* Quick actions */}
        <section className="bg-slate-900/40 border border-slate-700 rounded-xl p-4 md:p-5">
          <p className="text-sm font-semibold text-slate-200 mb-3">
            Quick Actions:
          </p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <button
                key={action.type}
                onClick={() => setSelectedType(action.type)}
                className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium border transition ${
                  selectedType === action.type
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700"
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </section>

        {/* Chat area */}
        <main className="bg-white rounded-2xl shadow-xl flex flex-col h-[70vh] max-h-[700px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50 border-b border-slate-200">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm md:text-base shadow ${
                    message.role === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`mt-1 text-[11px] text-right ${
                      message.role === "user"
                        ? "text-blue-100"
                        : "text-slate-400"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-xs text-slate-500">Assistant is typing…</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-4 md:p-5 space-y-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows={3}
              disabled={isLoading}
              className="w-full resize-none rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm md:text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60"
            />
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-slate-500">
                Current mode:{" "}
                <span className="font-semibold text-slate-700">
                  {selectedType.replace(/_/g, " ")}
                </span>
              </p>
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="inline-flex items-center justify-center px-5 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {isLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
