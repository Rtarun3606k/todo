import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { Todo, User, connectDB } from "@/utils/Schema";

export async function PUT(request) {
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

    const { todoIds } = await request.json();

    if (!Array.isArray(todoIds)) {
      return NextResponse.json(
        { error: "todoIds must be an array" },
        { status: 400 }
      );
    }

    // Reorder todos
    const updatedTodos = await Todo.reorderTodos(user._id, todoIds);

    return NextResponse.json({
      success: true,
      todos: updatedTodos,
      message: "Todos reordered successfully",
    });
  } catch (error) {
    console.error("Error reordering todos:", error);
    return NextResponse.json(
      { error: "Failed to reorder todos" },
      { status: 500 }
    );
  }
}
