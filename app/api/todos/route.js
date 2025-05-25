import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { Todo, User, connectDB } from "@/utils/Schema";

// GET all todos for authenticated user
export async function GET() {
  try {
    await connectDB();
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user first
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get todos sorted by position
    const todos = await Todo.getUserTodos(user._id);

    // Get sync statistics
    const syncStats = await Todo.aggregate([
      { $match: { userId: user._id, isActive: true } },
      {
        $group: {
          _id: "$syncStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      todos: todos,
      count: todos.length,
      syncStats: syncStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

// POST create new todo
export async function POST(request) {
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

    // Validate required fields
    if (!body.title && !body.name) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const title = body.title || body.name;
    if (title.trim() === "") {
      return NextResponse.json(
        { error: "Title cannot be empty" },
        { status: 400 }
      );
    }

    // Validate priority if provided
    if (body.priority && !["low", "medium", "high"].includes(body.priority)) {
      return NextResponse.json(
        { error: "Invalid priority value. Must be 'low', 'medium', or 'high'" },
        { status: 400 }
      );
    }

    // Validate color if provided
    const validColors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-red-500",
      "bg-purple-500",
      "bg-yellow-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-gray-500",
      "bg-orange-500",
      "bg-teal-500",
    ];
    if (body.color && !validColors.includes(body.color)) {
      return NextResponse.json(
        { error: "Invalid color value" },
        { status: 400 }
      );
    }

    // Get the next position
    const lastTodo = await Todo.findOne({
      userId: user._id,
      isActive: true,
    }).sort({ position: -1 });
    const nextPosition = lastTodo ? lastTodo.position + 1 : 0;

    // Get the next sortId
    const lastSortId = await Todo.findOne({ userId: user._id }).sort({
      sortId: -1,
    });
    const nextSortId = lastSortId ? lastSortId.sortId + 1 : 1;

    const todoData = {
      title: title.trim(),
      content: body.content ? body.content.trim() : "",
      userId: user._id,
      position: nextPosition,
      sortId: nextSortId,
      color: body.color || "bg-blue-500",
      priority: body.priority || "medium",
      category: body.category ? body.category.trim() : "general",
      completed: body.completed || false,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      tags: Array.isArray(body.tags)
        ? body.tags.filter((tag) => tag.trim())
        : [],
    };

    const todo = await Todo.create(todoData);

    // Add todo to user's todos array
    user.todos.push(todo._id);
    await user.save();

    return NextResponse.json(
      {
        success: true,
        todo: todo,
        message: "Todo created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating todo:", error);

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

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Duplicate todo detected" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create todo" },
      { status: 500 }
    );
  }
}
