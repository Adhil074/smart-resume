// app/create-resume/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [template, setTemplate] = useState<"templateA" | "templateB">(
    "templateA",
  );

  // isolated state
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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Create New Resume
        </h1>

        <p className="text-center text-slate-200 mt-2 mb-3">Select Template</p>

        {/* template selection */}
        <div className="flex justify-center gap-6 mb-8">
          {/* template A */}
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

          {/* template B */}
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
          {/* form*/}
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

            {/* education */}
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

          {/* preview */}
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

