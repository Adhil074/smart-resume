type TemplateBProps = {
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
    <div
      className="text-sm text-slate-800 leading-normal font-sans"
      style={{ fontFamily: '"Times New Roman", Times, serif' }} 
    >
      {(fullName || email || phone) && (
        <>
          {fullName && (
            <h1 className="text-xl font-semibold text-blue-700">
              {fullName}
            </h1>
          )}
          {(email || phone) && (
            <p className="text-sm mb-2">
              {email}
              {email && phone && " | "}
              {phone}
            </p>
          )}
          <div className="border-b border-gray-400 mb-4" /> 
        </>
      )}

      {summary && (
        <>
          <h2 className="text-blue-600 font-semibold uppercase">
            Career Objective
          </h2>
          <p className="mb-4">{summary}</p> 
        </>
      )}

      {skills && (
        <>
          <h2 className="text-blue-600 font-semibold uppercase">Skills</h2>
          <p className="mb-4">{skills}</p> 
        </>
      )}

      {education && (
        <>
          <h2 className="text-blue-600 font-semibold uppercase">Education</h2>
          <p className="mb-4">{education}</p>
        </>
      )}

      {experience && (
        <>
          <h2 className="text-blue-600 font-semibold uppercase">Experience</h2>
          <p className="mb-4">{experience}</p>
        </>
      )}

      {projects && (
        <>
          <h2 className="text-blue-600 font-semibold uppercase">Projects</h2>
          <p className="mb-4">{projects}</p>
        </>
      )}

      {certifications && (
        <>
          <h2 className="text-blue-600 font-semibold uppercase">
            Certifications
          </h2>
          <p className="mb-4">{certifications}</p>
        </>
      )}
    </div>
  );
}
