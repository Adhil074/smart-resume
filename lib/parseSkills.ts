import { SKILLS_LIST } from "./skills";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fallback: match from static skills list
function fallbackSkillExtraction(text: string): string[] {
  const foundSkills: string[] = [];
  const lowerText = text.toLowerCase();

  for (const skill of SKILLS_LIST) {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  }

  return [...new Set(foundSkills)];
}

// AI skill extraction with retry & backoff
export async function extractSkillsWithAI(text: string): Promise<string[]> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("Google API key not configured");
  }

  const prompt = `Extract ALL professional skills from this resume text.
Include: programming languages, tools, frameworks, soft skills, certifications, domains, etc.
Return ONLY a JSON array of skills. Example: ["Python", "Leadership", "Project Management"]

Resume:
${text}

Return ONLY the JSON array, nothing else.`;

  let lastError: any;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Retry if overloaded or rate limited
        if (
          response.status === 429 ||
          data.error?.message?.includes("overloaded")
        ) {
          await sleep(RETRY_DELAY * (attempt + 1));
          continue;
        }
        throw new Error(data.error?.message || "API error");
      }

      const skillsJson = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      const skills = JSON.parse(skillsJson);
      return Array.isArray(skills) ? [...new Set(skills)] : [];
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES - 1) {
        await sleep(RETRY_DELAY * (attempt + 1));
      }
    }
  }
  throw lastError;
}

// Hybrid findSkillsInText function for your API route
export async function findSkillsInText(text: string): Promise<string[]> {
  try {
    const skills = await extractSkillsWithAI(text);
    if (skills.length > 0) {
      return skills;
    }
  } catch (error) {
    console.warn("AI skill extraction failed, falling back to static list");
  }
  return fallbackSkillExtraction(text);
}
