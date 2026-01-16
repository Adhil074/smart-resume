//app\api\upload\route.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";

export async function POST(req: NextRequest) {
  try {
    /* ---------- AUTH ---------- */
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.sub || !token.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* ---------- FORM DATA ---------- */
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File required" }, { status: 400 });
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF or DOCX allowed" },
        { status: 400 }
      );
    }

    /* ---------- FILE BUFFER (THIS WAS MISSING) ---------- */
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    /* ---------- DB ---------- */
    await connectDB();

    const resume = await Resume.create({
      userId: token.sub,
      name: token.email.split("@")[0],
      email: token.email,
      fileName: file.name,
      fileData: fileBuffer,
      mimeType: file.type,  
      extractedText: "",
      extractedSkills: [],
    });

    return NextResponse.json({
      success: true,
      resumeId: resume._id.toString(),
    });
  } catch (err) {
    console.error("UPLOAD_ERROR", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

