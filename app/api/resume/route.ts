// app/api/resume/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";

//GET /api/resume
// returns resumes for the logged-in user only

export async function GET(): Promise<NextResponse> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const resumes = await Resume.find({
    userId: session.user.id,
  })
    .sort({ uploadedAt: -1 })
    .lean();

  return NextResponse.json({ resumes }, { status: 200 });
}

//PUT /api/resume?id=...
//updates extractedText + extractedSkills

interface UpdateResumeBody {
  editedText: string;
  extractedSkills: string[];
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing resume id" }, { status: 400 });
  }

  const body = (await request.json()) as UpdateResumeBody;

  const updated = await Resume.findOneAndUpdate(
    {
      _id: id,
      userId: session.user.id,
    },
    {
      extractedText: body.editedText,
      extractedSkills: body.extractedSkills,
    },
    { new: true },
  ).lean();

  if (!updated) {
    return NextResponse.json(
      { error: "Resume not found or access denied" },
      { status: 404 },
    );
  }

  return NextResponse.json({ resume: updated }, { status: 200 });
}
