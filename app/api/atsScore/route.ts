import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { analyzeATSScore } from "../../../../lib/atsAnalyzer";
import { SKILLS_LIST } from "../../../../lib/skills";

const MONGODB_URI = process.env.MONGODB_URI!;

export async function POST(req: NextRequest) {
  try {
    const { resumeId } = await req.json();

    if (!resumeId) {
      return NextResponse.json(
        { error: "Resume ID is required" },
        { status: 400 }
      );
    }

    const client = new MongoClient(MONGODB_URI);
    const db = client.db("resume_app_user");
    const collection = db.collection("resumes");

    const resume = await collection.findOne({
      _id: new ObjectId(resumeId),
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const extractedText = resume.extractedText || "";
    const foundSkills = resume.skills || [];

    // Get ATS Score
    const atsScore = analyzeATSScore(extractedText, foundSkills, SKILLS_LIST);

    // Save to MongoDB
    await collection.updateOne(
      { _id: new ObjectId(resumeId) },
      { $set: { atsScore } }
    );

    await client.close();

    return NextResponse.json({
      success: true,
      resumeId,
      atsScore,
    });
  } catch (error) {
    console.error("Error analyzing ATS score:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
