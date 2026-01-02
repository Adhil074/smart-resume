import mongoose from "mongoose";
const jdSchema = new mongoose.Schema({
  text: String,
  extractedSkills: { type: [String], default: [] },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const JD=mongoose.models.JD||mongoose.model("JD",jdSchema);
export default JD;
