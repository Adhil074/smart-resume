// app/create-resume/page.tsx
"use client";

import { useState } from "react";
import TemplateA from "@/app/components/preview/TemplateA";
import TemplateB from "@/app/components/preview/TemplateB";
import TemplateCard from "../components/template/TemplateCard";
import TemplateAThumbnail from "@/app/components/template/TemplateAThumbnail";
import TemplateBThumbnail from "@/app/components/template/TemplateBThumbnail";

type ResumeData = {
  fullName: string;
  email: string;
  phone: string;
  summary: string;
  skills: string;
  education: string;
  experience: string;
  projects: string;
  certifications: string;
};

export default function CreateResumePage() {
  const [template, setTemplate] = useState<"templateA" | "templateB">(
    "templateA",
  );

  // 🔒 ISOLATED STATE
  const [templateAData, setTemplateAData] = useState<ResumeData>({
    fullName: "",
    email: "",
    phone: "",
    summary: "",
    skills: "",
    education: "",
    experience: "",
    projects: "",
    certifications: "",
  });

  const [templateBData, setTemplateBData] = useState<ResumeData>({
    fullName: "",
    email: "",
    phone: "",
    summary: "",
    skills: "",
    education: "",
    experience: "",
    projects: "",
    certifications: "",
  });

  const activeData = template === "templateA" ? templateAData : templateBData;

  const setActiveData = (data: Partial<ResumeData>) => {
    if (template === "templateA") {
      setTemplateAData({ ...templateAData, ...data });
    } else {
      setTemplateBData({ ...templateBData, ...data });
    }
  };

  async function downloadPDF() {
    const response = await fetch("/api/resume/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...activeData,
        template,
      }),
    });

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.pdf";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Create New Resume
        </h1>

        <p className="text-center text-slate-200 mt-2 mb-3">Select Template</p>

        {/* Template Selection */}
        <div className="flex justify-center gap-6 mb-8">
          {/* Template A */}
          <div className="flex flex-col items-center gap-2">
            <TemplateCard
              selected={template === "templateA"}
              onClick={() => setTemplate("templateA")}
            >
              <TemplateAThumbnail />
            </TemplateCard>

            <p className="w-[260px] text-center text-sm text-white font-semibold">
              Professional Classic
            </p>
          </div>

          {/* Template B */}
          <div className="flex flex-col items-center gap-2">
            <TemplateCard
              selected={template === "templateB"}
              onClick={() => setTemplate("templateB")}
            >
              <TemplateBThumbnail />
            </TemplateCard>

            <p className="w-[260px] text-center text-sm font-semibold text-white ">
              Modern Career
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 text-black">
          {/* FORM */}
          <div className="bg-white p-6 rounded-xl text-black space-y-4">
            <input
              placeholder="Full Name"
              value={activeData.fullName}
              onChange={(e) => setActiveData({ fullName: e.target.value })}
              className="w-full  border p-2"
            />

            <input
              placeholder="Email"
              value={activeData.email}
              onChange={(e) => setActiveData({ email: e.target.value })}
              className="w-full border p-2"
            />

            <input
              placeholder="Phone"
              value={activeData.phone}
              onChange={(e) => setActiveData({ phone: e.target.value })}
              className="w-full border p-2"
            />

            <textarea
              placeholder="Professional Summary"
              value={activeData.summary}
              onChange={(e) => setActiveData({ summary: e.target.value })}
              className="w-full border p-2 min-h-[100px]"
            />

            <input
              placeholder="Skills"
              value={activeData.skills}
              onChange={(e) => setActiveData({ skills: e.target.value })}
              className="w-full border p-2"
            />

            {/* ✅ EDUCATION INPUT */}
            <textarea
              placeholder="Education"
              value={activeData.education}
              onChange={(e) => setActiveData({ education: e.target.value })}
              className="w-full border p-2 min-h-20"
            />

            <textarea
              placeholder="Experience"
              value={activeData.experience}
              onChange={(e) => setActiveData({ experience: e.target.value })}
              className="w-full border p-2 min-h-20"
            />
            <textarea
              placeholder="Projects"
              value={activeData.projects}
              onChange={(e) => setActiveData({ projects: e.target.value })}
              className="w-full border p-2 min-h-20"
            />
            <textarea
              placeholder="Certifications"
              value={activeData.certifications}
              onChange={(e) =>
                setActiveData({ certifications: e.target.value })
              }
              className="w-full border p-2 min-h-20"
            />
          </div>

          {/* PREVIEW */}
          <div className="bg-white p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Preview</h2>

            <div className="bg-slate-50 p-4 rounded border min-h-[400px]">
              {template === "templateA" && <TemplateA {...templateAData} />}
              {template === "templateB" && <TemplateB {...templateBData} />}
            </div>

            <button
              onClick={downloadPDF}
              className="mt-4 w-full bg-green-600 text-white py-3 rounded"
            >
              Download as PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";
