"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (!res || res.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/home");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 sm:p-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-black">
        Sign In
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow w-full max-w-sm space-y-5"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full px-4 py-2 border border-gray-500 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />

        <br />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-5-9-5a17.67 17.67 0 014.288-4.768m4.036-2.11A5.003 5.003 0 0117 15h.01M16 12c0-2.485-2.014-4.5-4.5-4.5S7 9.515 7 12c0 .641.129 1.248.364 1.797M21 21l-6-6"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.163.512-.37 1.014-.62 1.497"
                />
              </svg>
            )}
          </button>
        </div>

        <br />

        {error && (
          <p className="text-red-600 bg-red-50 border border-red-200 rounded p-2 text-center font-medium">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold shadow cursor-pointer transition-colors duration-200"
        >
          Sign In
        </button>

        <br />

        <Link
          href="/signup"
          className="block text-center text-indigo-600 hover:text-indigo-800 underline underline-offset-2 font-medium transition-colors duration-200"
        >
          Go to Sign Up
        </Link>
      </form>
    </div>
  );
}
