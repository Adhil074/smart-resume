"use client";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error ?? "Upload failed");
      return;
    }

    setResumeId(data.resumeId);
  }

  async function handleAnalyze() {
    if (!resumeId) return;

    await fetch("/api/analyzeResume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeId }),
    });

    alert("Analysis started");
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Upload Resume</h1>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      <br />
      <br />

      <button onClick={handleUpload} disabled={!file || loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {resumeId && (
        <>
          <p style={{ marginTop: "20px" }}>
            ✅ Uploaded — Resume ID: {resumeId}
          </p>

          {/* 🔴 IMPORTANT: backend-rendered preview ONLY */}
          <iframe
            src={`/api/resume/preview/${resumeId}`}
            style={{
              width: "100%",
              height: "700px",
              marginTop: "20px",
              border: "1px solid #444",
              background: "#111",
            }}
          />

          <br />
          <br />

          <button onClick={handleAnalyze}>Analyze Resume</button>
        </>
      )}
    </div>
  );
}
