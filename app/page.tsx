import Link from "next/link";

export default function WelcomePage() {
  return (
    <main className="p-6 sm:p-8 bg-gray-50 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl text-black font-bold">Welcome to Aurares.ai</h1>
      <p className="text-gray-600 mt-2 ">Choose an option to continue:</p>

      <div className="mt-5 flex gap-3" >
        <Link href="/signup">
          <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-base font-semibold shadow cursor-pointer">Sign up</button>
        </Link>

        <Link href="/login">
          <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-base font-semibold shadow cursor-pointer">Sign in</button>
        </Link>
      </div>
    </main>
  );
}