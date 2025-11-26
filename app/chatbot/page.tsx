// // app/chatbot/page.tsx
// "use client";

// import { useState } from "react";

// export default function ChatbotPage() {
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState<string[]>([]);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     // Add user's message to UI
//     setMessages((prev) => [...prev, "You: " + input]);

//     // Call backend API (we will build this next)
//     const res = await fetch("/api/chat", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ message: input }),
//     });

//     const data = await res.json();

//     // Add AI reply
//     setMessages((prev) => [...prev, "AI: " + data.reply]);

//     setInput("");
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>AI Resume Assistant</h1>

//       {/* Show messages */}
//       <div style={{ margin: "20px 0", minHeight: "200px", padding: "10px", border: "1px solid #ccc" }}>
//         {messages.map((msg, i) => (
//           <p key={i}>{msg}</p>
//         ))}
//       </div>

//       {/* Input box */}
//       <input
//         type="text"
//         style={{ width: "70%", padding: "10px" }}
//         placeholder="Ask something..."
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//       />

//       <button
//         style={{ marginLeft: "10px", padding: "10px" }}
//         onClick={sendMessage}
//       >
//         Send
//       </button>
//     </div>
//   );
// }

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
  const { data: session, status } = useSession();
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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>AI Career Assistant</h1>
      <p>Your personal AI-powered career coach</p>

      <div>
        <p>Quick Actions:</p>
        {quickActions.map((action) => (
          <button
            key={action.type}
            onClick={() => setSelectedType(action.type)}
          >
            {action.label}
          </button>
        ))}
      </div>

      <div>
        <div>
          {messages.map((message, index) => (
            <div key={index}>
              <div>
                <p>{message.content}</p>
                <p>{message.timestamp.toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
          {isLoading && <div>Loading...</div>}
          <div ref={messagesEndRef} />
        </div>

        <div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            rows={3}
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading || !input.trim()}>
            {isLoading ? "Sending..." : "Send"}
          </button>
          <p>Current mode: {selectedType.replace(/_/g, " ")}</p>
        </div>
      </div>
    </div>
  );
}
