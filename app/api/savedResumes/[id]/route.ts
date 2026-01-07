// app/api/savedResumes/[id]/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";

export async function GET(
  _request: Request,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id: resumeId } = await context.params;

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: session.user.id,
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json({ resume }, { status: 200 });
  } catch (error) {
    console.error("GET /api/savedResumes/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const { id: resumeId } = await context.params;

  const deletedResume = await Resume.findOneAndDelete({
    _id: resumeId,
    userId: session.user.id,
  });

  if (!deletedResume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  return NextResponse.json(
    { message: "Resume deleted successfully" },
    { status: 200 }
  );
}
