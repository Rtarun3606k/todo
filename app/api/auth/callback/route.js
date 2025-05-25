import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { User, connectDB } from "@/utils/Schema";

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const { user } = session;

    // Check if user exists in database
    let existingUser = await User.findOne({
      $or: [{ email: user.email }, { googleId: user.googleId }],
    });

    if (!existingUser) {
      // Create new user
      existingUser = await User.create({
        name: user.name,
        email: user.email,
        image: user.image,
        googleId: user.googleId,
        provider: user.provider || "google",
        providerId: user.providerId,
        emailVerified: user.emailVerified || false,
        givenName: user.givenName,
        familyName: user.familyName,
        lastLogin: new Date(),
      });

      console.log("New user created:", user.email);
    } else {
      // Update existing user's last login
      existingUser.lastLogin = new Date();
      await existingUser.save();

      console.log("Existing user logged in:", user.email);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: existingUser._id,
        email: existingUser.email,
        name: existingUser.name,
        image: existingUser.image,
      },
    });
  } catch (error) {
    console.error("Error in auth callback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
