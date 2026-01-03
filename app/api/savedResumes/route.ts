// //app\api\savedResumes\route.ts

// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import Resume from "@/models/Resume";

// export async function GET() {
//   try {
//     await connectDB();
//     //ts-ignore
//     const docs = await Resume.find({}).sort({ uploadedAt: -1 });
//     return NextResponse.json({ resumes: docs }, { status: 200 });
//   } catch (err) {
//     console.error("GET /api/resume error:", err);
//     return NextResponse.json(
//       { error: "Failed to fetch resumes" },
//       { status: 500 }
//     );
//   }
// }


// app/api/savedResumes/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ resumes: [] }, { status: 200 });
    }

    await connectDB();

    const resumes = await Resume.find({
      userId: session.user.id,
    }).sort({ uploadedAt: -1 });

    return NextResponse.json({ resumes }, { status: 200 });
  } catch (error) {
    console.error("GET /api/savedResumes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}