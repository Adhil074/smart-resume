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

      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
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
          <p className="mt-3 text-sm text-red-600 font-medium">{error}</p>
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
                disabled={analyzing}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white py-2 rounded font-semibold"
              >
                {analyzing ? "Analyzing..." : "Analyze Resume"}
              </button>

              <button
                onClick={() => router.push("/upload-jd")}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded font-semibold"
              >
                Upload JD to check match
              </button>
            </div>
            {analysis && (
              <div className="mt-6 bg-white rounded-lg p-4 shadow border">
                <h2 className="text-lg font-semibold text-slate-800 mb-2">
                  ATS Analysis Result
                </h2>

                <ReactMarkdown
                  components={{
                    h2: ({ children }) => (
                      <div className="mt-8 mb-4 rounded-xl bg-slate-50 border border-slate-200 px-5 py-4">
                        <h2 className="text-lg font-semibold text-slate-900 mb-2">
                          {children}
                        </h2>
                      </div>
                    ),

                    h3: ({ children }) => (
                      <h3 className="text-base font-semibold text-slate-800 mt-5 mb-2">
                        {children}
                      </h3>
                    ),

                    p: ({ children }) => (
                      <p className="text-slate-700 leading-relaxed mb-3 px-1">
                        {children}
                      </p>
                    ),

                    ul: ({ children }) => (
                      <ul className="list-disc pl-6 mb-4 text-slate-700">
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
                      <div className="my-6 border-t border-slate-300" />
                    ),
                  }}
                >
                  {analysis}
                </ReactMarkdown>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
