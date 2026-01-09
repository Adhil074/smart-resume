//app\api\jd\route.ts

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import JD from "@/models/JD";

export async function GET() {
  try {
    await connectDB();
    const jds = await JD.find().sort({ createdAt: -1 });
    return NextResponse.json({ jds });
  } catch {
    return NextResponse.json({ error: "Failed to fetch JDs" }, { status: 500 });
  }
}

// export async function POST(req: Request) {
//   try {
//     await connectDB();
//     const { jdText, skills } = await req.json();

//     if (!jdText) {
//       return NextResponse.json({ error: "Missing JD text" }, { status: 400 });
//     }
//     //delete all old jds
//     await JD.deleteMany({});
//     const newJD = new JD({
//       text: jdText,
//       extractedSkills: skills || [],
//     });

//     await newJD.save();

//     return NextResponse.json({ success: true });
//   } catch {
//     return NextResponse.json({ error: "Failed to save JD" }, { status: 500 });
//   }
// }

export async function POST(req: Request) {
  try {
    await connectDB();

    const { jdText, skills, userId } = await req.json();

    if (!jdText || !userId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    await JD.findOneAndUpdate(
      { userId },                      // 👈 only ONE JD per user
      {
        text: jdText,
        extractedSkills: skills || [],
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save JD" }, { status: 500 });
  }
}
