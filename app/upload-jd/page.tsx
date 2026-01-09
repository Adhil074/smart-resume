"use client";

import { useState } from "react";
import LearningResources from "@/app/components/LearningResources";
import { useRouter } from 'next/navigation';
import router from "next/router";


export default function UploadJDPage() {
  const router = useRouter();
  const [jdText, setJdText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [groqSkills, setGroqSkills] = useState<string[]>([]);
  const [matchPercent, setMatchPercent] = useState<number | null>(null);
  const [matchedSkills, setMatchedSkills] = useState<string[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);

  const [resumeAnalyzed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("resumeAnalyzed") === "true";
  });

  async function handleAnalyze() {
    if (!jdText.trim()) {
      alert("Please paste a job description");
      return;
    }

    setIsLoading(true);

    // 1️⃣ Extract JD skills using Groq
    const res = await fetch("/api/jd/analyzegroq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jdText }),
    });

    const data = await res.json();
    const jdSkills: string[] = data.skills || [];
    setGroqSkills(jdSkills);

    // 2️⃣ If resume analyzed, compute match
    if (resumeAnalyzed) {
      const resumeRes = await fetch("/api/resume/latest", {
        credentials: "include",
      });

      const resumeData = await resumeRes.json();
      const latestResume = resumeData.resume;

      if (latestResume?.extractedSkills?.length) {
        const resumeSkillsLower = latestResume.extractedSkills.map(
          (s: string) => s.toLowerCase()
        );
        const jdSkillsLower = jdSkills.map((s) => s.toLowerCase());

        const resumeSet = new Set(resumeSkillsLower);

        const matched = jdSkillsLower.filter((s) => resumeSet.has(s));
        const missing = jdSkillsLower.filter((s) => !resumeSet.has(s));

        const percent =
          jdSkillsLower.length === 0
            ? 0
            : Math.round((matched.length / jdSkillsLower.length) * 100);

        setMatchPercent(percent);
        setMatchedSkills(matched);
        setMissingSkills(missing);
      }
    }

    // 3️⃣ Persist JD (single latest JD)
    await fetch("/api/jd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jdText, skills: jdSkills }),
    });

    setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-linear-to-br from-slate-900 to-slate-800 py-10 px-4">
      <div className="bg-white rounded-lg px-6 py-2 mb-4">
        <h1 className="text-2xl font-bold text-slate-800">
          Upload Job Description
        </h1>
      </div>

      <textarea
        placeholder="Paste job description here..."
        value={jdText}
        onChange={(e) => setJdText(e.target.value)}
        className="w-full max-w-4xl min-h-[350px] rounded-lg border border-gray-300 p-3 mb-6 bg-slate-50 text-gray-800"
      />

      <button
        onClick={handleAnalyze}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold mb-8"
      >
        {isLoading ? "Analyzing..." : "Analyze JD"}
      </button>

      {/* MATCH RESULT */}
      <div className="w-full max-w-4xl">
        {/* <h2 className="text-xl font-semibold mb-4 text-white">
          Resume ↔ JD Match
        </h2> */}
        {!resumeAnalyzed && groqSkills.length > 0 && (
          <p
            onClick={() => router.push("/upload")}
            className="text-yellow-500 hover:text-yellow-400 underline cursor-pointer mb-6 text-center font-semibold"
          >
            Analyze resume to check Resume ↔ JD Match
          </p>
        )}
        {resumeAnalyzed && (
          <h2 className="text-xl font-semibold mb-4 text-white">
            Resume ↔ JD Match
          </h2>
        )}

        {resumeAnalyzed && matchPercent !== null ? (
          <div className="bg-white rounded-lg p-6 mb-8">
            <p className="text-lg font-semibold mb-4">
              Match Score:{" "}
              <span className="text-green-600">{matchPercent}%</span>
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2 text-slate-700">
                  Matched Skills
                </h3>
                <ul className="list-disc list-inside text-green-700">
                  {matchedSkills.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-slate-700">
                  Missing Skills
                </h3>
                <ul className="list-disc list-inside text-red-600">
                  {missingSkills.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : groqSkills.length > 0 ? (
          <LearningResources skills={groqSkills} />
        ) : null}
      </div>
    </div>
  );
}

// //app\upload-jd\page.tsx

// "use client";

// import { useState } from "react";
// import LearningResources from "@/app/components/LearningResources";

// type ResourceLinks = {
//   youtube: string;
//   docs: string;
//   course: string;
// };

// const RESOURCE_MAP: Record<string, ResourceLinks> = {
//   react: {
//     youtube: "https://www.youtube.com/watch?v=RVFAyFWO4go", // Fireship React
//     docs: "https://react.dev/learn",
//     course:
//       "https://www.freecodecamp.org/learn/front-end-development-libraries/react/",
//   },
//   "node.js": {
//     youtube: "https://www.youtube.com/watch?v=TlB_eWDSMt4", // Traversy
//     docs: "https://nodejs.org/en/docs",
//     course: "https://www.freecodecamp.org/learn/back-end-development-and-apis/",
//   },
//   mongodb: {
//     youtube: "https://www.youtube.com/watch?v=ofme2o29ngU", // MongoDB Crash Course
//     docs: "https://www.mongodb.com/docs/",
//     course:
//       "https://www.freecodecamp.org/learn/back-end-development-and-apis/#mongodb-and-mongoose",
//   },
//   typescript: {
//     youtube: "https://www.youtube.com/watch?v=30LWjhZzg50",
//     docs: "https://www.typescriptlang.org/docs/",
//     course:
//       "https://www.freecodecamp.org/learn/back-end-development-and-apis/#typescript",
//   },
//   express: {
//     youtube: "https://www.youtube.com/watch?v=Oe421EPjeBE&t=6400s",
//     docs: "https://expressjs.com/en/starter/installing.html",
//     course: "https://www.udemy.com/course/nodejs-the-complete-guide/",
//   },
//   redux: {
//     youtube: "https://www.youtube.com/watch?v=9boMnm5X9ak",
//     docs: "https://redux.js.org/tutorials/essentials/part-1-overview-concepts",
//     course: "https://www.udemy.com/course/react-redux/",
//   },
//   git: {
//     youtube: "https://www.youtube.com/watch?v=RGOj5yH7evk",
//     docs: "https://git-scm.com/doc",
//     course: "https://www.udemy.com/course/git-and-github-bootcamp/",
//   },
//   docker: {
//     youtube: "https://www.youtube.com/watch?v=Gjnup-PuquQ",
//     docs: "https://docs.docker.com/get-started/",
//     course: "https://www.udemy.com/course/docker-mastery/",
//   },
//   aws: {
//     youtube: "https://www.youtube.com/watch?v=ulprqHHWlng",
//     docs: "https://docs.aws.amazon.com/index.html",
//     course:
//       "https://www.udemy.com/course/aws-certified-developer-associate-dva-c01/",
//   },
// };

// function getBestResourcesForSkill(skill: string): ResourceLinks {
//   const key = skill.toLowerCase().trim();
//   const curated = RESOURCE_MAP[key];

//   if (curated) {
//     return curated;
//   }

//   // Fallback for skills we didn't map
//   const encoded = encodeURIComponent(skill);

//   return {
//     youtube: `https://www.youtube.com/results?search_query=${encoded}+tutorial`,
//     docs: `https://www.google.com/search?q=${encoded}+official+documentation`,
//     course: `https://www.google.com/search?q=${encoded}+complete+course`,
//   };
// }

// export default function UploadJDPage() {
//   const [jdText, setJdText] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [jdskills, setJDSkills] = useState<string[]>([]);
//   const [groqSkills, setGroqSkills] = useState<string[]>([]);
//   const [matchPercent, setMatchPercent] = useState<number | null>(null);
//   const [matchedSkills, setMatchedSkills] = useState<string[]>([]);
//   const [missingSkills, setMissingSkills] = useState<string[]>([]);
//   const [resumeAnalyzed] = useState<boolean>(() => {
//     if (typeof window === "undefined") return false;
//     return sessionStorage.getItem("resumeAnalyzed") === "true";
//   });

//   async function handleAnalyze() {
//     if (!jdText.trim()) {
//       alert("Please paste a job description");
//       return;
//     }

//     setIsLoading(true);

//     const res = await fetch("/api/jd/analyzegroq", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ jdText }),
//     });

//     const data = await res.json();
//     setGroqSkills(data.skills || []);

//     // fetch latest resume
//     const resumeRes = await fetch("/api/resume/latest", {
//       credentials: "include",
//     });
//     const resumeData = await resumeRes.json();
//     const latestResume = resumeData.resume;

//     // normalize skills
//     const resumeSkillsLower = latestResume.extractedSkills.map((s: string) =>
//       s.toLowerCase()
//     );
//     const jdSkillsLower = (data.skills || []).map((s: string) =>
//       s.toLowerCase()
//     );

//     const resumeSet = new Set(resumeSkillsLower);

//     const matched = jdSkillsLower.filter((s: string) => resumeSet.has(s));
//     const missing = jdSkillsLower.filter((s: string) => !resumeSet.has(s));

//     const percent =
//       jdSkillsLower.length === 0
//         ? 0
//         : Math.round((matched.length / jdSkillsLower.length) * 100);

//     // update UI
//     setMatchPercent(percent);
//     setMatchedSkills(matched);
//     setMissingSkills(missing);

//     await fetch("/api/jd", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ jdText, skills: data.skills }),
//     });
//     if (typeof window !== "undefined") {
//       sessionStorage.setItem("activeJDSession", "true");
//     }
//     setIsLoading(false);
//   }

//   return (
//     <div className="min-h-screen flex flex-col justify-center items-center bg-linear-to-br from-slate-900 to-slate-800 py-10 px-4">
//       <div className="bg-white w-150 flex items-center justify-center mb-1 rounded-lg flex-col">
//         <h1 className="text-2xl font-bold mb-1 mt-1 text-slate-800 ">
//           Upload Job Description
//         </h1>
//       </div>

//       <textarea
//         placeholder="Paste job description here..."
//         value={jdText}
//         onChange={(e) => setJdText(e.target.value)}
//         className="w-200 min-h-[350px] rounded-lg border border-gray-300 p-3 mb-6 bg-slate-50 text-gray-800 placeholder:text-gray-500 "
//       />

//       <br />

//       <button
//         type="button"
//         onClick={handleAnalyze}
//         disabled={isLoading}
//         className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold transition mb-4"
//       >
//         {isLoading ? "Analyzing..." : "Analyze JD"}
//       </button>

//       <div className="mt-8">
//         <h2 className="text-xl font-semibold mb-4">Resume ↔ JD Match</h2>

//         {/* ✅ Case 1: Resume analyzed → show match */}
//         {resumeAnalyzed && matchPercent !== null && (
//           <div className="bg-white rounded-lg p-6 mb-8 w-full">
//             <p className="text-lg font-semibold mb-4">
//               Match Score:{" "}
//               <span className="text-green-600">{matchPercent}%</span>
//             </p>

//             <div className="grid md:grid-cols-2 gap-6">
//               <div>
//                 <h3 className="font-semibold mb-2 text-slate-700">
//                   Matched Skills
//                 </h3>
//                 <ul className="list-disc list-inside text-green-700">
//                   {matchedSkills.map((s) => (
//                     <li key={s}>{s}</li>
//                   ))}
//                 </ul>
//               </div>

//               <div>
//                 <h3 className="font-semibold mb-2 text-slate-700">
//                   Missing Skills
//                 </h3>
//                 <ul className="list-disc list-inside text-red-600">
//                   {missingSkills.map((s) => (
//                     <li key={s}>{s}</li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ✅ Case 2: Resume NOT analyzed → show learning resources */}
//         {!resumeAnalyzed && groqSkills.length > 0 && (
//           <LearningResources skills={groqSkills} />
//         )}

//         {/* ✅ Case 3: Nothing yet */}
//         {!resumeAnalyzed && groqSkills.length === 0 && (
//           <p className="text-yellow-500">
//             Analyze your resume to see match score
//           </p>
//         )}
//       </div>

//       {jdskills.length > 0 && (
//         <h2 className="text-xl font-bold mb-6 text-white mt-7">
//           Learning resources
//         </h2>
//       )}

//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {jdskills.map((skill, index) => {
//           const resources = getBestResourcesForSkill(skill);

//           return (
//             <div
//               key={index}
//               className="bg-slate-50 text-black rounded-lg p-1 border border-gray-200 hover:shadow-md transition"
//             >
//               <h3 className="text-lg font-semibold mb-3">{skill}</h3>

//               <div className="flex flex-wrap gap-3">
//                 <a
//                   href={resources.youtube}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="inline-block bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-medium transition"
//                 >
//                   YouTube
//                 </a>
//                 <a
//                   href={resources.docs}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium transition"
//                 >
//                   Docs
//                 </a>
//                 <a
//                   href={resources.course}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-medium transition"
//                 >
//                   Courses
//                 </a>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// //app\upload-jd\page.tsx

// // "use client";

// // import { useState } from "react";

// // type ResourceLinks = {
// //   youtube: string;
// //   docs: string;
// //   course: string;
// // };

// // const RESOURCE_MAP: Record<string, ResourceLinks> = {
// //   react: {
// //     youtube: "https://www.youtube.com/watch?v=RVFAyFWO4go", // Fireship React
// //     docs: "https://react.dev/learn",
// //     course:
// //       "https://www.freecodecamp.org/learn/front-end-development-libraries/react/",
// //   },
// //   "node.js": {
// //     youtube: "https://www.youtube.com/watch?v=TlB_eWDSMt4", // Traversy
// //     docs: "https://nodejs.org/en/docs",
// //     course: "https://www.freecodecamp.org/learn/back-end-development-and-apis/",
// //   },
// //   mongodb: {
// //     youtube: "https://www.youtube.com/watch?v=ofme2o29ngU", // MongoDB Crash Course
// //     docs: "https://www.mongodb.com/docs/",
// //     course:
// //       "https://www.freecodecamp.org/learn/back-end-development-and-apis/#mongodb-and-mongoose",
// //   },
// //   typescript: {
// //     youtube: "https://www.youtube.com/watch?v=30LWjhZzg50",
// //     docs: "https://www.typescriptlang.org/docs/",
// //     course:
// //       "https://www.freecodecamp.org/learn/back-end-development-and-apis/#typescript",
// //   },
// //   express: {
// //     youtube: "https://www.youtube.com/watch?v=Oe421EPjeBE&t=6400s",
// //     docs: "https://expressjs.com/en/starter/installing.html",
// //     course: "https://www.udemy.com/course/nodejs-the-complete-guide/",
// //   },
// //   redux: {
// //     youtube: "https://www.youtube.com/watch?v=9boMnm5X9ak",
// //     docs: "https://redux.js.org/tutorials/essentials/part-1-overview-concepts",
// //     course: "https://www.udemy.com/course/react-redux/",
// //   },
// //   git: {
// //     youtube: "https://www.youtube.com/watch?v=RGOj5yH7evk",
// //     docs: "https://git-scm.com/doc",
// //     course: "https://www.udemy.com/course/git-and-github-bootcamp/",
// //   },
// //   docker: {
// //     youtube: "https://www.youtube.com/watch?v=Gjnup-PuquQ",
// //     docs: "https://docs.docker.com/get-started/",
// //     course: "https://www.udemy.com/course/docker-mastery/",
// //   },
// //   aws: {
// //     youtube: "https://www.youtube.com/watch?v=ulprqHHWlng",
// //     docs: "https://docs.aws.amazon.com/index.html",
// //     course:
// //       "https://www.udemy.com/course/aws-certified-developer-associate-dva-c01/",
// //   },
// // };

// // function getBestResourcesForSkill(skill: string): ResourceLinks {
// //   const key = skill.toLowerCase().trim();
// //   const curated = RESOURCE_MAP[key];

// //   if (curated) {
// //     return curated;
// //   }

// //   // Fallback for skills we didn't map
// //   const encoded = encodeURIComponent(skill);

// //   return {
// //     youtube: `https://www.youtube.com/results?search_query=${encoded}+tutorial`,
// //     docs: `https://www.google.com/search?q=${encoded}+official+documentation`,
// //     course: `https://www.google.com/search?q=${encoded}+complete+course`,
// //   };
// // }

// // export default function UploadJDPage() {
// //   const [jdText, setJdText] = useState("");
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [jdskills, setJDSkills] = useState<string[]>([]);

// //   async function handleAnalyze() {
// //     if (!jdText.trim()) {
// //       alert("Please paste a job description");
// //       return;
// //     }

// //     setIsLoading(true);

// //     const res = await fetch("/api/jd/analyze", {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify({ jdText }),
// //     });

// //     const data = await res.json();
// //     setJDSkills(data.skills || []);
// //     await fetch("/api/jd", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ jdText, skills: data.skills }),
// //     });
// //     if (typeof window !== "undefined") {
// //       sessionStorage.setItem("activeJDSession", "true");
// //     }
// //     setIsLoading(false);
// //   }

// //   return (
// //     <div className="min-h-screen flex flex-col justify-center items-center bg-linear-to-br from-slate-900 to-slate-800 py-10 px-4">
// //       <div className="bg-white w-150 flex items-center justify-center mb-1 rounded-lg flex-col">
// //         <h1 className="text-2xl font-bold mb-1 mt-1 text-slate-800 ">
// //           Upload Job Description
// //         </h1>
// //       </div>

// //       <textarea
// //         placeholder="Paste job description here..."
// //         value={jdText}
// //         onChange={(e) => setJdText(e.target.value)}
// //         className="w-200 min-h-[350px] rounded-lg border border-gray-300 p-3 mb-6 bg-slate-50 text-gray-800 placeholder:text-gray-500 "
// //       />

// //       <br />

// //       <button
// //         type="button"
// //         onClick={handleAnalyze}
// //         disabled={isLoading}
// //         className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold transition mb-4"
// //       >
// //         {isLoading ? "Analyzing..." : "Analyze JD"}
// //       </button>
// //       {jdskills.length > 0 && (
// //         <h2 className="text-xl font-bold mb-6 text-white mt-7">
// //           Learning resources
// //         </h2>
// //       )}

// //       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
// //         {jdskills.map((skill, index) => {
// //           const resources = getBestResourcesForSkill(skill);

// //           return (
// //             <div
// //               key={index}
// //               className="bg-slate-50 text-black rounded-lg p-1 border border-gray-200 hover:shadow-md transition"
// //             >
// //               <h3 className="text-lg font-semibold mb-3">{skill}</h3>

// //               <div className="flex flex-wrap gap-3">
// //                 <a
// //                   href={resources.youtube}
// //                   target="_blank"
// //                   rel="noopener noreferrer"
// //                   className="inline-block bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-medium transition"
// //                 >
// //                   YouTube
// //                 </a>
// //                 <a
// //                   href={resources.docs}
// //                   target="_blank"
// //                   rel="noopener noreferrer"
// //                   className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium transition"
// //                 >
// //                   Docs
// //                 </a>
// //                 <a
// //                   href={resources.course}
// //                   target="_blank"
// //                   rel="noopener noreferrer"
// //                   className="inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-medium transition"
// //                 >
// //                   Courses
// //                 </a>
// //               </div>
// //             </div>
// //           );
// //         })}
// //       </div>
// //     </div>
// //   );
// // }
