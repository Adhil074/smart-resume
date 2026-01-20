// //app\api\resume\pdf\route.ts

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
  skills: string;
  education: string;
  experience: string;
  projects: string;
  certifications: string;
  template: "templateA" | "templateB";
};

export async function POST(req: NextRequest) {
  //auth
  const session = await getServerSession(authOptions);
  const section = (title: string, content?: string) => {
    if (!content || !content.trim()) return "";
    return `
    <h2>${title}</h2>
    <p>${content}</p>
  `;
  };

  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    //input
    const body = (await req.json()) as PdfPayload;
    if (!body.fullName || !body.email) {
      throw new Error("Invalid PDF payload: name or email missing");
    }

    //db
    await connectDB();

    //html by template
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

    //puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
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

    //saves to db
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

    //response
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
      { status: 500 },
    );
  }
}
