import mongoose from "mongoose";

// Connection function
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return mongoose.connections[0];
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
    console.log("MongoDB connected");
    return connection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    provider: {
      type: String,
      enum: ["google", "github", "credentials"],
      default: "google",
    },
    providerId: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    givenName: {
      type: String,
      trim: true,
    },
    familyName: {
      type: String,
      trim: true,
    },
    todos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Todo",
      },
    ],
    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
      notifications: {
        type: Boolean,
        default: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Todo Schema
const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [String],
    category: {
      type: String,
      default: "general",
    },
  },
  {
    timestamps: true,
  }
);

// Only add indexes if not in middleware or edge runtime context
const isMiddlewareContext = () => {
  // Check if we're in middleware or edge runtime
  return (
    process.env.NEXT_RUNTIME === "edge" ||
    process.env.NEXT_RUNTIME === "middleware" ||
    typeof EdgeRuntime !== "undefined" ||
    // Additional check for middleware context
    (typeof global !== "undefined" && global.__NEXT_MIDDLEWARE_LOADED)
  );
};

if (!isMiddlewareContext()) {
  // User indexes
  userSchema.index({ email: 1 });
  userSchema.index({ googleId: 1 });
  userSchema.index({ provider: 1, providerId: 1 });

  // Todo indexes
  todoSchema.index({ userId: 1 });
  todoSchema.index({ completed: 1 });
  todoSchema.index({ dueDate: 1 });
}

// Static method to find or create user
userSchema.statics.findOrCreate = async function (userData) {
  let user = await this.findOne({
    $or: [{ email: userData.email }, { googleId: userData.googleId }],
  });

  if (!user) {
    user = await this.create(userData);
  } else {
    Object.assign(user, userData);
    user.lastLogin = new Date();
    await user.save();
  }

  return user;
};

// Create models only if they don't exist
const User = mongoose.models.User || mongoose.model("User", userSchema);
const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema);

export { User, Todo, connectDB };
export default User;
