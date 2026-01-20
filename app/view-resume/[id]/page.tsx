//app\view-resume\[id]\page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type ResumeDoc = {
  _id: string;
  fileName: string;
  uploadedAt: string;
  extractedText: string;
  extractedSkills: string[];
};

export default function ViewResumePage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params?.id as string;

  const [resume, setResume] = useState<ResumeDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResume() {
      try {
        const res = await fetch(`/api/savedResumes/${resumeId}`);
        const data = await res.json();
        setResume(data.resume ?? null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (resumeId) fetchResume();
  }, [resumeId]);

  const handleExport = () => {
    window.open(`/api/savedResumes/${resumeId}/pdf`, "_blank");
  };

  if (loading) return <div className="text-white">Loading…</div>;
  if (!resume) return <div className="text-white">Resume not found</div>;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* top bar */}
        {/* <div className="flex justify-between items-center mb-6">
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
          <h1 className=" flex text-2xl  font-bold text-white">Resume Preview</h1>

          <button
            onClick={handleExport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
          >
            Export PDF
          </button>
        </div> */}
        {/* Top bar */}
<div className="relative flex items-center mb-6">
  {/* Back */}
  <button
    onClick={() => router.back()}
    aria-label="Go back"
    className="
      absolute left-0
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

  {/* Centered title */}
  <h1 className="mx-auto text-2xl font-bold text-white text-center">
    Resume Preview
  </h1>

  {/* Export */}
  <button
    onClick={handleExport}
    className="absolute right-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
  >
    Export PDF
  </button>
</div>

        {/* meta */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <p className="font-semibold text-slate-900 text-base break-all">{resume.fileName}</p>
          <p className="text-sm text-slate-500 mt-1">
            Uploaded {new Date(resume.uploadedAt).toLocaleString()}
          </p>
        </div>

        {/* PDF Preview */}
        <div className="bg-white rounded-lg overflow-hidden h-[80vh]">
          <iframe
            src={`/api/savedResumes/${resumeId}/pdf`}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
