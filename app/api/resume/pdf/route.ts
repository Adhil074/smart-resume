//app\api\resume\pdf\route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

export const runtime = "nodejs";
export const maxDuration = 60;

// pdfmake font init (REQUIRED)
pdfMake.vfs = pdfFonts.pdfMake.vfs;

type PdfPayload = {
  fullName: string;
  email: string;
  phone: string;
  summary: string;
  skills: string;
  education: string;
  experience: string;
  projects: string;
  certifications: string;
  template: "templateA" | "templateB";
};

type PdfContentBlock = {
  text: string;
  style: string;
  margin?: number[];
};

type PdfDocDefinition = {
  pageSize: "A4";
  pageMargins: number[];
  content: PdfContentBlock[];
  styles: Record<string, unknown>;
  defaultStyle: {
    font: string;
  };
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as PdfPayload;

    if (!body.fullName || !body.email) {
      return NextResponse.json(
        { error: "Invalid PDF payload" },
        { status: 400 },
      );
    }

    await connectDB();

    // const section = (title: string, content?: string) => {
    //   if (!content || !content.trim()) return [];
    //   return [
    //     { text: title, style: "sectionHeader" },
    //     { text: content, style: "sectionBody" },
    //   ];
    // };
    

    const section = (title: string, content?: string): PdfContentBlock[] => {
      if (!content || !content.trim()) return [];
      return [
        { text: title, style: "sectionHeader" },
        { text: content, style: "sectionBody" },
      ];
    };

    const docDefinition:PdfDocDefinition = {
      pageSize: "A4",
      pageMargins: [40, 40, 40, 40],

      content: [
        { text: body.fullName, style: "name" },
        {
          text: `${body.email}${body.phone ? " | " + body.phone : ""}`,
          style: "contact",
          margin: [0, 0, 0, 20],
        },

        ...section(
          body.template === "templateA"
            ? "Professional Summary"
            : "Career Objective",
          body.summary,
        ),
        ...section("Skills", body.skills),
        ...section("Education", body.education),
        ...section("Experience", body.experience),
        ...section("Projects", body.projects),
        ...section("Certifications", body.certifications),
      ],

      styles: {
        name: {
          fontSize: 20,
          bold: true,
          alignment: "center",
        },
        contact: {
          fontSize: 10,
          alignment: "center",
        },
        sectionHeader: {
          fontSize: 13,
          bold: true,
          margin: [0, 15, 0, 5],
        },
        sectionBody: {
          fontSize: 11,
          margin: [0, 0, 0, 5],
        },
      },
      defaultStyle: {
        font: "Helvetica",
      },
    };

    // pdfmake buffer generation (PROMISE SAFE)
    const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
      try {
        const pdfDoc = pdfMake.createPdf(docDefinition);
        pdfDoc.getBuffer((buffer: Uint8Array) => {
          resolve(Buffer.from(buffer));
        });
      } catch (err) {
        reject(err);
      }
    });

    if (!pdfBuffer.length) {
      throw new Error("Generated PDF is empty");
    }

    const safeName = body.fullName.replace(/\s+/g, "_").toLowerCase();
    const fileName = `${safeName}-${Date.now()}.pdf`;

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

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("PDF_GENERATION_ERROR:", error);
    return NextResponse.json(
      { error: "PDF generation failed" },
      { status: 500 },
    );
  }
}
