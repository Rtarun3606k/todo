import mongoose from "mongoose";

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

// Updated Todo Schema with position and sync fields
const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
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
    // New fields for drag-and-drop and syncing
    position: {
      type: Number,
      required: true,
      default: 0,
    },
    sortId: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      enum: [
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
      ],
      default: "bg-blue-500",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
    syncStatus: {
      type: String,
      enum: ["synced", "pending", "error"],
      default: "synced",
    },
  },
  {
    timestamps: true,
  }
);

// User Schema (keeping existing)
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

// Indexes for better performance
if (typeof window === "undefined" && !process.env.NEXT_RUNTIME) {
  // User indexes
  userSchema.index({ email: 1 });
  userSchema.index({ googleId: 1 });
  userSchema.index({ provider: 1, providerId: 1 });

  // Todo indexes
  todoSchema.index({ userId: 1 });
  todoSchema.index({ completed: 1 });
  todoSchema.index({ dueDate: 1 });
  todoSchema.index({ position: 1 });
  todoSchema.index({ userId: 1, position: 1 });
  todoSchema.index({ userId: 1, isActive: 1 });
}

// Static methods for User
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

// Static methods for Todo
todoSchema.statics.reorderTodos = async function (userId, todoIds) {
  const updatePromises = todoIds.map((todoId, index) =>
    this.findByIdAndUpdate(
      todoId,
      {
        position: index,
        lastModified: new Date(),
        syncStatus: "synced",
      },
      { new: true }
    )
  );

  return Promise.all(updatePromises);
};

todoSchema.statics.getUserTodos = async function (userId) {
  return this.find({
    userId,
    isActive: true,
  }).sort({ position: 1 });
};

// Bulk update multiple todos
todoSchema.statics.bulkUpdateTodos = async function (userId, updates) {
  const operations = updates.map((update) => ({
    updateOne: {
      filter: { _id: update._id, userId },
      update: {
        ...update.data,
        lastModified: new Date(),
        syncStatus: "synced",
      },
    },
  }));

  return this.bulkWrite(operations);
};

// Find todos with pending sync
todoSchema.statics.getPendingSyncTodos = async function (userId) {
  return this.find({
    userId,
    isActive: true,
    syncStatus: "pending",
  });
};

// Mark todos as pending sync
todoSchema.statics.markPendingSync = async function (todoIds) {
  return this.updateMany(
    { _id: { $in: todoIds } },
    {
      syncStatus: "pending",
      lastModified: new Date(),
    }
  );
};

// Instance methods for Todo
todoSchema.methods.updatePosition = async function (newPosition) {
  this.position = newPosition;
  this.lastModified = new Date();
  this.syncStatus = "synced";
  return this.save();
};

todoSchema.methods.markSynced = async function () {
  this.syncStatus = "synced";
  this.lastModified = new Date();
  return this.save();
};

todoSchema.methods.markPending = async function () {
  this.syncStatus = "pending";
  this.lastModified = new Date();
  return this.save();
};

// Pre-save middleware to auto-generate sortId
todoSchema.pre("save", function (next) {
  if (this.isNew && !this.sortId) {
    this.sortId = Date.now();
  }
  next();
});

// Pre-save middleware to update lastModified
todoSchema.pre("save", function (next) {
  if (!this.isNew) {
    this.lastModified = new Date();
  }
  next();
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema);

export { User, Todo, connectDB };
export default User;
