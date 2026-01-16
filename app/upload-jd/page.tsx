//  app\upload-jd\page.tsx

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LearningResources from "@/app/components/LearningResources";

type LatestResume = {
  extractedSkills: string[];
} | null;

export default function UploadJDPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔐 URL MODE (single source of truth)
  const mode = searchParams.get("mode"); // "match" | null
  const isMatchMode = mode === "match";

  const [jdText, setJdText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [groqSkills, setGroqSkills] = useState<string[]>([]);
  const [matchPercent, setMatchPercent] = useState<number | null>(null);
  const [matchedSkills, setMatchedSkills] = useState<string[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [resumeExists, setResumeExists] = useState<boolean | null>(null);
  const [didComputeMatch, setDidComputeMatch] = useState(false);

  function normalize(skill: string): string {
    return skill
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .trim();
  }

  async function handleAnalyze() {
    if (!jdText.trim()) {
      alert("Please paste a job description");
      return;
    }

    setIsLoading(true);

    // 🔥 Hard reset every run
    setMatchPercent(null);
    setMatchedSkills([]);
    setMissingSkills([]);
    setDidComputeMatch(false);
    setResumeExists(null);

    let resumeSkills: string[] = [];

    /* ================= MATCH MODE ONLY ================= */
    if (isMatchMode) {
      const resumeRes = await fetch("/api/resume/latest", {
        credentials: "include",
      });

      if (resumeRes.ok) {
        const resumeData: { resume: LatestResume } = await resumeRes.json();
        resumeSkills = resumeData.resume?.extractedSkills ?? [];
      }

      setResumeExists(resumeSkills.length > 0);
    }

    /* ================= JD SKILL EXTRACTION ================= */
    const jdRes = await fetch("/api/jd/analyzegroq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jdText }),
    });

    const jdData: { skills?: string[] } = await jdRes.json();
    const jdSkills = jdData.skills ?? [];
    setGroqSkills(jdSkills);

    /* ================= MATCH CALCULATION ================= */
    if (isMatchMode && resumeSkills.length > 0 && jdSkills.length > 0) {
      const resumeSet = new Set(resumeSkills.map(normalize));
      const jdNormalized = jdSkills.map(normalize);

      const matched = jdNormalized.filter((s) => resumeSet.has(s));
      const missing = jdNormalized.filter((s) => !resumeSet.has(s));

      const percent = Math.round((matched.length / jdNormalized.length) * 100);

      setMatchPercent(percent);
      setMatchedSkills(matched);
      setMissingSkills(missing);
      setDidComputeMatch(true);
    }

    /* ================= SAVE JD ================= */
    await fetch("/api/jd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jdText, skills: jdSkills }),
    });

    setIsLoading(false);
  }

  function handleJDChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setJdText(e.target.value);

    // 🔥 Absolute kill switch for stale match
    setMatchPercent(null);
    setMatchedSkills([]);
    setMissingSkills([]);
    setDidComputeMatch(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-linear-to-br from-slate-900 to-slate-800 py-10 px-4">
      <div className="bg-white rounded-lg px-6 py-2 mb-4">
        <h1 className="text-2xl font-bold text-slate-800">
          Upload Job Description
        </h1>
      </div>

      <textarea
        placeholder="Paste job description here..."
        value={jdText}
        onChange={handleJDChange}
        className="w-full max-w-4xl min-h-[350px] rounded-lg border border-gray-300 p-3 mb-6 bg-slate-50 text-gray-800"
      />

      <button
        onClick={handleAnalyze}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold mb-8"
      >
        {isLoading ? "Analyzing..." : "Analyze JD"}
      </button>

      <div className="w-full max-w-4xl">
        {/* ✅ MATCH UI (MATCH MODE ONLY) */}
        {isMatchMode && didComputeMatch && matchPercent !== null && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-white">
              Resume ↔ JD Match
            </h2>

            <div className="bg-white rounded-lg p-6 mb-8">
              <p className="text-lg font-semibold mb-4">
                Match Score:{" "}
                <span className="text-green-600">{matchPercent}%</span>
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 text-slate-700">
                    Matched Skills
                  </h3>
                  <ul className="list-disc list-inside text-green-700">
                    {matchedSkills.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-slate-700">
                    Missing Skills
                  </h3>
                  <ul className="list-disc list-inside text-red-600">
                    {missingSkills.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ❌ CTA ONLY IN MATCH MODE */}
        {isMatchMode && resumeExists === false && groqSkills.length > 0 && (
          <p
            onClick={() => router.push("/upload")}
            className="text-yellow-400 underline cursor-pointer text-center mb-6"
          >
            Analyze resume to check Resume ↔ JD Match
          </p>
        )}

        {/* 📚 LEARNING RESOURCES (ALWAYS) */}
        {groqSkills.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-white">
              Learning Resources
            </h2>
            <LearningResources skills={groqSkills} />
          </>
        )}
      </div>
    </div>
  );
}
