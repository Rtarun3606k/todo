import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { User, connectDB } from "@/utils/Schema";

export async function POST(request) {
  try {
    // Connect to database
    await connectDB();

    // Get authenticated session
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      email: session.user.email,
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists", user: existingUser },
        { status: 200 }
      );
    }

    // Create new user
    const userData = {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      googleId: session.user.googleId,
      provider: session.user.provider || "google",
      providerId: session.user.providerId,
      emailVerified: session.user.emailVerified || false,
      givenName: session.user.givenName,
      familyName: session.user.familyName,
    };

    const user = await User.create(userData);

    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in user creation:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
