"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If not signed in, redirect to login (simple protection)
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // While loading session, show nothing (or a simple message)
  if (status === "loading") return <div>Loading...</div>;

  const username = session?.user?.name || session?.user?.email || "User";

  return (
    <div>
      <header>
        <div>
          {/* 3-dots menu placeholder */}
          <span>[⋮]</span>
        </div>

        <div>
          <h2>Welcome, {username}</h2>
        </div>
      </header>

      <main>
        <h3>Actions</h3>

        <ul>
          <li>
            <Link
              href="/upload"
              onClick={() => {
                if (typeof window !== "undefined") {
                  sessionStorage.removeItem("activeResumeSession");
                  sessionStorage.removeItem("activeJDSession");
                }
              }}
            >
              Upload Resume
            </Link>
          </li>

          <li>
            <Link href="/create-resume">Create New Resume</Link>
          </li>

          <li>
            <Link href="/upload-jd">Upload JD</Link>
          </li>

          <li>
            <Link href="/previous-resumes">Previous Resumes</Link>
          </li>

          <li>
            <Link href="/chatbot">AI Chatbot</Link>
          </li>
        </ul>
      </main>
    </div>
  );
}
