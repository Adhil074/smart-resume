// app\components\preview\TemplateB.tsx

type TemplateBProps = {
  fullName: string;
  email: string;
  phone: string;
  summary: string;
  skills: string;
};

export default function TemplateB({
  fullName,
  email,
  phone,
  summary,
  skills,
}: TemplateBProps) {
  return (
    <div className="text-sm text-slate-800 font-sans">
      {/* <h1 className="text-lg font-semibold text-blue-700">
        {fullName || "Your Name"}
      </h1>
      <p className="text-xs mb-2">
        {email || "email@example.com"}
        {phone && ` | ${phone}`}
      </p>

      <div className="border-b border-gray-400 mb-3" /> */}

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
    </div>
  );
}

// type TemplateBProps = {
//   fullName: string;
//   email: string;
//   phone: string;
//   summary: string;
//   skills: string;
// };

// export default function TemplateB({
//   fullName,
//   email,
//   phone,
//   summary,
//   skills,
// }: TemplateBProps) {
//   return (
//     <div className="text-sm text-slate-800 font-sans">
//       {/* Name + Contact (left aligned, with divider line as per reference) */}
//       <h1 className="text-lg font-semibold text-blue-700">
//         {fullName || "Your Name"}
//       </h1>
//       <p className="text-xs mb-2">
//         {email || "email@example.com"}
//         {phone && ` | ${phone}`}
//       </p>

//       {/* Horizontal divider below name */}
//       <div className="border-b border-gray-400 mb-3" />

//       {/* Career Objective */}
//       <h2 className="text-blue-600 font-semibold">Career Objective</h2>
//       <p className="mb-3">{summary || "Write your career objective here."}</p>

//       {/* Education (static for now, as agreed) */}
//       <h2 className="text-blue-600 font-semibold">Education</h2>
//       <p className="mb-3">B.Tech – Computer Science Engineering</p>

//       {/* Skills */}
//       <h2 className="text-blue-600 font-semibold">Skills</h2>
//       <p>{skills || "Add your skills here"}</p>
//     </div>
//   );
// }
