//smart-resume\lib\atsAnalyzer.ts

export interface ATSScore {
  overallScore: number; // 0-100
  breakdown: {
    keywordsMatched: {
      score: number;
      found: string[];
      missing: string[];
    };
    formatting: {
      score: number;
      issues: string[];
    };
    metrics: {
      score: number;
      found: number;
      recommendation: string;
    };
    bulletPoints: {
      score: number;
      issues: string[];
    };
    contact: {
      score: number;
      issues: string[];
    };
  };
}

export function analyzeATSScore(
  extractedText: string,
  foundSkills: string[],
  allSkills: string[]
): ATSScore {
  let overallScore = 100;
  const issues = {
    formatting: [] as string[],
    metrics: [] as string[],
    bulletPoints: [] as string[],
    contact: [] as string[],
  };

  // 1. Keywords Matched (30% weight)
  const missingSkills = allSkills.filter(
    (skill) => !foundSkills.includes(skill)
  );
  const keywordScore =
    (foundSkills.length /
      (foundSkills.length + Math.min(missingSkills.length, 5))) *
    100;
  overallScore -= (100 - keywordScore) * 0.3;

  // 2. Formatting Check (20% weight)
  let formatScore = 100;
  const textLower = extractedText.toLowerCase();

  if (!textLower.includes("email") || !textLower.includes("phone")) {
    issues.contact.push("Missing email or phone number");
    formatScore -= 20;
  }
  if (textLower.includes("objective")) {
    issues.formatting.push(
      "Resume objective is outdated - use professional summary"
    );
    formatScore -= 10;
  }
  if (extractedText.split("").length < 10) {
    issues.formatting.push("Resume seems too short (should be 1-2 pages)");
    formatScore -= 15;
  }

  overallScore -= (100 - formatScore) * 0.2;

  // 3. Metrics/Numbers (20% weight)
  const metricRegex =
    /(d+%|d+s*%|increased|decreased|improved|reduced|achieved)/gi;
  const metricsFound = (extractedText.match(metricRegex) || []).length;
  const metricScore = Math.min((metricsFound / 5) * 100, 100);

  if (metricsFound < 3) {
    issues.metrics.push(
      "Add quantifiable metrics (%, numbers, increased/decreased) to bullets"
    );
  }

  overallScore -= (100 - metricScore) * 0.2;

  // 4. Bullet Points (20% weight)
  let bulletScore = 100;
  const lines = extractedText.split("").filter((l) => l.trim().length > 0);

  const hasActionVerbs =
    /^(managed|led|developed|designed|implemented|created|improved|increased|reduced|achieved)/i;
  const actionVerbCount = lines.filter((l) =>
    hasActionVerbs.test(l.trim())
  ).length;

  if (actionVerbCount < lines.length * 0.5) {
    issues.bulletPoints.push(
      "Use strong action verbs (Managed, Led, Developed, etc.) at start of bullets"
    );
    bulletScore -= 25;
  }

  overallScore -= (100 - bulletScore) * 0.2;

  // 5. Contact Info (10% weight)
  let contactScore = 100;
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}/.test(
    extractedText
  );
  const hasPhone = /(d{3}[-.s]?d{3}[-.s]?d{4}|d{10})/.test(extractedText);

  if (!hasEmail || !hasPhone) {
    issues.contact.push("Ensure email and phone number are clearly visible");
    contactScore -= 30;
  }

  overallScore -= (100 - contactScore) * 0.1;

  return {
    overallScore: Math.max(Math.min(Math.round(overallScore), 100), 0),
    breakdown: {
      keywordsMatched: {
        score: Math.round(keywordScore),
        found: foundSkills.slice(0, 5),
        missing: missingSkills.slice(0, 5),
      },
      formatting: {
        score: Math.round(formatScore),
        issues: issues.formatting,
      },
      metrics: {
        score: Math.round(metricScore),
        found: metricsFound,
        recommendation:
          metricsFound < 3
            ? "Add 3-5 quantifiable metrics per bullet"
            : "Good! You have quantifiable metrics",
      },
      bulletPoints: {
        score: Math.round(bulletScore),
        issues: issues.bulletPoints,
      },
      contact: {
        score: Math.round(contactScore),
        issues: issues.contact,
      },
    },
  };
}
