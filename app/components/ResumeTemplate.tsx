"use client";

interface ResumeTemplateProps {
  fullName: string;
  email: string;
  phone: string;
  summary: string;
  jobTitle: string;
  company: string;
  years: string;
  skills: string;
}

export default function ResumeTemplate({
  fullName,
  email,
  phone,
  summary,
  jobTitle,
  company,
  years,
  skills,
}: ResumeTemplateProps) {
  return (
    <div className="pdf-resume text-black text-sm leading-relaxed font-sans">
      {/* TOP SPACER — prevents PDF top clipping */}
      <div className="pdf-top-spacer" />

      {/* HEADER */}
      <section className="mb-4">
        <h1 className="text-lg font-bold">{fullName}</h1>
        <p>
          {email} | {phone}
        </p>
      </section>

      {/* SUMMARY */}
      {summary && (
        <section className="mb-4">
          <h2 className="font-semibold uppercase text-xs mb-1">Summary</h2>
          <p>{summary}</p>
        </section>
      )}

      {/* EXPERIENCE */}
      {(jobTitle || company) && (
        <section className="mb-4">
          <h2 className="font-semibold uppercase text-xs mb-1">Experience</h2>
          <p>
            {jobTitle} {company && `| ${company}`} {years && `(${years})`}
          </p>
        </section>
      )}

      {/* SKILLS */}
      {skills && (
        <section>
          <h2 className="font-semibold uppercase text-xs mb-1">Skills</h2>
          <p>{skills}</p>
        </section>
      )}
    </div>
  );
}
