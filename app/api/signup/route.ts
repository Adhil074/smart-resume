//smart-resume\app\api\signup\route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
//signup endpoint
//now lets write post function
//This line tells Next.js: “When someone sends a POST request to /api/signup, run this function.

export async function POST(request: Request) {
    try{
  const { username, email, password } = await request.json();
  await connectDB();
  if (!username || !email || !password) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 400 }
    );
  }
  const hashedPassword=await bcrypt.hash(password,10);
  const newUser=await User.create({
    name: username,
    email,
    password:hashedPassword,
  });
  return NextResponse.json({ success: true, userId: newUser._id }, { status: 201 });
}

catch{
    return NextResponse.json(
        {error:"Signup failed"},
        {status:500}
    );
}
}

