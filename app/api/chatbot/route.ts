//app\api\chatbot\route.ts

import { NextRequest, NextResponse } from "next/server";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" +
  process.env.GOOGLE_API_KEY;

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(req: NextRequest) {
  try {
    const { message, type, context } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    let systemPrompt = "";

    switch (type) {
      case "rewrite_resume":
        systemPrompt = `You are a professional resume writer. Rewrite the following resume content to be more professional, impactful, and ATS-friendly. Use action verbs, quantify achievements, and make it concise:

${message}`;
        break;

      case "simplify_jd":
        systemPrompt = `You are a job description expert. Simplify and clarify the following job description. Make it easy to understand, highlight key requirements, and remove jargon:

${message}`;
        break;

      case "interview_questions":
        systemPrompt = `Based on this job description, generate 10 challenging interview questions that test both technical skills and behavioral competencies. Include a mix of technical, situational, and behavioral questions:

${message}`;
        break;

      case "generate_quiz":
        systemPrompt = `Generate a 10-question multiple-choice quiz on the topic: "${message}". Each question should have 4 options (A, B, C, D) and indicate the correct answer. Format each question clearly.`;
        break;

      case "career_advice":
        systemPrompt = `You are a career counselor and mentor. Provide thoughtful, actionable career advice for the following question:

${message}`;
        break;

      case "teach_skill":
        systemPrompt = `You are an expert teacher. Explain the following skill or concept in a clear, beginner-friendly way with examples and practical tips:

${message}`;
        break;

      default:
        systemPrompt = `You are a helpful AI assistant specialized in career guidance, resume writing, job searching, and professional development. Answer the following:

${message}`;
    }

    // adds context if provided
    if (context && context.length > 0) {
      const contextStr = context
        .map(
          (msg: { role: string; content: string }) =>
            `${msg.role}: ${msg.content}`,
        )
        .join("\n");

      systemPrompt = `Previous conversation:
${contextStr}

${systemPrompt}`;
    }

    //tries gemini first
    try {
      const response = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: systemPrompt }],
            },
          ],
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Gemini failed: ${err}`);
      }

      const data = await response.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

      if (!text) {
        throw new Error("Gemini returned empty response");
      }

      return NextResponse.json({
        response: text,
        provider: "gemini",
        success: true,
      });
    } catch (geminiError) {
      console.error("Gemini failed, falling back to Groq:", geminiError);
    }

    // falls back to groq
    try {
      if (!process.env.GROQ_API_KEY) {
        throw new Error("Groq API key not configured");
      }

      const groqRes = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          temperature: 0.7,
          messages: [
            {
              role: "system",
              content:
                "You are a helpful AI assistant specialized in career guidance, resume writing, and professional development.",
            },
            {
              role: "user",
              content: systemPrompt,
            },
          ],
        }),
      });

      if (!groqRes.ok) {
        const err = await groqRes.text();
        throw new Error(`Groq failed: ${err}`);
      }

      const groqData = await groqRes.json();
      const groqText = groqData?.choices?.[0]?.message?.content?.trim() ?? "";

      if (!groqText) {
        throw new Error("Groq returned empty response");
      }

      return NextResponse.json({
        response: groqText,
        provider: "groq",
        success: true,
      });
    } catch (groqError) {
      console.error("Groq fallback failed:", groqError);

      return NextResponse.json(
        { error: "All AI providers failed" },
        { status: 500 },
      );
    }
  } catch (error: unknown) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate response",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
