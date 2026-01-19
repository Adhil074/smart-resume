// app\components\preview\TemplateB.tsx

type TemplateBProps = {
  fullName: string;
  email: string;
  phone: string;
  summary: string;
  skills: string;
  education: string;
  experience: string;
  projects: string;
  certifications:string;
};

export default function TemplateB({
  fullName,
  email,
  phone,
  summary,
  skills,
  education,
  experience,
  projects,
  certifications,
}: TemplateBProps) {
  return (
    <div className="text-sm text-slate-800 font-sans">
      {(fullName || email || phone) && (
        <>
          {fullName && (
            <h1 className="text-lg font-semibold text-blue-700">{fullName}</h1>
          )}

          {(email || phone) && (
            <p className="text-xs mb-2">
              {email}
              {email && phone && " | "}
              {phone}
            </p>
          )}

          <div className="border-b border-gray-400 mb-3" />
        </>
      )}

      {summary && (
        <>
          <h2 className="text-blue-600 font-semibold">Career Objective</h2>
          <p className="mb-3">{summary}</p>
        </>
      )}

      {skills && (
        <>
          <h2 className="text-blue-600 font-semibold">Skills</h2>
          <p>{skills}</p>
        </>
      )}

      {education && (
        <>
          <h2 className="text-blue-600 font-semibold">Education</h2>
          <p className="mb-3">{education}</p>
        </>
      )}
      {experience && (
        <>
          <h2 className="text-blue-600 font-semibold">EXPERIENCE</h2>
          <p className="mb-3">{experience}</p>
        </>
      )}

      {projects && (
        <>
          <h2 className="text-blue-600 font-semibold">PROJECTS</h2>
          <p className="mb-3">{projects}</p>
        </>
      )}

        {certifications && (
        <>
          <h2 className="text-blue-600 font-semibold">CERTIFICATIONS</h2>
          <p className="mb-3">{certifications}</p>
        </>
      )}
    </div>
  );
}
