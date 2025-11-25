"use client";
type ResumeDoc = {
  _id: string;
  name: string;
  email: string;
  fileName: string;
  filePath: string;
  extractedText: string;
  extractedSkills: string[];
  uploadedAt: string;      // Date comes as string in JSON
  createdAt?: string;      // from `timestamps: true`
  updatedAt?: string;      // from `timestamps: true`
};
import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function PreviousResumePage() {
  const [resumes, setResumes] = useState<ResumeDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchResumes() {
      const res = await fetch("/api/savedResumes");
      const data = await res.json();
      setResumes(data.resumes);
      setLoading(false);
    }
    fetchResumes();
  }, []);
  if (loading == true) {
    return <div>Loading...</div>;
  }
  async function handleDelete(resumeID: string) {
    if (!confirm("Delete this resume?")) return;
    console.log(
      "DELETE request id:",
      resumeID,
      "url:",
      `/api/savedResumes/${resumeID}`
    );
    const res = await fetch(`/api/savedResumes/${resumeID}`, {
      method: "DELETE",
    });

    console.log("DELETE status:", res.status);

    const json = await res.json();
    console.log("DELETE response:", json);

    if (!res.ok) {
      alert(json.error || "Delete failed");
      return;
    }
    setResumes((prev)=>prev.filter((r)=>r._id!==resumeID));

    router.refresh();
  }
  return (
    <div>
      <h1>Previous Resumes</h1>

      {resumes.length === 0 ? (
        <p>No resumes found</p>
      ) : (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resumes.map((resume: any) => (
          <div key={resume._id}>
            <p>{resume.fileName}</p>

            <button>View</button>
            <button onClick={() => handleDelete(resume._id)}>Delete</button>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}
