"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ATSScore {
  overallScore: number;
  breakdown: {
    keywordsMatched: { score: number; found: string[]; issues: string[] };
    formatting: { score: number; issues: string[] };
    metrics: { score: number; found: number; recommendation: string };
    bulletPoints: { score: number; issues: string[] };
    contact: { score: number; issues: string[] };
  };
}

export default function UploadResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [atsScore, setAtsScore] = useState<ATSScore | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [resumeId, setResumeId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [hasUpload, setHasUpload] = useState<boolean>(false);

  // NEW: for match button
  const [hasJD, setHasJD] = useState<boolean>(false);
  const router = useRouter();

  // NEW: check if there is at least one JD saved
  useEffect(() => {
    if (typeof window === "undefined") return;
    const activeJD = sessionStorage.getItem("activeJDSession");
    setHasJD(activeJD === "true");
  }, []);

  useEffect(() => {
    async function loadLatestResumeIfActive() {
      // Only run in browser
      if (typeof window === "undefined") return;

      const active = sessionStorage.getItem("activeResumeSession");

      // If no active session, do NOT auto-load anything
      if (active !== "true") {
        setHasUpload(false);
        return;
      }

      try {
        const res = await fetch("/api/resume/latest");
        if (!res.ok) {
          console.error("Failed to fetch latest resume");
          return;
        }

        const data = await res.json();
        const resume = data.resume;

        if (!resume) {
          setHasUpload(false);
          return;
        }

        setHasUpload(true);
        setExtractedText(resume.extractedText || "");
        setExtractedSkills(resume.extractedSkills || []);
        setAtsScore(resume.atsScore || null);
        setResumeId(resume._id || "");
      } catch (err) {
        console.error("Error loading latest resume:", err);
      }
    }

    loadLatestResumeIfActive();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setStatus("Please select a file!");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    setStatus("Uploading...");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();

        setExtractedText(data.extractedText || "");
        setResumeId(data._id || "");
        setExtractedSkills(data.extractedSkills || []);
        setAtsScore(data.atsScore || null);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("activeResumeSession", "true");
        }

        setHasUpload(true);

        setStatus("Upload success!");
      } else {
        setStatus("Failed to upload resume");
      }
    } catch (error) {
      setStatus("Error: " + error);
    }
  };

  const handleSaveChanges = async () => {
    if (!resumeId) {
      setStatus("No resume ID found");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/resume?id=${resumeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          editedText: extractedText,
          extractedSkills,
        }),
      });

      if (res.ok) {
        setStatus("Changes saved successfully!");
      } else {
        setStatus("Failed to save changes");
      }
    } catch (error) {
      setStatus("Error saving: " + error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    if (!extractedText) {
      setStatus("No resume to export");
      return;
    }

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(extractedText)
    );
    element.setAttribute("download", "resume.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setStatus("Resume exported successfully!");
  };

 return (
  <div className="min-h-screen flex justify-center items-start bg-linear-to-br from-slate-900 to-slate-800 py-10 px-4">
    <div className="w-full max-w-xl bg-white/90 rounded-xl shadow-lg p-8">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Upload Resume</h1>

      {/* STEP 1: Choose File & Upload */}
      <form onSubmit={handleUpload} className="flex flex-col gap-4 mb-6">
        <label className="font-medium text-slate-700">
          Choose File (DOCX)
        </label>
        <input
          type="file"
          accept=".docx"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          required
          className="border border-gray-300 rounded px-2 py-2 bg-white"
        />
        {file && <p className="text-sm text-green-700">File selected: {file.name}</p>}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-semibold transition"
        >
          Upload
        </button>
      </form>

      {status && <p className="mb-4 text-sm font-semibold text-slate-600">{status}</p>}

      {/* STEP 2: Show ATS Score */}
      {atsScore && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-1 text-blue-700">ATS Score: {atsScore.overallScore}/100</h2>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
            <div>Keywords: <span className="font-semibold">{atsScore.breakdown.keywordsMatched.score}</span></div>
            <div>Formatting: <span className="font-semibold">{atsScore.breakdown.formatting.score}</span></div>
            <div>Metrics: <span className="font-semibold">{atsScore.breakdown.metrics.score}</span></div>
            <div>Bullets: <span className="font-semibold">{atsScore.breakdown.bulletPoints.score}</span></div>
            <div>Contact: <span className="font-semibold">{atsScore.breakdown.contact.score}</span></div>
          </div>
          <div className="mt-2">
            <span className="block font-medium mb-1">Found Skills:</span>
            {extractedSkills && extractedSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {extractedSkills.map((skill, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-900 rounded px-2 py-1 text-xs">{skill}</span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">No matching skills found</p>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: Things to Improve */}
      {atsScore && atsScore.overallScore < 80 && (
        <div className="bg-orange-100 border-l-4 border-orange-400 rounded p-4 mb-6">
          <h3 className="font-semibold text-orange-900 mb-2">Things to Improve:</h3>
          {atsScore.breakdown.formatting.issues.length > 0 && (
            <div className="mb-2">
              <h4 className="font-semibold text-sm text-black">Formatting Issues:</h4>
              <ul className="ml-4 list-disc text-xs text-gray-900">
                {atsScore.breakdown.formatting.issues.map(
                  (issue: string, idx: number) => (
                    <li key={idx}>{issue}</li>
                  )
                )}
              </ul>
            </div>
          )}
          {atsScore.breakdown.bulletPoints.issues.length > 0 && (
            <div className="mb-2">
              <h4 className="font-semibold text-sm text-black">Bullet Points:</h4>
              <ul className="ml-4 list-disc text-gray-900 text-xs">
                {atsScore.breakdown.bulletPoints.issues.map(
                  (issue: string, idx: number) => (
                    <li key={idx}>{issue}</li>
                  )
                )}
              </ul>
            </div>
          )}
          {atsScore.breakdown.contact.issues.length > 0 && (
            <div className="mb-2">
              <h4 className="font-semibold text-sm text-black">Contact Info Issues:</h4>
              <ul className="ml-4 text-gray-900 list-disc text-xs">
                {atsScore.breakdown.contact.issues.map(
                  (issue: string, idx: number) => (
                    <li key={idx}>{issue}</li>
                  )
                )}
              </ul>
            </div>
          )}
          <div>
            <h4 className="font-semibold text-black text-sm">Metrics Recommendation:</h4>
            <p className="text-xs text-gray-900">{atsScore.breakdown.metrics.recommendation}</p>
            <p className="text-xs text-gray-900">Metrics found: {atsScore.breakdown.metrics.found}</p>
          </div>
        </div>
      )}

      {/* STEP 4: Display & Edit Resume */}
      {extractedText && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 text-slate-800">Resume Content - Edit Below</h2>
          <textarea
            value={extractedText}
            onChange={(e) => setExtractedText(e.target.value)}
            rows={10}
            className="w-full rounded border border-gray-300 p-2 text-sm font-mono bg-white mb-2 text-black"
          />
        </div>
      )}

      {/* STEP 4.1: Editable Skills */}
      {extractedText && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-slate-700">Edit Skills</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {extractedSkills.map((skill, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-900 rounded px-2 py-1 text-xs flex items-center">
                {skill}
                <button
                  type="button"
                  onClick={() =>
                    setExtractedSkills((prev) =>
                      prev.filter((_, i) => i !== idx)
                    )
                  }
                  className="ml-1 text-red-600 hover:text-red-900 text-xs font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add new skill"
              id="newSkillInput"
              className=" placeholder:text-gray-300 border border-gray-300 rounded px-2 py-1 text-sm  bg-white flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const input = e.target as HTMLInputElement;
                  const newSkill = input.value.trim();
                  if (newSkill && !extractedSkills.includes(newSkill)) {
                    setExtractedSkills([...extractedSkills, newSkill]);
                    input.value = "";
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const input = document.getElementById(
                  "newSkillInput"
                ) as HTMLInputElement;
                const newSkill = input.value.trim();
                if (newSkill && !extractedSkills.includes(newSkill)) {
                  setExtractedSkills([...extractedSkills, newSkill]);
                  input.value = "";
                }
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Save & Export Buttons */}
      {extractedText && (
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handleExport}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded transition"
          >
            Export Resume
          </button>
        </div>
      )}

      {/* NEW: Check Match button logic */}
      <div>
        {hasUpload === false ? (
          <button
            type="button"
            className="w-full bg-gray-400 text-white rounded py-2 font-semibold cursor-not-allowed"
            disabled
          >
            Upload resume to check match
          </button>
        ) : hasJD ? (
          <button
            type="button"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded py-2 font-semibold"
            onClick={() => router.push("/match")}
          >
            Check Match
          </button>
        ) : (
          <button
            type="button"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white rounded py-2 font-semibold"
            onClick={() => router.push("/upload-jd")}
          >
            Upload JD to check match
          </button>
        )}
      </div>
    </div>
  </div>
);
}