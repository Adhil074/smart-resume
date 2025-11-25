import { NextRequest, NextResponse } from "next/server";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: NextRequest) {
  try {
    const { bullet, jobTitle, experience } = await request.json();
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const prompt = `You are an expert resume writer. Improve this bullet point.
Current bullet: "${bullet}"
${jobTitle ? `Job Title: ${jobTitle}` : ""}
${experience ? `Experience: ${experience} years` : ""}

Provide ONLY the improved bullet, nothing else.`;

    let lastError;
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
          // If overloaded, retry
          if (
            response.status === 429 ||
            data.error?.message?.includes("overloaded")
          ) {
            console.log(`Attempt ${attempt + 1} failed. Retrying...`);
            await sleep(RETRY_DELAY * (attempt + 1)); // Exponential backoff
            continue;
          }
          throw new Error(data.error?.message || "API error");
        }

        const improvedBullet =
          data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        return NextResponse.json({
          success: true,
          original: bullet,
          improved: improvedBullet.trim(),
        });
      } catch (error) {
        lastError = error;
        if (attempt < MAX_RETRIES - 1) {
          await sleep(RETRY_DELAY * (attempt + 1));
        }
      }
    }

    throw lastError;
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: `Server error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
