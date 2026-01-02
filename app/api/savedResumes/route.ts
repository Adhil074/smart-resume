import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
export async function GET() {
  try {
    await connectDB();
    //ts-ignore
    const docs = await Resume.find({}).sort({ uploadedAt: -1 });
    return NextResponse.json({ resumes: docs }, { status: 200 });
  } catch (err) {
    console.error("GET /api/resume error:", err);
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}
