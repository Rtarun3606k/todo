import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { Todo, User, connectDB } from "@/utils/Schema";

// GET single todo
export async function GET(request, { params }) {
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

    const todo = await Todo.findOne({
      _id: params.id,
      userId: user._id,
      isActive: true,
    });

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      todo: todo,
    });
  } catch (error) {
    console.error("Error fetching todo:", error);
    return NextResponse.json(
      { error: "Failed to fetch todo" },
      { status: 500 }
    );
  }
}

// PUT update todo
export async function PUT(request, { params }) {
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

    const body = await request.json();

    // Validate required fields if updating title
    if (body.title !== undefined && (!body.title || body.title.trim() === "")) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Validate priority if provided
    if (body.priority && !["low", "medium", "high"].includes(body.priority)) {
      return NextResponse.json(
        { error: "Invalid priority value" },
        { status: 400 }
      );
    }

    const todo = await Todo.findOneAndUpdate(
      { _id: params.id, userId: user._id, isActive: true },
      {
        ...body,
        lastModified: new Date(),
        syncStatus: "synced",
      },
      { new: true, runValidators: true }
    );

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      todo: todo,
      message: "Todo updated successfully",
    });
  } catch (error) {
    console.error("Error updating todo:", error);

    // Handle validation errors
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
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

// DELETE todo
export async function DELETE(request, { params }) {
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
    const todo = await Todo.findOneAndUpdate(
      { _id: params.id, userId: user._id, isActive: true },
      {
        isActive: false,
        lastModified: new Date(),
        syncStatus: "synced",
      },
      { new: true }
    );

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    // Remove from user's todos array
    user.todos = user.todos.filter((todoId) => todoId.toString() !== params.id);
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}
