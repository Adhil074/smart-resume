import { analyzeATSScore } from "@/lib/atsAnalyzer";
import { SKILLS_LIST } from "@/lib/skills";

type AnalyzeInput = {
  fileBuffer: Buffer;
  mimeType: string;
};

type AnalyzeResult = {
  extractedText: string;
  skills: string[];
  weakBullets: string[];
  structureIssues: string[];
  suggestions: string[];
  atsScore: ReturnType<typeof analyzeATSScore>;
};

export async function analyzeResumeWithAI(
  input: AnalyzeInput
): Promise<AnalyzeResult> {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY not configured");
  }

  const base64File = input.fileBuffer.toString("base64");

  const systemPrompt = `
You are an ATS resume analyzer.

Your tasks:
1. Extract full readable resume text
2. Identify key skills present
3. Detect weak bullet points
4. Detect structure / formatting issues
5. Give concrete improvement suggestions

Return STRICT JSON ONLY in this format:

{
  "extractedText": string,
  "skills": string[],
  "weakBullets": string[],
  "structureIssues": string[],
  "suggestions": string[]
}
`;

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
            role: "user",
            parts: [
              { text: systemPrompt },
              {
                inlineData: {
                  mimeType: input.mimeType,
                  data: base64File,
                },
              },
            ],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    console.error("Gemini resume analysis error:", err);
    throw new Error("Gemini resume analysis failed");
  }

  const data = await response.json();

  const rawText =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  let parsed: {
    extractedText: string;
    skills: string[];
    weakBullets: string[];
    structureIssues: string[];
    suggestions: string[];
  };

  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error("AI returned invalid JSON");
  }

  const atsScore = analyzeATSScore(
    parsed.extractedText,
    parsed.skills,
    SKILLS_LIST
  );

  return {
    extractedText: parsed.extractedText,
    skills: parsed.skills,
    weakBullets: parsed.weakBullets,
    structureIssues: parsed.structureIssues,
    suggestions: parsed.suggestions,
    atsScore,
  };
}