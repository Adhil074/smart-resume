//app\api\resume\latest\route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ resume: null });
  }

  await connectDB();

  const resume = await Resume.findOne({
    userId: session.user.id,
  })

    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ resume });
}
