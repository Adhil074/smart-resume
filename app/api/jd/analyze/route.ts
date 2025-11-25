import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { jdText } = await request.json();

  if (!jdText || jdText.trim() === "") {
    return NextResponse.json({ error: "No JD text provided" }, { status: 400 });
  }

  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" +
        process.env.GOOGLE_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Extract ONLY skills from this job description.
Return them as a clean JSON array of strings. No extra text.

JD:
${jdText}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await res.json();
    console.log("GEMINI RAW RESPONSE:", JSON.stringify(data, null, 2));
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

    // Clean ```json ... ``` wrapper if present
    text = text.trim();
    if (text.startsWith("```")) {
      text = text
        .replace(/^```[a-zA-Z]*\n?/, "") // remove ```json or ``` plus first newline
        .replace(/```$/, "") // remove closing ```
        .trim();
    }

    // let skills: string[] = [];

    type SkillsJSON = string[] | { skills: string[] };

    let skills: string[] = [];

    try {
      const parsed = JSON.parse(text) as SkillsJSON;

      if (Array.isArray(parsed)) {
        skills = parsed;
      } else if (parsed && Array.isArray(parsed.skills)) {
        skills = parsed.skills;
      }
    } catch (e: unknown) {
      // Fallback: split lines/commas if JSON.parse still fails
      skills = text
        .split(/[\n,]/)
        .map((s: string) => s.trim())
        .filter(Boolean);
    }

    return NextResponse.json({ skills });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "AI extraction failed" },
      { status: 500 }
    );
  }
}