// import { useState } from "react";
// import { useEffect } from "react";
// import TemplateA from "@/app/components/preview/TemplateA";
// import TemplateB from "@/app/components/preview/TemplateB";

// export default function CreateResumePage() {
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [summary, setSummary] = useState("");
//   const [phone, setPhone] = useState("");
//   const [jobTitle, setJobTitle] = useState("");
//   const [company, setCompany] = useState("");
//   const [years, setYears] = useState("");
//   const [skills, setSkills] = useState("");
//   const [template, setTemplate] = useState<"templateA" | "templateB">(
//     "templateA",
//   );
//   const [resumeText, setResumeText] = useState("");
//   useEffect(() => {
//     setResumeText(
//       `**${fullName}**
// ${email} | ${phone}

// **SUMMARY**
// ${summary}

// **EXPERIENCE**
// ${jobTitle} | ${company} (${years})

// **SKILLS**
// ${skills}`,
//     );
//   }, [fullName, email, phone, summary, jobTitle, company, years, skills]);
//   async function downloadPDF(): Promise<void> {
//     try {
//       const response = await fetch("/api/resume/pdf", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           fullName,
//           email,
//           phone,
//           summary,
//           jobTitle,
//           company,
//           years,
//           skills,
//           template,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to generate PDF");
//       }

//       const blob = await response.blob();
//       const url = URL.createObjectURL(blob);

//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "resume.pdf";
//       document.body.appendChild(a);
//       a.click();

//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("PDF download error:", error);
//       alert("PDF generation failed");
//     }
//   }

//   // const activeData =
//   //   template === "templateA"
//   //     ? { fullName, email, phone, summary, skills }
//   //     : { fullName, email, phone, summary, skills };
//   const templateAData = {
//     fullName,
//     email,
//     phone,
//     summary,
//     skills,
//   };

//   const templateBData = {
//     fullName,
//     email,
//     phone,
//     summary,
//     skills,
//   };

//   return (
//     <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 py-10 px-4">
//       <div className="max-w-6xl mx-auto">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-white mb-2">
//             Create New Resume
//           </h1>
//           <p className="text-slate-300">Start building resume</p>
//         </div>

//         {/* Template Selection */}
//         <div className="grid md:grid-cols-2 gap-6 mb-8">
//           {/* Template A */}
//           <div
//             onClick={() => setTemplate("templateA")}
//             className={`cursor-pointer rounded-xl border-2 p-4 bg-white ${
//               template === "templateA"
//                 ? "border-green-600"
//                 : "border-gray-200 hover:border-gray-400"
//             }`}
//           >
//             <div className="text-sm text-black font-semibold mb-2">
//               Template A
//             </div>

//             {/* Fake resume preview */}
//             <div className="text-xs text-gray-700 space-y-2">
//               <div className="font-bold text-base">John Doe</div>
//               <div>john@email.com | 9876543210</div>

//               <div className="font-semibold mt-2">Professional Summary</div>
//               <div>Frontend developer with 3+ years experience...</div>

