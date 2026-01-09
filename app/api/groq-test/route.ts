import { NextResponse } from "next/server";
import groq from "@/lib/groq";

export async function GET() {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You are a test bot." },
      { role: "user", content: "Say OK in one word." },
    ],
  });

  return NextResponse.json({
    reply: completion.choices[0].message.content,
  });
}