//app\api\jd\analyzegroq\route.ts

import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { jdText } = await req.json();

    if (!jdText || !jdText.trim()) {
      return NextResponse.json({ error: "Missing JD text" }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            "Extract ONLY technical and professional skills. Return a JSON array of short skill names. No sentences. No explanations.",
        },
        {
          role: "user",
          content: jdText,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "[]";

    let skills: string[] = [];

    const match = raw.match(/\[[\s\S]*\]/);
    if (match) {
      try {
        const parsed = JSON.parse(match[0]);
        if (Array.isArray(parsed)) {
          skills = parsed
            .filter((s): s is string => typeof s === "string")
            .map((s) => s.trim())
            .filter(Boolean);
        }
      } catch {
        skills = [];
      }
    }

    return NextResponse.json({ skills });
  } catch (err) {
    console.error("GROQ_JD_ANALYZE_ERROR", err);
    return NextResponse.json({ error: "JD analysis failed" }, { status: 500 });
  }
}
