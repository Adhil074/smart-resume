import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs"; // IMPORTANT for Vercel

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

    const section = (title: string, content?: string): string => {
      if (!content || !content.trim()) return "";
      return `
        <h2>${title}</h2>
        <p>${content}</p>
      `;
    };

    let html = "";

    if (body.template === "templateA") {
      html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
  body {
    font-family: Georgia, "Times New Roman", serif;
    padding: 40px;
    color: #000;
  }
  .header {
    text-align: center;
    margin-bottom: 20px;
  }
  h1 {
    font-size: 22px;
    margin-bottom: 4px;
  }
  .contact {
    font-size: 12px;
  }
  h2 {
    font-size: 14px;
    margin-top: 20px;
    border-bottom: 1px solid #000;
    padding-bottom: 4px;
    text-transform: uppercase;
  }
  p {
    font-size: 12px;
    margin: 6px 0;
    white-space: pre-line;
  }
</style>
</head>
<body>

<div class="header">
  <h1>${body.fullName}</h1>
  <div class="contact">${body.email}${body.phone ? ` | ${body.phone}` : ""}</div>
</div>

${section("Professional Summary", body.summary)}
${section("Skills", body.skills)}
${section("Education", body.education)}
${section("Experience", body.experience)}
${section("Projects", body.projects)}
${section("Certifications", body.certifications)}

</body>
</html>
`;
    } else {
      html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
  body {
    font-family: Arial, Helvetica, sans-serif;
    padding: 40px;
    color: #1f2937;
  }
  h1 {
    font-size: 20px;
    color: #1d4ed8;
    margin-bottom: 2px;
  }
  .location {
    font-size: 12px;
    margin-bottom: 10px;
  }
  .divider {
    border-bottom: 2px solid #1d4ed8;
    margin: 10px 0 20px;
  }
  h2 {
    font-size: 13px;
    color: #1d4ed8;
    margin-top: 16px;
  }
  p {
    font-size: 12px;
    margin: 4px 0;
    white-space: pre-line;
  }
</style>
</head>
<body>

<h1>${body.fullName}</h1>
<div class="location">${body.email}${body.phone ? ` | ${body.phone}` : ""}</div>
<div class="divider"></div>

${section("Career Objective", body.summary)}
${section("Skills", body.skills)}
${section("Education", body.education)}
${section("Experience", body.experience)}
${section("Projects", body.projects)}
${section("Certifications", body.certifications)}

</body>
</html>
`;
    }

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
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

    if (!pdfBuffer || pdfBuffer.length === 0) {
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
      fileData: Buffer.from(pdfBuffer),
      extractedText: "",
      extractedSkills: [],
      uploadedAt: new Date(),
    });

    return new NextResponse(Buffer.from(pdfBuffer), {
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