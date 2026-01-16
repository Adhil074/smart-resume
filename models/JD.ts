//models\JD.ts

import mongoose, { Schema } from "mongoose";

const jdSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: true,
    },
    extractedSkills: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const JD = mongoose.models.JD || mongoose.model("JD", jdSchema);
export default JD;
