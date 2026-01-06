"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload() {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setResumeId(data.resumeId);
      setUploadSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setUploadSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleAnalyze() {
    if (!resumeId) return;

    await fetch("/api/analyzeResume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeId }),
    });

    alert("Resume analysis started");
  }

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center pt-16 px-4">
      <div className="w-full max-w-2xl bg-slate-100 rounded-xl shadow-lg p-6">
        <h1 className="text-xl font-semibold text-slate-800 mb-4">
          Upload Resume
        </h1>

        {/* FILE INPUT */}
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full border border-slate-300 rounded px-3 py-2 bg-white"
        />

        {file && (
          <p className="mt-2 text-sm text-green-700">
            File selected: {file.name}
          </p>
        )}

        {/* UPLOAD BUTTON */}
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2 rounded"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {error && (
          <p className="mt-3 text-sm text-red-600 font-medium">
            {error}
          </p>
        )}

        {/* BEFORE UPLOAD */}
        {!uploadSuccess && (
          <button
            disabled
            className="w-full mt-6 bg-gray-400 text-white py-2 rounded font-semibold cursor-not-allowed"
          >
            Upload resume to check match
          </button>
        )}

        {/* AFTER UPLOAD */}
        {uploadSuccess && resumeId && (
          <>
            {/* PREVIEW */}
            <iframe
              src={`/api/resume/preview/${resumeId}`}
              className="w-full h-[520px] mt-6 border rounded bg-black"
            />

            {/* ACTION BUTTONS */}
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleAnalyze}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold"
              >
                Analyze Resume
              </button>

              <button
                onClick={() => router.push("/upload-jd")}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded font-semibold"
              >
                Upload JD to check match
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}