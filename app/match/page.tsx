"use client";

import { useEffect, useState } from "react";

type ResumeDoc = {
  _id: string;
  extractedSkills?: string[];
  uploadedAt?: string;
};

type JDdoc = {
  _id: string;
  extractedSkills?: string[];
  createdAt?: string;
};

export default function MatchPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [resumeSkills, setResumeSkills] = useState<string[]>([]);
  const [jdSkills, setJdSkills] = useState<string[]>([]);
  const [matchPercent, setMatchPercent] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // 1) Get latest resume (already sorted by uploadedAt: -1 in /api/resume)
        const resRes = await fetch("/api/resume");
        const resumeData = await resRes.json();
        const latestResume: ResumeDoc | undefined = resumeData.resumes?.[0];

        if (
          !latestResume ||
          !latestResume.extractedSkills ||
          latestResume.extractedSkills.length === 0
        ) {
          setError("No resume skills found. Upload a resume first.");
          setLoading(false);
          return;
        }

        // 2) Get latest JD
        const resJD = await fetch("/api/jd/latest");
        const jdData = await resJD.json();
        const latestJD: JDdoc | undefined = jdData.jd;

        if (
          !latestJD ||
          !latestJD.extractedSkills ||
          latestJD.extractedSkills.length === 0 ||
          !latestJD.createdAt
        ) {
          setError(
            "No valid JD found. Upload a job description and analyze it first."
          );
          setLoading(false);
          return;
        }

        // 3) Compare timestamps: JD must be newer than resume
        const resumeTime = latestResume.uploadedAt
          ? new Date(latestResume.uploadedAt).getTime()
          : 0;
        const jdTime = new Date(latestJD.createdAt).getTime();

        if (jdTime <= resumeTime) {
          setError(
            "Your latest JD is older than your resume. Upload a new JD to check match."
          );
          setLoading(false);
          return;
        }

        // 4) Normalize and compute overlap
        const resSkillsLower = latestResume.extractedSkills.map((s) =>
          s.toLowerCase()
        );
        const jdSkillsLower = latestJD.extractedSkills.map((s) =>
          s.toLowerCase()
        );

        const resumeSet = new Set(resSkillsLower);
        const overlap = jdSkillsLower.filter((s) => resumeSet.has(s));

        const percent =
          jdSkillsLower.length === 0
            ? 0
            : Math.round((overlap.length / jdSkillsLower.length) * 100);

        setResumeSkills(resSkillsLower);
        setJdSkills(jdSkillsLower);
        setMatchPercent(percent);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load match data");
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading match data...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Resume vs JD Match</h1>
      <p>Match: {matchPercent}%</p>

      <h2>Resume Skills</h2>
      <ul>
        {resumeSkills.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>

      <h2>JD Skills</h2>
      <ul>
        {jdSkills.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
