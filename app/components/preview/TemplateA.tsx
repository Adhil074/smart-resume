// app\components\preview\TemplateA.tsx

type TemplateAProps = {
  fullName: string;
  email: string;
  phone: string;
  summary: string;
  skills: string;
  education: string;
  experience: string;
  projects:string;
  certifications:string;
};
export default function TemplateA({
  fullName,
  email,
  phone,
  summary,
  skills,
  education,
  experience,
  projects,
  certifications,
}: TemplateAProps) {
  return (
    <div className="text-sm  text-black font-serif">
      {(fullName || email || phone) && (
        <div className="text-center mb-4">
          {fullName && <h1 className="text-xl font-bold">{fullName}</h1>}

          {(email || phone) && (
            <p className="text-sm mt-1">
              {email}
              {email && phone && " | "}
              {phone}
            </p>
          )}
        </div>
      )}

      {summary && (
        <>
          <h2 className="font-bold border-b mb-1">PROFESSIONAL SUMMARY</h2>
          <p className="mb-3">{summary}</p>
        </>
      )}

      {skills && (
        <>
          <h2 className="font-bold border-b mb-1">SKILLS</h2>
          <p className="mb-3">{skills}</p>
        </>
      )}

      {education && (
        <>
          <h2 className="font-bold border-b mb-1">EDUCATION</h2>
          <p className="mb-3 whitespace-pre-line">{education}</p>
        </>
      )}

      {experience && (
        <>
          <h2 className="font-bold border-b mb-1">EXPERIENCE</h2>
          <p className="mb-3 whitespace-pre-line">{experience}</p>
        </>
      )}

       {projects && (
        <>
          <h2 className="font-bold border-b mb-1">PROJECTS</h2>
          <p className="mb-3 whitespace-pre-line">{projects}</p>
        </>
      )}

       {certifications && (
        <>
          <h2 className="font-bold border-b mb-1">CERTIFICATIONS</h2>
          <p className="mb-3 whitespace-pre-line">{certifications}</p>
        </>
      )}


    </div>
  );
}

