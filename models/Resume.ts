import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    fileName: String,
    filePath: String,
    extractedText: { type: String, default: "" },
    extractedSkills: { type: [String], default: [] },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Resume = mongoose.models.Resume || mongoose.model("Resume", resumeSchema);
export default Resume;
