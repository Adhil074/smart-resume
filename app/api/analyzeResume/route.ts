import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { findSkillsInText } from "../../../../lib/parseSkills";

const MONGODB_URI = process.env.MONGODB_URI || "";

export async function POST(req: NextRequest) {
  try {
    const { resumeId } = await req.json();

    if (!resumeId) {
      return NextResponse.json(
        { error: "resumeId is required" },
        { status: 400 }
      );
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db("resume_app_user");
    const collection = db.collection("resumes");

    const resume = await collection.findOne({
      _id: new ObjectId(resumeId),
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const extractedText = resume.extractedText || "";

    // Use AI-powered extraction (with fallback)
    const skills = await findSkillsInText(extractedText);

    // Save skills to MongoDB
    await collection.updateOne(
      { _id: new ObjectId(resumeId) },
      { $set: { extractedSkills: skills } } // Changed from "skills" to "extractedSkills"
    );

    await client.close();

    return NextResponse.json({ 
      success: true,
      skills: skills 
    });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}
