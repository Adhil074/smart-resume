import mammoth from "mammoth";
import fs from "fs";

export async function extractTextFromFile(filePath: string): Promise<string> {
  try {
    if (filePath.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value || "";
    } else {
      throw new Error("Only DOCX files are supported.");
    }
  } catch (error) {
    console.error("Error extracting text:", error);
    return "";
  }
}