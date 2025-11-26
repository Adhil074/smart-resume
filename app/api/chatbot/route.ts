import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, type, context } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Create system prompts based on type
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

    // Add context if provided
    if (context && context.length > 0) {
      const contextStr = context
        .map(
          (msg: { role: string; content: string }) =>
            `${msg.role}: ${msg.content}`
        )
        .join("");

      systemPrompt = `Previous conversation:
${contextStr}

${systemPrompt}`;
    }

    // Call Gemini API directly using fetch
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: systemPrompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);
      throw new Error("Failed to get response from Gemini");
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    return NextResponse.json({
      response: text,
      success: true,
    });
  } catch (error: unknown) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate response",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
