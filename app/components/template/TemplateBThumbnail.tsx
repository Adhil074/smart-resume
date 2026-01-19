// type TemplateBThumbnailProps = {
//   fullName: string;
//   email: string;
//   phone: string;
//   summary: string;
//   skills: string;
//   education: string;
//   experience: string;
//   projects: string;
//   certifications: string;
// };

// export default function TemplateBThumbnail({
//   fullName,
//   email,
//   phone,
//   summary,
//   skills,
//   education,
//   experience,
//   projects,
//   certifications,
// }: TemplateBThumbnailProps) {
//   return (
//     <div className="w-[260px] bg-white text-slate-800 font-sans text-[10px] leading-tight p-3">
//       <p className="text-blue-700 font-semibold">{fullName}</p>
//       <p className="mb-1">{email} | {phone}</p>
//       <div className="border-b mb-1" />

//       <p className="text-blue-600 font-semibold">Objective</p>
//       <p className="mb-1">{summary}</p>

//       <p className="text-blue-600 font-semibold">Skills</p>
//       <p className="mb-1">{skills}</p>

//       <p className="text-blue-600 font-semibold">Education</p>
//       <p className="mb-1 whitespace-pre-line">{education}</p>

//       <p className="text-blue-600 font-semibold">Experience</p>
//       <p className="mb-1 whitespace-pre-line">{experience}</p>

//       <p className="text-blue-600 font-semibold">Projects</p>
//       <p className="mb-1 whitespace-pre-line">{projects}</p>

//       <p className="text-blue-600 font-semibold">Certifications</p>
//       <p className="whitespace-pre-line">{certifications}</p>
//     </div>
//   );
// }

//app\components\template\TemplateBThumbnail.tsx

export default function TemplateBThumbnail() {
  return (
    <div className="w-[260px] h-auto bg-white text-black font-sans text-[10px] leading-tight p-3">
      {/* Header */}
      <div className="mb-2">
        <p className="text-[11px] font-semibold text-blue-700">John Doe</p>
        <p className="text-[9px]">john.doe@email.com | 9876543210</p>
      </div>

      <div className="border-b border-gray-400 mb-2" />

      {/* Career Objective */}
      <p className="text-blue-600 font-semibold">CAREER OBJECTIVE</p>
      <p className="mb-2">
        Seeking a challenging role to apply problem-solving skills and grow
        professionally.
      </p>

      {/* Skills */}
      <p className="text-blue-600 font-semibold">SKILLS</p>
      <p className="mb-2">Node.js, MongoDB, React</p>

      {/* Education */}
      <p className="text-blue-600 font-semibold">EDUCATION</p>
      <p className="mb-2">B.Tech – Computer Science Engineering</p>

      {/* Experience */}
      <p className="text-blue-600 font-semibold">EXPERIENCE</p>
      <p className="mb-2">
        Backend Developer Intern – CloudNova (2021–2024)
      </p>

      {/* Projects */}
      <p className="text-blue-600 font-semibold">PROJECTS</p>
      <p className="mb-2">
        API Management System – Built scalable REST APIs.
      </p>

      {/* Certifications */}
      <p className="text-blue-600 font-semibold">CERTIFICATIONS</p>
      <p>MongoDB Developer Certification</p>
    </div>
  );
}