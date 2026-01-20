//app\api\jd\latest\route.ts

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import JD from "@/models/JD";

export async function GET(req: Request) {
  await connectDB();

  const userId = new URL(req.url).searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ jd: null });
  }

  const jd = await JD.findOne({ userId });
  return NextResponse.json({ jd });
}
