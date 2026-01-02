import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";

export async function GET() {
  try {
    await connectDB();

    const latestResume = await Resume.findOne().sort({ createdAt: -1 });

    if (!latestResume) {
      return NextResponse.json({ resume: null }, { status: 200 });
    }

    return NextResponse.json({ resume: latestResume }, { status: 200 });
  } catch (error) {
    console.error("GET /api/resume/latest error:", error);
    return NextResponse.json(
      { error: "Failed to fetch latest resume" },
      { status: 500 }
    );
  }
}