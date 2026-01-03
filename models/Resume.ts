// import mongoose, { Schema } from "mongoose";

// const resumeSchema = new Schema(
//   {
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       index: true,
//     },
//     name: String,
//     email: String,
//     fileName: String,
//     filePath: String,
//     extractedText: { type: String, default: "" },
//     extractedSkills: { type: [String], default: [] },
//     uploadedAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Resume || mongoose.model("Resume", resumeSchema);

// models/Resume.ts

import mongoose, { Schema, Types } from "mongoose";

export interface ResumeDocument {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  email: string;
  fileName: string;
  filePath: string;
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
    filePath: {
      type: String,
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

const Resume = mongoose.models.Resume || mongoose.model("Resume", resumeSchema);

export default Resume;
