import Link from "next/link";

export default function WelcomePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Welcome to Smart Resume Builder</h1>
      <p>Choose an option to continue:</p>

      <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
        <Link href="/signup">
          <button>Sign up</button>
        </Link>

        <Link href="/login">
          <button>Sign in</button>
        </Link>
      </div>
    </main>
  );
}