import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { jdText } = await req.json();

    if (!jdText || !jdText.trim()) {
      return NextResponse.json(
        { error: "Missing JD text" },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            "Extract ONLY technical and soft skills from the job description. Return a pure JSON array of strings. No explanation. No markdown.",
        },
        {
          role: "user",
          content: jdText,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "[]";

    let skills: string[] = [];
    try {
      skills = JSON.parse(raw);
    } catch {
      skills = [];
    }

    return NextResponse.json({ skills });
  } catch (err) {
    console.error("GROQ_JD_ANALYZE_ERROR", err);
    return NextResponse.json(
      { error: "JD analysis failed" },
      { status: 500 }
    );
  }
}