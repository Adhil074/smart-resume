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

          {/* welcome text center */}
          <h2 className="text-2xl font-semibold text-slate-900 absolute left-1/2 transform -translate-x-1/2">
            Welcome back, <span className="text-blue-600">{username}</span>
          </h2>

          {/* empty space for right alignment */}
          <div className="w-10"></div>
        </div>
      </header>

      {/* main content */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 w-full">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* upload resume */}
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
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl"></span>
                <span className="font-semibold text-slate-900 group-hover:text-blue-600">
                  Upload Resume
                </span>
              </div>
              <p className="text-sm text-slate-600">
                Upload your existing resume
              </p>
            </Link>

            {/* create new resume */}
            <Link
              href="/create-resume"
              className="group p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl"></span>
                <span className="font-semibold text-slate-900 group-hover:text-blue-600">
                  Create Resume
                </span>
              </div>
              <p className="text-sm text-slate-600">
                Build a new resume from scratch
              </p>
            </Link>

            {/* upload jd */}
            <Link
              href="/upload-jd"
              className="group p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl"></span>
                <span className="font-semibold text-slate-900 group-hover:text-blue-600">
                  Upload JD
                </span>
              </div>
              <p className="text-sm text-slate-600">Upload a job description</p>
            </Link>

            {/* previous resumes */}
            <Link
              href="/previous-resumes"
              className="group p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl"></span>
                <span className="font-semibold text-slate-900 group-hover:text-blue-600">
                  Previous Resumes
                </span>
              </div>
              <p className="text-sm text-slate-600">View your saved resumes</p>
            </Link>

            {/* ai chatbot */}
            <Link
              href="/chatbot"
              className="group p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl"></span>
                <span className="font-semibold text-slate-900 group-hover:text-blue-600">
                  AI Chatbot
                </span>
              </div>
              <p className="text-sm text-slate-600">
                Chat with our AI assistant
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
