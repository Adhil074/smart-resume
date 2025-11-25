import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import JD from "../../../../../models/JD";

export async function GET() {
  await connectDB();

  const jd = await JD.findOne().sort({ createdAt: -1 });

  return NextResponse.json({ jd });
}