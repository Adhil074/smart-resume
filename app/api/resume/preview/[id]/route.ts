//app\api\resume\preview\[id]\route.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import mongoose from "mongoose";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  req: NextRequest,
  context: RouteContext
) {
  try {
    /* ---------- AUTH ---------- */
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.sub) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    /* ---------- PARAMS ---------- */
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new NextResponse("Invalid resume id", { status: 400 });
    }

    /* ---------- DB ---------- */
    await connectDB();

    const resume = await Resume.findOne({
      _id: id,
      userId: token.sub,
    }).select("fileData mimeType");

    if (!resume || !resume.fileData) {
      return new NextResponse("Resume not found", { status: 404 });
    }

    /* ---------- RESPONSE ---------- */
    const headers = new Headers();
    headers.set("Content-Type", resume.mimeType);
    headers.set("Content-Disposition", "inline");

    return new NextResponse(resume.fileData, { headers });
  } catch (error) {
    console.error("PREVIEW_ERROR", error);
    return new NextResponse("Failed to load preview", { status: 500 });
  }
}