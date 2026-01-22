import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { TDocumentDefinitions } from "pdfmake/interfaces";
import PdfPrinter from "pdfmake";

export const runtime = "nodejs";
export const maxDuration = 60;

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
  margin?: [number, number, number, number];
};



const fonts = {
  Helvetica: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
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
        { status: 400 }
      );
    }

    await connectDB();

    const section = (title: string, content?: string): PdfContentBlock[] => {
      if (!content || !content.trim()) return [];
      return [
        { text: title, style: "sectionHeader" },
        { text: content, style: "sectionBody" },
      ];
    };

    const docDefinition: TDocumentDefinitions= {
      pageSize: "A4",
      pageMargins: [40, 40, 40, 40],

      content: [
        { text: body.fullName, style: "name" },
        {
          text: `${body.email}${body.phone ? ` | ${body.phone}` : ""}`,
          style: "contact",
          margin: [0, 0, 0, 20],
        },

        ...section(
          body.template === "templateA"
            ? "Professional Summary"
            : "Career Objective",
          body.summary
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

    const printer = new PdfPrinter(fonts);
    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    const chunks: Uint8Array[] = [];

    const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
      pdfDoc.on("data", (chunk) => chunks.push(chunk));
      pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
      pdfDoc.on("error", reject);
      pdfDoc.end();
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
      { status: 500 }
    );
  }
}