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
    <div>
      <h1>Upload Resume</h1>

      {/* STEP 1: Choose File & Upload */}
      <form onSubmit={handleUpload}>
        <div>
          <label>Choose File (DOCX)</label>
          <input
            type="file"
            accept=".docx"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            required
          />
          {file && <p>File selected: {file.name}</p>}
        </div>
        <button type="submit">Upload</button>
      </form>

      {status && <p>{status}</p>}

      {/* STEP 2: Show ATS Score */}
      {atsScore && (
        <div>
          <h2>ATS Score: {atsScore.overallScore}/100</h2>

          <div>
            <h3>Score Breakdown:</h3>
            <p>Keywords: {atsScore.breakdown.keywordsMatched.score}</p>
            <p>Formatting: {atsScore.breakdown.formatting.score}</p>
            <p>Metrics: {atsScore.breakdown.metrics.score}</p>
            <p>Bullets: {atsScore.breakdown.bulletPoints.score}</p>
            <p>Contact: {atsScore.breakdown.contact.score}</p>
          </div>

          <div>
            <h3>Found Skills:</h3>
            {extractedSkills && extractedSkills.length > 0 ? (
              extractedSkills.map((skill, idx) => (
                <span key={idx}>{skill} | </span>
              ))
            ) : (
              <p>No matching skills found</p>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: Things to Improve */}
      {atsScore && atsScore.overallScore < 80 && (
        <div>
          <h3>Things to Improve:</h3>

          {atsScore.breakdown.formatting.issues.length > 0 && (
            <div>
              <h4>Formatting Issues:</h4>
              <ul>
                {atsScore.breakdown.formatting.issues.map(
                  (issue: string, idx: number) => (
                    <li key={idx}>{issue}</li>
                  )
                )}
              </ul>
            </div>
          )}

          {atsScore.breakdown.bulletPoints.issues.length > 0 && (
            <div>
              <h4>Bullet Points:</h4>
              <ul>
                {atsScore.breakdown.bulletPoints.issues.map(
                  (issue: string, idx: number) => (
                    <li key={idx}>{issue}</li>
                  )
                )}
              </ul>
            </div>
          )}

          {atsScore.breakdown.contact.issues.length > 0 && (
            <div>
              <h4>Contact Info Issues:</h4>
              <ul>
                {atsScore.breakdown.contact.issues.map(
                  (issue: string, idx: number) => (
                    <li key={idx}>{issue}</li>
                  )
                )}
              </ul>
            </div>
          )}

          <div>
            <h4>Metrics Recommendation:</h4>
            <p>{atsScore.breakdown.metrics.recommendation}</p>
            <p>Metrics found: {atsScore.breakdown.metrics.found}</p>
          </div>
        </div>
      )}

      {/* STEP 4: Display & Edit Resume */}
      {extractedText && (
        <div>
          <h2>Resume Content - Edit Below</h2>
          <textarea
            value={extractedText}
            onChange={(e) => setExtractedText(e.target.value)}
            rows={15}
            style={{ width: "100%", padding: "10px" }}
          />
        </div>
      )}

      {/* STEP 4.1: Editable Skills */}
      {extractedText && (
        <div>
          <h3>Edit Skills</h3>
          <div>
            {extractedSkills.map((skill, idx) => (
              <span key={idx}>
                {skill}
                <button
                  type="button"
                  onClick={() =>
                    setExtractedSkills((prev) =>
                      prev.filter((_, i) => i !== idx)
                    )
                  }
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div>
            <input
              type="text"
              placeholder="Add new skill"
              id="newSkillInput"
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
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Save & Export Buttons */}
      {extractedText && (
        <div>
          <button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <button onClick={handleExport}>Export Resume</button>
        </div>
      )}

      {/* NEW: Check Match button logic */}
      <div style={{ marginTop: "20px" }}>
        {hasUpload === false ? (
          <button
            type="button"
            onClick={() => alert("Upload a resume to check match")}
            disabled
          >
            Upload resume to check match
          </button>
        ) : hasJD ? (
          <button type="button" onClick={() => router.push("/match")}>
            Check Match
          </button>
        ) : (
          <button type="button" onClick={() => router.push("/upload-jd")}>
            Upload JD to check match
          </button>
        )}
      </div>
    </div>
  );
}
