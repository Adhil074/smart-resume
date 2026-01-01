"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type ResumeDoc = {
  _id: string;
  name: string;
  email: string;
  fileName: string;
  filePath: string;
  extractedText: string;
  extractedSkills: string[];
  uploadedAt: string;
};

export default function ViewResumePage() {
  const params = useParams() as Record<string, string | string[]> | null;
  const router = useRouter();
  const resumeId = (params?.id as string) || "";

  const [resume, setResume] = useState<ResumeDoc | null>(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    async function fetchResume() {
      try {
        const res = await fetch(`/api/savedResumes/${resumeId}`);
        const data = await res.json();

        if (data.resume) {
          setResume(data.resume);
        }
      } catch (error) {
        console.error("Error fetching resume:", error);
      } finally {
        setLoading(false);
      }
    }

    if (resumeId) {
      fetchResume();
    }
  }, [resumeId]);

  const handleExport = () => {
    if (!resume) return;

    // Create a text file with resume content
    const content = `
RESUME
======

Name: ${resume.name || "N/A"}
Email: ${resume.email || "N/A"}
File: ${resume.fileName}
Uploaded: ${new Date(resume.uploadedAt).toLocaleString()}

EXTRACTED TEXT:
${resume.extractedText}

EXTRACTED SKILLS:
${resume.extractedSkills.join(", ")}
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resume.fileName.replace(".pdf", "")}_export.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div>Loading resume...</div>;
  }

  if (!resume) {
    return <div>Resume not found</div>;
  }
  

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-slate-200 hover:text-white"
          >
            <span className="text-xl">←</span>
            <span className="font-medium">Back</span>
          </button>

          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Resume Preview
          </h1>

          <button
            onClick={handleExport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold inline-flex items-center gap-2 transition"
          >
            <span>📥</span>
            <span>Export</span>
          </button>
        </div>

        {/* File title card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-slate-800">
            {resume.fileName}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Uploaded on {new Date(resume.uploadedAt).toLocaleString()}
          </p>
        </div>

        {/* Info + skills */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Information
            </h3>
            <p className="text-sm text-slate-700 mb-2">
              <span className="font-semibold">Name:</span>{" "}
              {resume.name || "N/A"}
            </p>
            <p className="text-sm text-slate-700 mb-2">
              <span className="font-semibold">Email:</span>{" "}
              {resume.email || "N/A"}
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">Uploaded:</span>{" "}
              {new Date(resume.uploadedAt).toLocaleString()}
            </p>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Extracted Skills
            </h3>
            {resume.extractedSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {resume.extractedSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No skills extracted</p>
            )}
          </div>
        </div>

        {/* Extracted text */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Extracted Text
          </h3>
          <div className="bg-slate-50 border border-slate-200 rounded p-4 max-h-[500px] overflow-auto text-sm text-slate-800 whitespace-pre-wrap break-words">
            {resume.extractedText || "No text extracted"}
          </div>
        </div>
      </div>
    </div>
  );
}
