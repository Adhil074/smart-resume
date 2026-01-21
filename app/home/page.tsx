//app\home\page.tsx

"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // if not signed in, redirect to login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // while loading session, shows nothing
  if (status === "loading") return <div>Loading...</div>;

  const username = session?.user?.name || session?.user?.email || "User";

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* header  fixed at top */}
      <header className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-full px-6 py-4 flex items-center justify-between">
          {/* menu button left */}

          <button
            onClick={() => setIsSidebarOpen(true)}
            className="ml-2 text-2xl text-gray-700 bg-white rounded hover:bg-gray-50 shadow-sm border border-gray-200 cursor-pointer px-3 py-1 transition-all"
            aria-label="Open sidebar"
            style={{
              minWidth: "2.5rem",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            ⋮
          </button>

          {/* welcome  */}
          <h2 className="text-2xl font-semibold text-slate-900 absolute left-1/2 transform -translate-x-1/2">
            Welcome back, <span className="text-blue-600">{username}</span>
          </h2>

          {/* empty space for right alignment */}
          <div className="w-10"></div>
        </div>
      </header>

      {/* main content */}
      <main className="flex-1  bg-slate-900 mx-auto px-6 py-12 w-full flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold text-center w-full text-white mb-6">
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
            {/* upload resume*/}
            <Link
              href="/upload"
              onClick={() => {
                if (typeof window !== "undefined") {
                  sessionStorage.removeItem("activeResumeSession");
                  sessionStorage.removeItem("activeJDSession");
                }
              }}
              className="group p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-200"
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-2xl"></span>
                <span className="font-semibold text-slate-900 group-hover:text-blue-600">
                  Upload Resume
                </span>
              </div>
              <p className="text-sm text-center text-slate-600">
                Get instant ATS analysis
              </p>
            </Link>

            {/* create resume*/}
            <Link
              href="/create-resume"
              className="group p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-200"
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-2xl"></span>
                <span className="font-semibold text-slate-900 group-hover:text-blue-600">
                  Create Resume
                </span>
              </div>
              <p className="text-sm text-center text-slate-600">
                Build a new resume from scratch
              </p>
            </Link>

            {/* upload jd */}
            <Link
              href="/upload-jd"
              className="group p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-200"
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-2xl"></span>
                <span className="font-semibold text-slate-900 group-hover:text-blue-600">
                  Upload JD
                </span>
              </div>
              <p className="text-sm text-center text-slate-600">
                Get match score and resources
              </p>
            </Link>

            {/* previous resumes */}
            <Link
              href="/previous-resumes"
              className="group p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-200"
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-2xl"></span>
                <span className="font-semibold text-slate-900 group-hover:text-blue-600">
                  Previous Resumes
                </span>
              </div>
              <p className="text-sm text-center text-slate-600">
                View your saved resumes
              </p>
            </Link>

            {/* chatbot */}
            <Link
              href="/chatbot"
              className="group p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-200 md:col-span-2 md:max-w-md md:mx-auto md:w-full"
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-2xl"></span>
                <span className="font-semibold text-slate-900 group-hover:text-blue-600">
                  AI Chatbot
                </span>
              </div>
              <p className="text-sm text-center text-slate-600">
                Get instant career guidance
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
