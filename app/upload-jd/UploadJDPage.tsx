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

  // url mode
  const mode = searchParams.get("mode"); // "match" | null
  const isMatchMode = mode === "match";

  const [jdText, setJdText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [groqSkills, setGroqSkills] = useState<string[]>([]);
  const [matchPercent, setMatchPercent] = useState<number | null>(null);
  const [matchedSkills, setMatchedSkills] = useState<string[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [, setResumeExists] = useState<boolean | null>(null);
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

    // hard resets every run
    setMatchPercent(null);
    setMatchedSkills([]);
    setMissingSkills([]);
    setDidComputeMatch(false);
    setResumeExists(null);

    let resumeSkills: string[] = [];

    //match mode only
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

    //jd skill extraction
    const jdRes = await fetch("/api/jd/analyzegroq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jdText }),
    });

    const jdData: { skills?: string[] } = await jdRes.json();
    const jdSkills = jdData.skills ?? [];
    setGroqSkills(jdSkills);

    //match calculation
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

    //saves jd
    await fetch("/api/jd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jdText, skills: jdSkills }),
    });

    setIsLoading(false);
  }

  function handleJDChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setJdText(e.target.value);

    setMatchPercent(null);
    setMatchedSkills([]);
    setMissingSkills([]);
    setDidComputeMatch(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-linear-to-br from-slate-900 to-slate-800 py-10 px-4">
      <button
        onClick={() => router.back()}
        aria-label="Go back"
        className="
    absolute top-6 left-6
    w-10 h-10
    rounded-full
    bg-slate-900/60
    backdrop-blur-md
    text-white
    flex items-center justify-center
    border border-white/50
    hover:bg-slate-900/80
    hover:scale-105
    transition
  "
      >
        ←
      </button>

      <div className="bg-white rounded-lg px-6 py-2 mb-4">
        <h1 className="text-2xl font-bold text-slate-800">
          Upload Job Description
        </h1>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <textarea
          placeholder="Paste job description here..."
          value={jdText}
          onChange={handleJDChange}
          className="w-full min-h-[350px] rounded-lg border border-gray-300 p-3 mb-6 bg-slate-50 text-gray-800"
        />

        <div className="flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded font-semibold mb-8 transition"
          >
            {isLoading ? "Analyzing..." : "Analyze JD"}
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl">
        {/* match ui only match mode */}
        {isMatchMode && didComputeMatch && matchPercent !== null && (
          <>
            <h2 className="text-xl font-semibold mb-6 text-white text-center">
              Resume ↔ JD Match
            </h2>

            <div className="bg-white rounded-lg p-6 mb-8">
              <p className="text-lg text-black font-semibold mb-4">
                Match Score:{" "}
                <span className="text-green-600">{matchPercent}%</span>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 text-slate-700">
                    Matched Skills - Keywords
                  </h3>
                  <ul className="list-disc list-inside text-green-700">
                    {matchedSkills.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-slate-700">
                    Missing Skills - Keywords
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

        {/* learning resources always  */}
        {groqSkills.length > 0 && (
          <>
            <div className="w-full max-w-4xl mx-auto ">
              <div className="w-full flex justify-center">
                <div className="w-full max-w-4xl text-center">
                  <LearningResources skills={groqSkills} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
