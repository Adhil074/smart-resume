import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";

export async function GET(
  _req: Request,
  context:{params:Promise<{id:string}>}
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const {id:resumeId}=await context.params;
  const resume = await Resume.findOne({
    _id: resumeId,
    userId: session.user.id,
  });

  if (!resume || !resume.fileData) {
    return NextResponse.json({ error: "PDF not found" }, { status: 404 });
  }

  return new NextResponse(resume.fileData, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${resume.fileName}"`,
    },
  });
}