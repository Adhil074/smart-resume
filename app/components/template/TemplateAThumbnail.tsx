// app\components\template\TemplateAThumbnail.tsx

export default function TemplateAThumbnail() {
  return (
    <div className="w-[260px] h-auto bg-white text-black font-serif text-[10px] leading-tight p-3">
      {/* header */}
      <div className="text-center mb-2">
        <p className="font-bold text-[11px]">John Doe</p>
        <p className="text-[9px]">john.doe@email.com | 9876543210</p>
      </div>

      {/* summary */}
      <p className="font-bold border-b mb-1">PROFESSIONAL SUMMARY</p>
      <p className="mb-2">
        Full-stack developer with experience building scalable web applications
        and clean UI systems.
      </p>

      {/* skills */}
      <p className="font-bold border-b mb-1">SKILLS</p>
      <p className="mb-2">React, Next.js, TypeScript, Tailwind CSS</p>

      {/* education */}
      <p className="font-bold border-b mb-1">EDUCATION</p>
      <p className="mb-2">B.Tech – Computer Science Engineering</p>

      {/* experience */}
      <p className="font-bold border-b mb-1">EXPERIENCE</p>
      <p className="mb-2">
        Full-Stack Developer Intern – XYZ Solutions (2022–Present)
      </p>

      {/* projects */}
      <p className="font-bold border-b mb-1">PROJECTS</p>
      <p className="mb-2">
        Smart Resume Builder – Built resume creation and PDF export flow.
      </p>

      {/* certifications */}
      <p className="font-bold border-b mb-1">CERTIFICATIONS</p>
      <p>JavaScript & React Developer Certification</p>
    </div>
  );
}