

import mongoose, { Schema, Types } from "mongoose";

export interface ResumeDocument {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  email: string;
  fileName: string;
  mimeType: string;
  fileData: Buffer;
  extractedText: string;
  extractedSkills: string[];
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<ResumeDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    fileData: {
      type: Buffer,
      required: true,
    },
    extractedText: {
      type: String,
      default: "",
    },
    extractedSkills: {
      type: [String],
      default: [],
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Resume =
  mongoose.models.Resume || mongoose.model("Resume", resumeSchema);

export default Resume;