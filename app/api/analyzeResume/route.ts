// app/api/analyzeResume/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";
import { extractText } from "unpdf";

import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" +
  process.env.GOOGLE_API_KEY;

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(req: NextRequest) {
  try {
    /* ---------- AUTH ---------- */
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* ---------- INPUT ---------- */
    const { resumeId } = (await req.json()) as { resumeId?: string };

    if (!resumeId || !mongoose.Types.ObjectId.isValid(resumeId)) {
      return NextResponse.json({ error: "Invalid resume id" }, { status: 400 });
    }

    /* ---------- DB ---------- */
    await connectDB();

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: token.sub,
    });

    if (!resume?.fileData) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }
    let extractedText = resume.extractedText ?? "";

    const base64Pdf = resume.fileData.toString("base64");
    /* =====================================================
    1 TEXT EXTRACTION (Gemini → unpdf fallback)
    ===================================================== */

    let textExtracted = false;

    if (!extractedText) {
      // 1️⃣ Try Gemini first
      try {
        const textRes = await fetch(GEMINI_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: "Extract full plain resume text. No markdown." },
                  {
                    inlineData: {
                      mimeType: resume.mimeType,
                      data: base64Pdf,
                    },
                  },
                ],
              },
            ],
          }),
        });

        const textData = await textRes.json();
        const geminiText =
          textData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

        if (geminiText.trim().length >= 300) {
          extractedText = geminiText.trim();
          textExtracted = true;
        } else {
          throw new Error("Gemini text weak");
        }
      } catch {
        // 2️⃣ Fallback: unpdf (REAL text, no hallucination)
        const uint8 = new Uint8Array(
          resume.fileData instanceof Buffer
            ? resume.fileData
            : Buffer.from(resume.fileData)
        );

        const result = await extractText(uint8);
        const pdfText = result.text.join("\n").trim();

        if (pdfText.length >= 300) {
          extractedText = pdfText;
          textExtracted = true;
        }
      }

      if (textExtracted) {
        resume.extractedText = extractedText;
      }
    }

    /* ---------- FINAL VALIDATION (ONLY FAIL IF BOTH FAILED) ---------- */

    if (!extractedText || extractedText.length < 300) {
      throw new Error("Resume validation failed");
    }

    /* =====================================================
       2 ATS ANALYSIS (Gemini → Groq fallback)
    ===================================================== */

    let analysisText = "";

    const atsPrompt = `
You are an ATS resume reviewer.

Return:
1. ATS score (0-100)
2. Weak bullet points
3. Formatting issues
4. Clear improvement suggestions
`;

    try {
      const res = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: atsPrompt },
                {
                  inlineData: {
                    mimeType: resume.mimeType,
                    data: base64Pdf,
                  },
                },
              ],
            },
          ],
        }),
      });

      const data = await res.json();
      analysisText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

      const lower = analysisText.toLowerCase();
      if (
        !analysisText ||
        analysisText.length < 150 ||
        lower.includes("upload your resume") ||
        lower.includes("i don't see your resume")
      ) {
        throw new Error("Gemini ATS invalid");
      }
    } catch {
      const groqRes = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          temperature: 0,
          messages: [
            {
              role: "system",
              content:
                "You are an ATS resume reviewer. Provide a detailed ATS analysis.",
            },
            {
              role: "user",
              content: `
${atsPrompt}

=== RESUME CONTENT START ===
${extractedText}
=== RESUME CONTENT END ===
`,
            },
          ],
        }),
      });

      const groqData = await groqRes.json();
      analysisText = groqData?.choices?.[0]?.message?.content ?? "";
    }

    /* =====================================================
       3️⃣ SKILL EXTRACTION (Groq ONLY)
    ===================================================== */

    let extractedSkills: string[] = [];

    const skillRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "Extract ONLY skills. Return a JSON array of strings. No explanation.",
          },
          { role: "user", content: extractedText },
        ],
      }),
    });

    const skillData = await skillRes.json();
    const raw = skillData?.choices?.[0]?.message?.content ?? "";

    const match = raw.match(/\[[\s\S]*\]/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed)) {
        extractedSkills = parsed.filter((s) => typeof s === "string");
      }
    }

    /* ---------- SAVE ---------- */
    resume.analysisResult = analysisText;
    resume.extractedSkills = extractedSkills;
    resume.updatedAt = new Date();

    await resume.save();

    return NextResponse.json({
      success: true,
      analysis: analysisText,
      skills: extractedSkills,
    });
  } catch (err) {
    console.error("ANALYZE_RESUME_ERROR", err);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
