import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { renderToBuffer } from "@react-pdf/renderer";
import { ResumeDocument } from "@/lib/pdf/ResumeDocument";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";


type PdfPayload = {
  fullName: string;
  email: string;
  phone?: string;
  summary?: string;
  skills?: string;
  education?: string;
  experience?: string;
  projects?: string;
  certifications?: string;
  template: "templateA" | "templateB";
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id || !session.user.email) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const body = req.body as PdfPayload;

    if (!body.fullName || !body.email) {
      res.status(400).json({ error: "Invalid payload" });
      return;
    }

    await connectDB();

    const pdfBuffer = await renderToBuffer(
      ResumeDocument(body),
    );

    const fileName =
      body.fullName.replace(/\s+/g, "_").toLowerCase() +
      "-" +
      Date.now() +
      ".pdf";

    await Resume.create({
      userId: session.user.id,
      name: body.fullName,
      email: body.email,
      fileName,
      mimeType: "application/pdf",
      fileData: pdfBuffer,
      extractedText: "",
      extractedSkills: [],
      uploadedAt: new Date(),
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}"`,
    );
    res.status(200).send(pdfBuffer);
  } catch (err) {
    console.error("PDF_GENERATION_ERROR:", err);
    res.status(500).json({ error: "PDF generation failed" });
  }
}


