export function extractSkillsFromText(text: string): string[] {
  const foundSkills = new Set<string>();

  // Common skill separators and patterns
  const lines = text.split(/\n+/);

  lines.forEach((line) => {
    // Look for "Skills:" section and skip the header
    if (
      line.toLowerCase().trim() === "skills" ||
      line.toLowerCase().trim() === "skills:"
    ) {
      return;
    }

    // Extract items from lines that look like skills
    // Skills are separated by: commas, semicolons, pipes, colons, or bullets
    const skillsInLine = line
      .split(/[,;|:•]/)
      // ← ADD COLON HERE
      .map((skill) => skill.trim())
      .filter((skill) => {
        // Filter out empty strings and very short text
        return (
          skill.length > 1 &&
          skill.length < 50 && // Skill names shouldn't be too long
          !/^[0-9.]+$/.test(skill) && // Not just numbers
          skill.toLowerCase() !== "skills" // Not the word "skills"
        );
      });

    skillsInLine.forEach((skill) => foundSkills.add(skill));
  });

  // Also try to extract skills from bullet points
  const bulletPoints = text.match(/[-•*]s*([^]+)/g) || [];

  bulletPoints.forEach((bullet) => {
    const skillText = bullet.replace(/[-•*]s*/, "").trim();
    if (
      skillText.length > 1 &&
      skillText.length < 50 &&
      skillText.toLowerCase() !== "skills"
    ) {
      foundSkills.add(skillText);
    }
  });

  return Array.from(foundSkills).filter((s) => s.length > 0);
}
