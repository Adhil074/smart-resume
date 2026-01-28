//app\components\template\TemplateBThumbnail.tsx

export default function TemplateBThumbnail() {
  return (
    
    <div
  className="w-[260px] h-auto bg-white text-black text-[10px] leading-tight p-3"
  style={{ fontFamily: '"Times New Roman", Times, serif' }}
>
      {/* header */}
      <div className="mb-2">
        <p className="text-[11px] font-semibold text-blue-700">Adhil Baig</p>
        <p className="text-[9px]">adhil@email.com | 9876543210</p>
      </div>

      <div className="border-b border-gray-400 mb-2" />

      {/* career Objective */}
      <p className="text-blue-600 font-semibold">CAREER OBJECTIVE</p>
      <p className="mb-2">
        Seeking a challenging role to apply problem-solving skills and grow
        professionally.
      </p>

      {/* skills */}
      <p className="text-blue-600 font-semibold">SKILLS</p>
      <p className="mb-2">Node.js, MongoDB, React</p>

      {/* education */}
      <p className="text-blue-600 font-semibold">EDUCATION</p>
      <p className="mb-2">B.Tech – Computer Science Engineering</p>

      {/* experience */}
      <p className="text-blue-600 font-semibold">EXPERIENCE</p>
      <p className="mb-2">
        Backend Developer Intern – CloudNova (2021–2024)
      </p>

      {/* projects */}
      <p className="text-blue-600 font-semibold">PROJECTS</p>
      <p className="mb-2">
        API Management System – Built scalable REST APIs.
      </p>

      {/* certifications */}
      <p className="text-blue-600 font-semibold">CERTIFICATIONS</p>
      <p>MongoDB Developer Certification</p>
    </div>
  );
}