//               <div className="font-semibold mt-2">Skills</div>
//               <div>React, Next.js, TypeScript</div>
//             </div>
//           </div>

//           {/* Template B */}
//           <div
//             onClick={() => setTemplate("templateB")}
//             className={`cursor-pointer rounded-xl border-2 p-4 bg-white ${
//               template === "templateB"
//                 ? "border-green-600"
//                 : "border-gray-200 hover:border-gray-400"
//             }`}
//           >
//             <div className="text-sm text-black  font-semibold mb-2">
//               Template B
//             </div>

//             {/* Fake resume preview */}
//             <div className="text-xs text-gray-700 space-y-2">
//               <div className="font-bold text-base">John Doe</div>

//               <div className="font-semibold">Summary</div>
//               <div>Software engineer focused on clean architecture...</div>

//               <div className="font-semibold">Experience</div>
//               <div>Software Engineer · Company (2022–Present)</div>

//               <div className="font-semibold">Skills</div>
//               <div>Node.js, MongoDB, React</div>
//             </div>
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-8">
//           {/* Form Section */}
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <form className="space-y-4">
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-1">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter full name..."
//                   value={fullName}
//                   onChange={(e) => setFullName(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded bg-slate-50 text-gray-800 placeholder:text-gray-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-1">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   placeholder="Enter email..."
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded bg-slate-50 text-gray-800 placeholder:text-gray-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-1">
//                   Phone
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter phone..."
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded bg-slate-50 text-gray-800 placeholder:text-gray-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-1">
//                   Professional Summary
//                 </label>
//                 <textarea
//                   placeholder="Enter professional summary..."
//                   value={summary}
//                   onChange={(e) => setSummary(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded bg-slate-50 text-gray-800 placeholder:text-gray-500 min-h-20"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-1">
//                   Skills
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter skills (comma separated)"
//                   value={skills}
//                   onChange={(e) => setSkills(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded bg-slate-50 text-gray-800 placeholder:text-gray-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-1">
//                   Job Title
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter job title..."
//                   value={jobTitle}
//                   onChange={(e) => setJobTitle(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded bg-slate-50 text-gray-800 placeholder:text-gray-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-1">
//                   Company
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter company name..."
//                   value={company}
//                   onChange={(e) => setCompany(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded bg-slate-50 text-gray-800 placeholder:text-gray-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-1">
//                   Years
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter years (e.g. 2021-2024)"
//                   value={years}
//                   onChange={(e) => setYears(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded bg-slate-50 text-gray-800 placeholder:text-gray-500"
//                 />
//               </div>
//             </form>
//           </div>

//           {/* Preview Section */}
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <h2 className="text-xl font-bold text-slate-800 mb-4">Preview</h2>

//             {/* <div className="bg-slate-50 p-4 rounded border min-h-[400px]">
//                 {template === "templateA" && (
//                   <TemplateA
//                     fullName={fullName}
//                     email={email}
//                     phone={phone}
//                     summary={summary}
//                     skills={skills}
//                   />
//                 )}

//                 {template === "templateB" && (
//                   <TemplateB
//                     fullName={fullName}
//                     email={email}
//                     phone={phone}
//                     summary={summary}
//                     skills={skills}
//                   />
//                 )}
//               </div> */}

//             <div className="bg-slate-50 p-4 rounded border min-h-[400px]">
//               {template === "templateA" && <TemplateA {...templateAData} />}
//               {template === "templateB" && <TemplateB {...templateBData} />}
//             </div>

//             <button
//               type="button"
//               onClick={downloadPDF}
//               className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-semibold transition"
//             >
//               Download as PDF
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

//app\create-resume\page.tsx

// "use client";
// import { useState } from "react";
// import { useEffect } from "react";

// export default function CreateResumePage() {
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [summary, setSummary] = useState("");
//   const [phone, setPhone] = useState("");
//   const [jobTitle, setJobTitle] = useState("");
//   const [company, setCompany] = useState("");
//   const [years, setYears] = useState("");
//   const [skills, setSkills] = useState("");
//   const [resumeText, setResumeText] = useState("");
//   useEffect(() => {
//     setResumeText(
//       `**${fullName}**
// ${email} | ${phone}

