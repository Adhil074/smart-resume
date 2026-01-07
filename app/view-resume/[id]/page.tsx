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
        {/* Top bar */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.back()}
            className="text-slate-300 hover:text-white"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-bold text-white">Resume Preview</h1>

          <button
            onClick={handleExport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
          >
            Export PDF
          </button>
        </div>

        {/* Meta */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <p className="font-semibold">{resume.fileName}</p>
          <p className="text-sm text-slate-500">
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