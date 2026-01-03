//app\create-resume\page.tsx

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
      `**${fullName}**
${email} | ${phone}

**SUMMARY**
${summary}

**EXPERIENCE**
${jobTitle} | ${company} (${years})

**SKILLS**
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
  async function downloadPDF(): Promise<void> {
    try {
      const response = await fetch("/api/resume/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          summary,
          jobTitle,
          company,
          years,
          skills,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF download error:", error);
      alert("PDF generation failed");
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Create New Resume
          </h1>
          <p className="text-slate-300">Start building resume</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter full name..."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-slate-50 text-gray-800 placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-slate-50 text-gray-800 placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  placeholder="Enter phone..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-slate-50 text-gray-800 placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Professional Summary
                </label>
                <textarea
                  placeholder="Enter professional summary..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-slate-50 text-gray-800 placeholder:text-gray-500 min-h-20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Skills
                </label>
                <input
                  type="text"
                  placeholder="Enter skills (comma separated)"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-slate-50 text-gray-800 placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  placeholder="Enter job title..."
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-slate-50 text-gray-800 placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  placeholder="Enter company name..."
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-slate-50 text-gray-800 placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Years
                </label>
                <input
                  type="text"
                  placeholder="Enter years (e.g. 2021-2024)"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-slate-50 text-gray-800 placeholder:text-gray-500"
                />
              </div>
            </form>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Preview</h2>

            <pre>
              <div className="bg-slate-50 p-4 rounded border border-gray-200 text-sm text-gray-800 leading-relaxed font-sans min-h-[400px] mb-4">
                {/* Name + contact */}
                <div className="mb-4">
                  <div className="font-bold text-base">{fullName}</div>
                  <div>
                    {email} | {phone}
                  </div>
                </div>

                {/* Summary */}
                <div className="mb-4">
                  <div className="font-semibold">Summary</div>
                  <div>{summary}</div>
                </div>

                {/* Experience */}
                <div className="mb-4">
                  <div className="font-semibold">Experience</div>
                  <div>
                    {jobTitle} | {company} ({years})
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <div className="font-semibold">Skills</div>
                  <div>{skills}</div>
                </div>
              </div>
            </pre>
            <button
              type="button"
              onClick={downloadTXT}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-semibold transition"
            >
              Download as .txt
            </button>
            <button
              type="button"
              onClick={downloadPDF}
              className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-semibold transition"
            >
              Download as PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
