// app\components\preview\TemplateA.tsx

type TemplateAProps = {
  fullName: string;
  email: string;
  phone: string;
  summary: string;
  skills: string;
};

export default function TemplateA({
  fullName,
  email,
  phone,
  summary,
  skills,
}: TemplateAProps) {
  return (
    <div className="text-sm text-black font-serif">
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
    </div>
  );
}

// type TemplateAProps = {
//   fullName: string;
//   email: string;
//   phone: string;
//   summary: string;
//   skills: string;
// };

// export default function TemplateA({
//   fullName,
//   email,
//   phone,
//   summary,
//   skills,
// }: TemplateAProps) {
//   return (
//     <div className="text-sm text-black font-serif">
//       {/* Name + Contact (centered as per reference) */}
//       <div className="text-center mb-4">
//         <h1 className="text-xl font-bold">{fullName || "Your Name"}</h1>
//         <p className="text-sm mb-3">
//           {email || "email@example.com"} {phone && `| ${phone}`}
//         </p>
//       </div>

//       {/* Professional Summary */}
//       <h2 className="font-bold border-b mb-1">PROFESSIONAL SUMMARY</h2>
//       <p className="mb-3">
//         {summary || "Write a short professional summary here."}
//       </p>

//       {/* Skills */}
//       <h2 className="font-bold border-b mb-1">SKILLS</h2>
//       <p className="mb-3">{skills || "Add your skills here"}</p>

//       {/* Projects (static for now, as discussed) */}
//       <h2 className="font-bold border-b mb-1">PROJECTS</h2>
//       <p>• AuraRes.ai – Resume Builder</p>
//     </div>
//   );
// }
