import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are reuired" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registerd" },
        { status: 400 }
      );
    }
    await User.create({
      email,
      password,
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
