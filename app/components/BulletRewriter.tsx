"use client";

import { useState } from "react";

export default function BulletRewriter({ resumeId }: { resumeId: string }) {
  const [bullet, setBullet] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [improved, setImproved] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRewrite = async () => {
    if (!bullet.trim()) {
      setError("Please enter a bullet point");
      return;
    }

    setLoading(true);
    setError("");
    setImproved("");

    try {
      const response = await fetch("/api/rewriteBullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bullet,
          jobTitle,
          experience: "5",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to rewrite bullet");
        return;
      }

      setImproved(data.improved);
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>AI Bullet Point Rewriter</h3>

      <div>
        <label>Original Bullet Point:</label>
        <textarea
          value={bullet}
          onChange={(e) => setBullet(e.target.value)}
          placeholder="e.g., Worked on project with team"
        />
      </div>

      <div>
        <label>Job Title (Optional):</label>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="e.g., Software Engineer"
        />
      </div>

      <button onClick={handleRewrite} disabled={loading}>
        {loading ? "Improving..." : "Improve Bullet"}
      </button>

      {error && <p>{error}</p>}

      {improved && (
        <div>
          <h4>Improved Bullet:</h4>
          <p>{improved}</p>
          <button onClick={() => setBullet(improved)}>Use This</button>
          <button onClick={() => setImproved("")}>Reject</button>
        </div>
      )}
    </div>
  );
}