// **SUMMARY**
// ${summary}

// **EXPERIENCE**
// ${jobTitle} | ${company} (${years})

// **SKILLS**
// ${skills}`
//     );
//   }, [fullName, email, phone, summary, jobTitle, company, years, skills]);
//   async function downloadPDF(): Promise<void> {
//     try {
//       const response = await fetch("/api/resume/pdf", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           fullName,
//           email,
//           phone,
//           summary,
//           jobTitle,
//           company,
//           years,
//           skills,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to generate PDF");
//       }

//       const blob = await response.blob();
//       const url = URL.createObjectURL(blob);

//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "resume.pdf";
//       document.body.appendChild(a);
//       a.click();

//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("PDF download error:", error);
//       alert("PDF generation failed");
//     }
//   }

//   return (
//     <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 py-10 px-4">
//       <div className="max-w-6xl mx-auto">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-white mb-2">
//             Create New Resume
//           </h1>
//           <p className="text-slate-300">Start building resume</p>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-8">
//           {/* Form Section */}
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <form className="space-y-4">
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-1">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter full name..."
//                   value={fullName}
//                   onChange={(e) => setFullName(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded bg-slate-50 text-gray-800 placeholder:text-gray-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-1">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   placeholder="Enter email..."
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded bg-slate-50 text-gray-800 placeholder:text-gray-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-1">
//                   Phone
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter phone..."
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded bg-slate-50 text-gray-800 placeholder:text-gray-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-1">
//                   Professional Summary
//                 </label>
//                 <textarea
//                   placeholder="Enter professional summary..."
//                   value={summary}
//                   onChange={(e) => setSummary(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded bg-slate-50 text-gray-800 placeholder:text-gray-500 min-h-20"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-1">
//                   Skills
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter skills (comma separated)"
//                   value={skills}
//                   onChange={(e) => setSkills(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded bg-slate-50 text-gray-800 placeholder:text-gray-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-1">
//                   Job Title
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter job title..."
//                   value={jobTitle}
//                   onChange={(e) => setJobTitle(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded bg-slate-50 text-gray-800 placeholder:text-gray-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-1">
//                   Company
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter company name..."
//                   value={company}
//                   onChange={(e) => setCompany(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded bg-slate-50 text-gray-800 placeholder:text-gray-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-1">
//                   Years
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter years (e.g. 2021-2024)"
//                   value={years}
//                   onChange={(e) => setYears(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded bg-slate-50 text-gray-800 placeholder:text-gray-500"
//                 />
//               </div>
//             </form>
//           </div>

//           {/* Preview Section */}
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <h2 className="text-xl font-bold text-slate-800 mb-4">Preview</h2>

//             <pre>
//               <div className="bg-slate-50 p-4 rounded border border-gray-200 text-sm text-gray-800 leading-relaxed font-sans min-h-[400px] mb-4">
//                 {/* Name + contact */}
//                 <div className="mb-4">
//                   <div className="font-bold text-base">{fullName}</div>
//                   <div>
//                     {email} | {phone}
//                   </div>
//                 </div>

//                 {/* Summary */}
//                 <div className="mb-4">
//                   <div className="font-semibold">Summary</div>
//                   <div>{summary}</div>
//                 </div>

//                 {/* Experience */}
//                 <div className="mb-4">
//                   <div className="font-semibold">Experience</div>
//                   <div>
//                     {jobTitle} | {company} ({years})
//                   </div>
//                 </div>

//                 {/* Skills */}
//                 <div>
//                   <div className="font-semibold">Skills</div>
//                   <div>{skills}</div>
//                 </div>
//               </div>
//             </pre>

//             <button
//               type="button"
//               onClick={downloadPDF}
//               className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-semibold transition"
//             >
//               Download as PDF
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
