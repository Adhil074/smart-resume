import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/mongodb";
import Resume from "../../../../../models/Resume";
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const {id} = await params;
  console.log("DELETE request id:", id);

  const deletedResume = await Resume.findByIdAndDelete(id);
  if (!deletedResume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }
  return NextResponse.json(
    { message: "Resume deleted successfully" },
    { status: 200 }
  );
}
