"use client";

import { useState } from "react";

type ResourceLinks = {
  youtube: string;
  docs: string;
  course: string;
};

const RESOURCE_MAP: Record<string, ResourceLinks> = {
  react: {
    youtube: "https://www.youtube.com/watch?v=RVFAyFWO4go", // Fireship React
    docs: "https://react.dev/learn",
    course:
      "https://www.freecodecamp.org/learn/front-end-development-libraries/react/",
  },
  "node.js": {
    youtube: "https://www.youtube.com/watch?v=TlB_eWDSMt4", // Traversy
    docs: "https://nodejs.org/en/docs",
    course: "https://www.freecodecamp.org/learn/back-end-development-and-apis/",
  },
  mongodb: {
    youtube: "https://www.youtube.com/watch?v=ofme2o29ngU", // MongoDB Crash Course
    docs: "https://www.mongodb.com/docs/",
    course:
      "https://www.freecodecamp.org/learn/back-end-development-and-apis/#mongodb-and-mongoose",
  },
  typescript: {
    youtube: "https://www.youtube.com/watch?v=30LWjhZzg50",
    docs: "https://www.typescriptlang.org/docs/",
    course:
      "https://www.freecodecamp.org/learn/back-end-development-and-apis/#typescript",
  },
  express: {
    youtube: "https://www.youtube.com/watch?v=Oe421EPjeBE&t=6400s",
    docs: "https://expressjs.com/en/starter/installing.html",
    course: "https://www.udemy.com/course/nodejs-the-complete-guide/",
  },
  redux: {
    youtube: "https://www.youtube.com/watch?v=9boMnm5X9ak",
    docs: "https://redux.js.org/tutorials/essentials/part-1-overview-concepts",
    course: "https://www.udemy.com/course/react-redux/",
  },
  git: {
    youtube: "https://www.youtube.com/watch?v=RGOj5yH7evk",
    docs: "https://git-scm.com/doc",
    course: "https://www.udemy.com/course/git-and-github-bootcamp/",
  },
  docker: {
    youtube: "https://www.youtube.com/watch?v=Gjnup-PuquQ",
    docs: "https://docs.docker.com/get-started/",
    course: "https://www.udemy.com/course/docker-mastery/",
  },
  aws: {
    youtube: "https://www.youtube.com/watch?v=ulprqHHWlng",
    docs: "https://docs.aws.amazon.com/index.html",
    course:
      "https://www.udemy.com/course/aws-certified-developer-associate-dva-c01/",
  },
};

function getBestResourcesForSkill(skill: string): ResourceLinks {
  const key = skill.toLowerCase().trim();
  const curated = RESOURCE_MAP[key];

  if (curated) {
    return curated;
  }

  // Fallback for skills we didn't map
  const encoded = encodeURIComponent(skill);

  return {
    youtube: `https://www.youtube.com/results?search_query=${encoded}+tutorial`,
    docs: `https://www.google.com/search?q=${encoded}+official+documentation`,
    course: `https://www.google.com/search?q=${encoded}+complete+course`,
  };
}

export default function UploadJDPage() {
  const [jdText, setJdText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [jdskills, setJDSkills] = useState<string[]>([]);

  async function handleAnalyze() {
    if (!jdText.trim()) {
      alert("Please paste a job description");
      return;
    }

    setIsLoading(true);

    const res = await fetch("/api/jd/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jdText }),
    });

    const data = await res.json();
    setJDSkills(data.skills || []);
    await fetch("/api/jd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jdText, skills: data.skills }),
    });
    if (typeof window !== "undefined") {
      sessionStorage.setItem("activeJDSession", "true");
    }
    setIsLoading(false);
  }

  return (
    <div>
      <h1>Upload Job Description</h1>

      <textarea
        placeholder="Paste job description here..."
        value={jdText}
        onChange={(e) => setJdText(e.target.value)}
        style={{ width: "90%", minHeight: "260px" }}
      />

      <br />

      <button type="button" onClick={handleAnalyze} disabled={isLoading}>
        {isLoading ? "Analyzing..." : "Analyze JD"}
      </button>
      {jdskills.length > 0 && (
        <h2 style={{ marginTop: "1.5rem" }}>Recommended learning resources</h2>
      )}

      <div style={{ marginTop: "0.75rem" }}>
        {jdskills.map((skill, index) => {
          const resources = getBestResourcesForSkill(skill);

          return (
            <div key={index} style={{ marginBottom: "0.75rem" }}>
              <h3>{skill}</h3>
              <a
                href={resources.youtube}
                target="_blank"
                rel="noopener noreferrer"
              >
                YouTube
              </a>
              {" | "}
              <a
                href={resources.docs}
                target="_blank"
                rel="noopener noreferrer"
              >
                Docs
              </a>
              {" | "}
              <a
                href={resources.course}
                target="_blank"
                rel="noopener noreferrer"
              >
                Courses
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
