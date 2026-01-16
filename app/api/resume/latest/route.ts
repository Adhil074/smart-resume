// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import Resume from "@/models/Resume";

// export async function GET() {
//   try {
//     await connectDB();

//     const latestResume = await Resume.findOne().sort({ createdAt: -1 });

//     if (!latestResume) {
//       return NextResponse.json({ resume: null }, { status: 200 });
//     }

//     return NextResponse.json({ resume: latestResume }, { status: 200 });
//   } catch (error) {
//     console.error("GET /api/resume/latest error:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch latest resume" },
//       { status: 500 }
//     );
//   }
// }

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
    // .sort({ uploadedAt: -1 }) 
    .sort({ createdAt: -1 }) 
    .lean();

  return NextResponse.json({ resume });
}