"use client";
import { useState } from "react";
import { useEffect } from "react";
export default function CreateResumePage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [summary, setSummary] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [years, setYears] = useState("");
  const [skills, setSkills] = useState("");
  const [resumeText, setResumeText] = useState("");
  useEffect(() => {
    setResumeText(
      `${fullName}
${email} | ${phone}

SUMMARY
${summary}

EXPERIENCE
${jobTitle} | ${company} (${years})

SKILLS
${skills}`
    );
  }, [fullName, email, phone, summary, jobTitle, company, years, skills]);
  function downloadTXT() {
    const blob = new Blob([resumeText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.txt";
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <h1>Create New Resume</h1>
      <p>Start building resume</p>
      <form>
        <label>Full Name</label>
        <input
          type="text"
          placeholder="Enter full name..."
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <label>Email</label>
        <input
          type="email"
          placeholder=" Enter email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Phone</label>
        <input
          type="text"
          placeholder=" Enter phone..."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <label>Professional Summary</label>
        <textarea
          placeholder=" Enter professional summary..."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
        <label>Skills</label>
        <input
          type="text"
          placeholder="Enter skills(comma seperated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
        <label>Job Title</label>
        <input
          type="text"
          placeholder="Enter job title..."
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
        <label>Company</label>
        <input
          type="text"
          placeholder="Enter company name..."
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <label>Years</label>
        <input
          type="text"
          placeholder="Enter years (e.g.2021-2024...)"
          value={years}
          onChange={(e) => setYears(e.target.value)}
        />
      </form>
      <div>
        <h2>Preview</h2>
        <pre style={{ whiteSpace: "pre-wrap" }}>{resumeText}</pre>
        <button type="button" onClick={downloadTXT}>
          Download as .txt
        </button>
      </div>
    </div>
  );
}
