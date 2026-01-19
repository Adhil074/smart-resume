// //app\components\template\TemplateAThumbnail.tsx

// export default function TemplateAThumbnail() {
//   return (
//     <div className="w-[260px] h-auto bg-white text-black font-serif text-[10px] leading-tight p-3">
//       {/* Header */}
//       <div className="text-center mb-3">
//         <div className="h-3 w-24 bg-gray-800 mx-auto mb-1 rounded" />
//         <div className="h-2 w-32 bg-gray-400 mx-auto rounded" />
//       </div>

//       {/* Section 1 */}
//       <div className="mb-3">
//         <div className="h-2 w-20 bg-gray-700 mb-1 rounded" />
//         <div className="h-2 w-full bg-gray-300 mb-1 rounded" />
//         <div className="h-2 w-5/6 bg-gray-300 rounded" />
//       </div>

//       {/* Section 2 */}
//       <div className="mb-3">
//         <div className="h-2 w-16 bg-gray-700 mb-1 rounded" />
//         <div className="h-2 w-full bg-gray-300 mb-1 rounded" />
//         <div className="h-2 w-4/6 bg-gray-300 rounded" />
//       </div>

//       {/* Section 3 */}
//       <div className="mb-3">
//         <div className="h-2 w-20 bg-gray-700 mb-1 rounded" />
//         <div className="h-2 w-full bg-gray-300 mb-1 rounded" />
//         <div className="h-2 w-5/6 bg-gray-300 rounded" />
//       </div>

//       {/* Footer lines */}
//       <div className="mt-auto">
//         <div className="h-2 w-full bg-gray-300 mb-1 rounded" />
//         <div className="h-2 w-3/4 bg-gray-300 rounded" />
//       </div>
//     </div>
//   );
// }

export default function TemplateAThumbnail() {
  return (
    <div className="w-[260px] h-auto bg-white text-black font-serif text-[10px] leading-tight p-3">
      {/* Header */}
      <div className="text-center mb-2">
        <p className="font-bold text-[11px]">John Doe</p>
        <p className="text-[9px]">john.doe@email.com | 9876543210</p>
      </div>

      {/* Summary */}
      <p className="font-bold border-b mb-1">PROFESSIONAL SUMMARY</p>
      <p className="mb-2">
        Full-stack developer with experience building scalable web applications
        and clean UI systems.
      </p>

      {/* Skills */}
      <p className="font-bold border-b mb-1">SKILLS</p>
      <p className="mb-2">React, Next.js, TypeScript, Tailwind CSS</p>

      {/* Education */}
      <p className="font-bold border-b mb-1">EDUCATION</p>
      <p className="mb-2">B.Tech – Computer Science Engineering</p>

      {/* Experience */}
      <p className="font-bold border-b mb-1">EXPERIENCE</p>
      <p className="mb-2">
        Full-Stack Developer Intern – XYZ Solutions (2022–Present)
      </p>

      {/* Projects */}
      <p className="font-bold border-b mb-1">PROJECTS</p>
      <p className="mb-2">
        Smart Resume Builder – Built resume creation and PDF export flow.
      </p>

      {/* Certifications */}
      <p className="font-bold border-b mb-1">CERTIFICATIONS</p>
      <p>JavaScript & React Developer Certification</p>
    </div>
  );
}