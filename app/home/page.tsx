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

  // If not signed in, redirect to login (simple protection)
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // While loading session, show nothing (or a simple message)
  if (status === "loading") return <div>Loading...</div>;

  const username = session?.user?.name || session?.user?.email || "User";

  //

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Header - Fixed at Top */}
      <header className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-full px-6 py-4 flex items-center justify-between">
          {/* Menu Button - Left */}
          
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

          {/* Welcome Text - Center */}
          <h2 className="text-2xl font-semibold text-slate-900 absolute left-1/2 transform -translate-x-1/2">
            Welcome, <span className="text-blue-600">{username}</span>
          </h2>

          {/* Empty space for right alignment */}
          <div className="w-10"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 w-full">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Upload Resume */}
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

            {/* Create New Resume */}
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

            {/* Upload JD */}
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

            {/* Previous Resumes */}
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

            {/* AI Chatbot */}
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
