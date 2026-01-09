// //models\JD.ts

// import mongoose from "mongoose";
// const jdSchema = new mongoose.Schema({
//   text: String,
//   extractedSkills: { type: [String], default: [] },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });
// const JD=mongoose.models.JD||mongoose.model("JD",jdSchema);
// export default JD;

import mongoose, { Schema, Types } from "mongoose";

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