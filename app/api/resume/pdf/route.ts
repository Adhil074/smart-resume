
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import puppeteer from "puppeteer";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type PdfPayload = {
  fullName: string;
  email: string;
  phone: string;
  summary: string;
  jobTitle: string;
  company: string;
  years: string;
  skills: string;
};

export async function POST(req: NextRequest) {
  /* ---------- AUTH ---------- */
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    /* ---------- INPUT ---------- */
    const body = (await req.json()) as PdfPayload;

    /* ---------- DB ---------- */
    await connectDB();

    /* ---------- PUPPETEER ---------- */
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body {
              font-family: Arial, Helvetica, sans-serif;
              padding: 40px;
              color: #000;
            }
            h1 { font-size: 22px; margin-bottom: 6px; }
            h2 { font-size: 14px; margin-top: 20px; text-transform: uppercase; }
            p  { font-size: 12px; margin: 4px 0; }
          </style>
        </head>
        <body>
          <h1>${body.fullName}</h1>
          <p>${body.email} | ${body.phone}</p>

          <h2>Summary</h2>
          <p>${body.summary}</p>

          <h2>Experience</h2>
          <p>${body.jobTitle} | ${body.company} (${body.years})</p>

          <h2>Skills</h2>
          <p>${body.skills}</p>
        </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfUint8 = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        bottom: "20mm",
        left: "20mm",
        right: "20mm",
      },
    });

    await browser.close();

    const pdfBuffer = Buffer.from(pdfUint8);

    const safeName = body.fullName.replace(/\s+/g, "_").toLowerCase();
    const fileName = `${safeName}-${Date.now()}.pdf`;

    /* ---------- SAVE TO MONGO ---------- */
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

    /* ---------- RESPONSE ---------- */
    return new NextResponse(pdfBuffer, {
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