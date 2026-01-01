"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ResumeDoc = {
  _id: string;
  name: string;
  email: string;
  fileName: string;
  filePath: string;
  extractedText: string;
  extractedSkills: string[];
  uploadedAt: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function PreviousResumePage() {
  const [resumes, setResumes] = useState<ResumeDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchResumes() {
      const res = await fetch("/api/savedResumes");
      const data = await res.json();
      setResumes(data.resumes);
      setLoading(false);
    }
    fetchResumes();
  }, []);

  function handleView(resumeId: string) {
    router.push(`/view-resume/${resumeId}`);
  }

  function handleDeleteClick(resumeID: string) {
    setResumeToDelete(resumeID);
  }

  async function confirmDelete() {
    if (!resumeToDelete) return;

    setIsDeleting(true);

    const res = await fetch(`/api/savedResumes/${resumeToDelete}`, {
      method: "DELETE",
    });

    const json = await res.json();

    setIsDeleting(false);

    if (!res.ok) {
      alert(json.error || "Delete failed");
      return;
    }

    setResumes((prev) => prev.filter((r) => r._id !== resumeToDelete));
    setResumeToDelete(null);
    router.refresh();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Previous Resumes</h1>

        {resumes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-slate-600">No resumes found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between hover:shadow-xl transition"
              >
                <div className="flex-1">
                  <p className="text-lg font-semibold text-slate-800">
                    {resume.fileName}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Uploaded: {new Date(resume.uploadedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleView(resume._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteClick(resume._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete confirmation modal */}
        {resumeToDelete && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold text-slate-800 mb-2">
                Delete this resume?
              </h2>
              <p className="text-sm text-slate-600 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setResumeToDelete(null)}
                  className="px-4 py-2 rounded border border-slate-300 text-slate-700 text-sm font-semibold"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm font-semibold disabled:opacity-60"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}