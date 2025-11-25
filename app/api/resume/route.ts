// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "../../../../lib/mongodb";
// import Resume from "../../../../models/Resume";

// export async function PUT(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const id = searchParams.get("id");

//   if (!id) {
//     return NextResponse.json(
//       { success: false, error: "Resume ID is required" },
//       { status: 400 }
//     );
//   }

//   try {
//     await connectDB();

//     const { editedText, extractedSkills } = await request.json();

//     const updateDoc = {
//       extractedText: editedText,
//       updatedAt: new Date(),
//     }as Record<string,unknown>;

//     // If client sends skills, update them. Otherwise keep existing.
//     if (Array.isArray(extractedSkills)) {
//       updateDoc.extractedSkills = extractedSkills;
//     }

//     const updatedResume = await Resume.findByIdAndUpdate(id, updateDoc, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedResume) {
//       return NextResponse.json(
//         { success: false, error: "Resume not found" },
//         { status: 404 }
//       );
//     }

//     console.log(" Resume updated:", {
//       id,
//       skills: updatedResume.extractedSkills,
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Resume updated successfully",
//       resume: updatedResume,
//     });
//   } catch (error) {
//     console.error(" Update error:", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to update resume" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import Resume from "../../../../models/Resume";

// GET /api/resume
// -> return all resumes, newest first
export async function GET() {
  try {
    await connectDB();

    const resumes = await Resume.find().sort({ uploadedAt: -1 });

    return NextResponse.json({ resumes }, { status: 200 });
  } catch (err) {
    console.error("GET /api/resume error:", err);
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}

// PUT /api/resume?id=...
// -> update extractedText + extractedSkills for one resume
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing resume id" }, { status: 400 });
    }

    const body = await request.json();
    const { editedText, extractedSkills } = body;

    const updated = await Resume.findByIdAndUpdate(
      id,
      {
        extractedText: editedText,
        extractedSkills: extractedSkills ?? [],
      },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json({ resume: updated }, { status: 200 });
  } catch (err) {
    console.error("PUT /api/resume error:", err);
    return NextResponse.json(
      { error: "Failed to update resume" },
      { status: 500 }
    );
  }
}
