"use client";

type ResourceLinks = {
  youtube: string;
  docs: string;
  course: string;
};

const RESOURCE_MAP: Record<string, ResourceLinks> = {
  react: {
    youtube: "https://www.youtube.com/watch?v=RVFAyFWO4go",
    docs: "https://react.dev/learn",
    course: "https://www.freecodecamp.org/learn/front-end-development-libraries/react/",
  },
  "node.js": {
    youtube: "https://www.youtube.com/watch?v=TlB_eWDSMt4",
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

  if (curated) return curated;

  const encoded = encodeURIComponent(skill);
  return {
    youtube: `https://www.youtube.com/results?search_query=${encoded}+tutorial`,
    docs: `https://www.google.com/search?q=${encoded}+official+documentation`,
    course: `https://www.google.com/search?q=${encoded}+course`,
  };
}

export default function LearningResources({
  skills,
}: {
  skills: string[];
}) {
  if (!skills.length) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Learning resources</h2>

      {skills.map((skill) => {
        const links = getBestResourcesForSkill(skill);

        return (
          <div
            key={skill}
            className="bg-white rounded-lg p-4 mb-4 flex justify-between items-center"
          >
            <span className="font-mediu text-black">{skill}</span>

            <div className="flex gap-2">
              <a
                href={links.youtube}
                target="_blank"
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                YouTube
              </a>
              <a
                href={links.docs}
                target="_blank"
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Docs
              </a>
              <a
                href={links.course}
                target="_blank"
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                Courses
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}