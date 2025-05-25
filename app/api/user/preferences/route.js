import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { User, connectDB } from "@/utils/Schema";

// GET user preferences
export async function GET() {
  try {
    await connectDB();
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      preferences: user.preferences || {
        theme: "system",
        notifications: true,
        emailDigest: false,
        defaultPriority: "medium",
        defaultColor: "bg-blue-500",
      },
      profile: {
        name: user.name,
        email: user.email,
        image: user.image,
        provider: user.provider,
        joinDate: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch user preferences" },
      { status: 500 }
    );
  }
}

// PUT update user preferences
export async function PUT(request) {
  try {
    await connectDB();
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { preferences, profile } = body;

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update preferences if provided
    if (preferences) {
      // Validate preferences
      if (
        preferences.theme &&
        !["light", "dark", "system"].includes(preferences.theme)
      ) {
        return NextResponse.json(
          { error: "Invalid theme value" },
          { status: 400 }
        );
      }

      if (
        preferences.defaultPriority &&
        !["low", "medium", "high"].includes(preferences.defaultPriority)
      ) {
        return NextResponse.json(
          { error: "Invalid default priority value" },
          { status: 400 }
        );
      }

      user.preferences = {
        ...user.preferences,
        ...preferences,
      };
    }

    // Update profile if provided
    if (profile) {
      if (profile.name) {
        user.name = profile.name.trim();
      }
      // Note: email updates would require additional verification
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: "User preferences updated successfully",
      preferences: user.preferences,
      profile: {
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Error updating user preferences:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return NextResponse.json(
        { error: "Validation error", details: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update user preferences" },
      { status: 500 }
    );
  }
}

// DELETE user account (soft delete)
export async function DELETE() {
  try {
    await connectDB();
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Soft delete by setting isActive to false
    user.isActive = false;
    await user.save();

    // Also soft delete all user's todos
    await Todo.updateMany({ userId: user._id }, { isActive: false });

    return NextResponse.json({
      success: true,
      message: "Account deactivated successfully",
    });
  } catch (error) {
    console.error("Error deactivating user account:", error);
    return NextResponse.json(
      { error: "Failed to deactivate account" },
      { status: 500 }
    );
  }
}
