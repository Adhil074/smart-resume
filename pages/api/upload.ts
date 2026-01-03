//smart-resume\pages\api\upload.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm } from "formidable";
import type { Fields, Files } from "formidable";
import type { File } from "formidable";
import fs from "fs";
import path from "path";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { extractTextFromFile } from "@/lib/extractText";
import { analyzeATSScore } from "@/lib/atsAnalyzer";
import { findSkillsInText } from "@/lib/parseSkills";


console.log("MONGODB_URI exists?", !!process.env.MONGODB_URI);
console.log(
  "MONGODB_URI first 20 chars:",
  process.env.MONGODB_URI?.substring(0, 20)
);

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(
  req: NextApiRequest
): Promise<{ fields: Fields; files: Files }> {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = new IncomingForm({
    uploadDir: uploadDir,
    keepExtensions: true,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { files } = await parseForm(req);

    // Don't need name/email - only file upload for now
    const fileArray = files.resume;
    const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;

    if (!file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    const f = file as File & { filepath?: string; path?: string };
    const filePath = f.filepath ?? f.path ?? "";
    if (!filePath) {
      return res
        .status(400)
        .json({ success: false, error: "File path missing" });
    }

    // Extract text from file
    const extractedText = await extractTextFromFile(filePath);
    console.log("Extracted text sample:", extractedText.substring(0, 200));

    const extractedSkills = await findSkillsInText(extractedText);
    console.log("Found skills:", extractedSkills);

    // Calculate ATS Score
    // const foundSkills = ["JavaScript", "React", "MongoDB"];
    // const allSkills = ["JavaScript", "React", "MongoDB", "Python", "AWS"];
    const atsScore = analyzeATSScore(
      extractedText,
      extractedSkills,
      extractedSkills
    );
    console.log("ATS Score:", atsScore.overallScore);

    // Save to MongoDB
    const newResume = new Resume({
      fileName: file.originalFilename || file.newFilename,
      filePath: `/uploads/${file.newFilename}`,
      extractedText,
      extractedSkills,
      atsScore: atsScore,
    });

    const savedResume = await newResume.save();

    // Return everything to frontend
    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      _id: savedResume._id,
      extractedText: extractedText,
      atsScore: atsScore,
      extractedSkills:extractedSkills,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      error: "Upload failed",
    });
  }
}
