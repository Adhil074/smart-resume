// app\upload\page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
export default function UploadPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

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

    try {
      setAnalyzing(true);
      setError(null);
      setAnalysis(null);

      const res = await fetch("/api/analyzeResume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      sessionStorage.setItem("resumeAnalyzed", "true");

      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-16 px-4">
      {/* back button */}
      <button
        onClick={() => router.back()}
        aria-label="Go back"
        className="absolute top-6 left-6 w-10 h-10 rounded-full
      bg-slate-900/60 backdrop-blur-md text-white
      flex items-center justify-center
      border border-white/40
      hover:bg-slate-900/80 hover:scale-105 transition"
      >
        ←
      </button>

      {/* main container */}
      <div className="w-full max-w-6xl mx-auto bg-slate-100 rounded-2xl shadow-xl p-5 sm:p-6 lg:p-8 mt-2">
        <h1 className="text-xl font-semibold text-center text-slate-800 mb-6">
          Upload Resume
        </h1>

        {/* upload section */}
        <div className="flex flex-col items-center gap-4">
          <label className="w-full max-w-md">
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />

            <div
              className="
      flex items-center justify-between
      w-full px-4 py-2
      border border-slate-300
      rounded-lg
      bg-white
      cursor-pointer
      hover:border-slate-400
      transition
    "
            >
              <span className="text-sm text-slate-600">
                {file ? file.name : "No file chosen"}
              </span>

              <span
                className="
        ml-4
        px-3 py-1
        text-sm font-medium
        bg-slate-200
        rounded
        text-slate-800
      "
              >
                Choose File
              </span>
            </div>
          </label>

          {/* {file && (
            <p className="text-sm text-green-700">File selected: {file.name}</p>
          )} */}

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          {/* before upload */}
          {!uploadSuccess && (
            <div className="mt-6 w-full max-w-3xl mx-auto">
              {/* button row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className="
          bg-blue-600 hover:bg-blue-700
          disabled:opacity-60
          text-white font-semibold
          py-3 rounded-xl
          transition
        "
                >
                  {loading ? "Uploading..." : "Upload"}
                </button>

                <button
                  disabled
                  className="
          bg-gray-400
          text-white font-semibold
          py-3 rounded-xl
          cursor-not-allowed
        "
                >
                  Upload resume to check match
                </button>
              </div>
            </div>
          )}
        </div>

        {/* after upload*/}
        {uploadSuccess && resumeId && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* left panel */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-xl border shadow overflow-hidden">
                <div className="px-4 py-2 text-sm font-semibold text-slate-700 border-b">
                  Resume Preview
                </div>
                <iframe
                  src={`/api/resume/preview/${resumeId}`}
                  className="w-full h-[420px] lg:h-[520px] bg-black"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="flex-1 bg-green-600 hover:bg-green-700
                disabled:opacity-60 text-white py-2 rounded-lg font-semibold transition"
                >
                  {analyzing ? "Analyzing..." : "Analyze Resume"}
                </button>

                <button
                  onClick={() => router.push("/upload-jd?mode=match")}
                  className="flex-1 bg-orange-500 hover:bg-orange-600
                text-white py-2 rounded-lg font-semibold transition"
                >
                  Upload JD to check match
                </button>
              </div>
            </div>

            {/* right panel */}
            {analysis && (
              <div className="bg-white rounded-xl shadow border p-5 sm:p-6 overflow-y-auto max-h-[520px]">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">
                  ATS Analysis Result
                </h2>

                <ReactMarkdown
                  components={{
                    h2: ({ children }) => (
                      <div className="mt-6 mb-4 rounded-lg bg-slate-50 border px-4 py-3">
                        <h2 className="text-base font-semibold text-slate-900">
                          {children}
                        </h2>
                      </div>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-sm font-semibold text-slate-800 mt-4 mb-2">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-sm text-slate-700 leading-relaxed mb-3">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pl-5 mb-4 text-sm text-slate-700">
                        {children}
                      </ul>
                    ),
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    strong: ({ children }) => (
                      <strong className="text-slate-900 font-semibold">
                        {children}
                      </strong>
                    ),
                    hr: () => (
                      <div className="my-5 border-t border-slate-300" />
                    ),
                  }}
                >
                  {analysis}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
