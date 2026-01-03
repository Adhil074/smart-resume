//app\api\resume\route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";

// GET /api/resume
// -> return all resumes, newest first
export async function GET() {
  try {
    await connectDB();

    const resumes = await Resume.find().sort({ uploadedAt: -1 });

    return NextResponse.json({ resumes }, { status: 200 });
  } catch (err) {
    console.error("GET /api/resume error:", err);
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}

// PUT /api/resume?id=...
// -> update extractedText + extractedSkills for one resume
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing resume id" }, { status: 400 });
    }

    const body = await request.json();
    const { editedText, extractedSkills } = body;

    const updated = await Resume.findByIdAndUpdate(
      id,
      {
        extractedText: editedText,
        extractedSkills: extractedSkills ?? [],
      },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json({ resume: updated }, { status: 200 });
  } catch (err) {
    console.error("PUT /api/resume error:", err);
    return NextResponse.json(
      { error: "Failed to update resume" },
      { status: 500 }
    );
  }
}
