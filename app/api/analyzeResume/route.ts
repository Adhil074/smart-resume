import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" +
  process.env.GOOGLE_API_KEY;

export async function POST(req: NextRequest) {
  try {
    /* ---------- AUTH ---------- */
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* ---------- INPUT ---------- */
    const body = (await req.json()) as { resumeId?: string };
    const { resumeId } = body;

    if (!resumeId || !mongoose.Types.ObjectId.isValid(resumeId)) {
      return NextResponse.json({ error: "Invalid resume id" }, { status: 400 });
    }

    /* ---------- DB ---------- */
    await connectDB();

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: token.sub,
    });

    if (!resume || !resume.fileData) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json({ error: "AI key missing" }, { status: 500 });
    }

    const base64Pdf = resume.fileData.toString("base64");

    /* ---------- ATS ANALYSIS ---------- */
    const analysisPrompt = `
You are an ATS resume reviewer.

Analyze the resume and return:
1. ATS score (0–100)
2. Weak bullet points
3. Formatting issues
4. Clear improvement suggestions
`;

    const analysisRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: analysisPrompt },
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

    if (!analysisRes.ok) {
      throw new Error("Gemini ATS analysis failed");
    }

    const analysisData = await analysisRes.json();
    const analysisText: string =
      analysisData.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    /* ---------- SKILL EXTRACTION ---------- */
    //     const skillPrompt = `
    // Extract ONLY skills from this resume.
    // Return a clean JSON array of strings.
    // No explanation. No markdown.
    // `;

    //     const skillRes = await fetch(GEMINI_URL, {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({
    //         contents: [
    //           {
    //             parts: [
    //               { text: skillPrompt },
    //               {
    //                 inlineData: {
    //                   mimeType: resume.mimeType,
    //                   data: base64Pdf,
    //                 },
    //               },
    //             ],
    //           },
    //         ],
    //       }),
    //     });

    //     if (!skillRes.ok) {
    //       throw new Error("Skill extraction failed");
    //     }

    //     const skillData = await skillRes.json();
    //     let skillText =
    //       skillData.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";

    //     skillText = skillText.replace(/```json|```/g, "").trim();

    //     let extractedSkills: string[] = [];

    //     try {
    //       const parsed = JSON.parse(skillText);
    //       if (Array.isArray(parsed)) {
    //         extractedSkills = parsed;
    //       }
    //     } catch {
    //       extractedSkills = [];
    //     }

    const skillPrompt = `
Extract ONLY skills from this resume.
Return a JSON array of strings.
No explanation. No markdown.
`;

    const skillRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: skillPrompt },
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

    if (!skillRes.ok) {
      throw new Error("Skill extraction failed");
    }

    const skillData = await skillRes.json();

    const rawSkillText: string =
      skillData.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    /* ---------- SAFE PARSING ---------- */
    let extractedSkills: string[] = [];

    try {
      // extract first JSON array from text
      const match = rawSkillText.match(/\[[\s\S]*\]/);

      if (match) {
        const parsed = JSON.parse(match[0]);

        if (Array.isArray(parsed)) {
          extractedSkills = parsed
            .filter((s): s is string => typeof s === "string")
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }
    } catch  {
      console.error("SKILL_PARSE_FAILED:", rawSkillText);
    }

    /* ---------- SAVE ONCE ---------- */
    // resume.analysisResult = analysisText;
    // resume.extractedSkills = extractedSkills;
    // await resume.save();
    resume.analysisResult = analysisText;

    // 🔐 only overwrite skills if we actually got some
    if (extractedSkills.length > 0) {
      resume.extractedSkills = extractedSkills;
    }

    await resume.save();

    /* ---------- RESPONSE ---------- */
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
// //app\api\analyzeResume\route.ts

// import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";
// import mongoose from "mongoose";

// import connectDB from "@/lib/mongodb";
// import Resume from "@/models/Resume";

// export async function POST(req: NextRequest) {
//   try {
//     /* ---------- AUTH ---------- */
//     const token = await getToken({
//       req,
//       secret: process.env.NEXTAUTH_SECRET,
//     });

//     if (!token || !token.sub) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     /* ---------- INPUT ---------- */
//     const body = (await req.json()) as {
//       resumeId?: string;
//     };

//     const { resumeId } = body;

//     if (!resumeId || !mongoose.Types.ObjectId.isValid(resumeId)) {
//       return NextResponse.json({ error: "Invalid resume id" }, { status: 400 });
//     }

//     /* ---------- DB ---------- */
//     await connectDB();

//     const resume = await Resume.findOne({
//       _id: resumeId,
//       userId: token.sub,
//     });

//     if (!resume || !resume.fileData) {
//       return NextResponse.json({ error: "Resume not found" }, { status: 404 });
//     }

//     /* ---------- AI (Gemini PDF Analysis) ---------- */

//     const apiKey = process.env.GOOGLE_API_KEY;
//     if (!apiKey) {
//       return NextResponse.json({ error: "AI key missing" }, { status: 500 });
//     }

//     const base64Pdf = resume.fileData.toString("base64");

//     const prompt = `
// You are an ATS resume reviewer.

// Analyze the resume and return:
// 1. ATS score (0–100)
// 2. Weak bullet points
// 3. Formatting issues
// 4. Clear improvement suggestions
// `;

//     const aiRes = await fetch(
//       `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [
//                 { text: prompt },
//                 {
//                   inlineData: {
//                     mimeType: resume.mimeType,
//                     data: base64Pdf,
//                   },
//                 },
//               ],
//             },
//           ],
//         }),
//       }
//     );

//     if (!aiRes.ok) {
//       throw new Error("Gemini API failed");
//     }

//     const aiData = await aiRes.json();

//     const aiText: string =
//       aiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

//     /* ---------- SAVE ---------- */
//     // resume.extractedText = extractedText;
//     resume.analysisResult = aiText;
//     await resume.save();

//     /* ---------- RESPONSE ---------- */
//     return NextResponse.json({
//       success: true,
//       analysis: aiText,
//     });
//   } catch (err) {
//     console.error("ANALYZE_RESUME_ERROR", err);
//     return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
//   }
// }

// app/api/analyzeResume/route.ts
