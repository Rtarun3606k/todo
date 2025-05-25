# 🔗 API Reference

Quick reference for all API endpoints in the Todo application.

## Authentication

### `POST /api/auth/callback`

Syncs user data after authentication.

**Headers:**

```
Content-Type: application/json
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "image": "profile_image_url"
  }
}
```

---

## Todos

### `GET /api/todos`

Fetches all todos for the authenticated user.

**Response:**

```json
{
  "success": true,
  "todos": [
    {
      "_id": "todo_id",
      "title": "Todo Title",
      "content": "Todo description",
      "completed": false,
      "priority": "medium",
      "category": "work",
      "color": "bg-blue-500",
      "position": 0,
      "dueDate": "2025-05-30T00:00:00.000Z",
      "createdAt": "2025-05-25T10:00:00.000Z",
      "updatedAt": "2025-05-25T10:00:00.000Z"
    }
  ]
}
```

### `POST /api/todos`

Creates a new todo.

**Body:**

```json
{
  "title": "New Todo",
  "content": "Todo description",
  "priority": "high",
  "category": "work",
  "color": "bg-red-500",
  "dueDate": "2025-05-30"
}
```

**Response:**

```json
{
  "success": true,
  "todo": {
    "_id": "new_todo_id",
    "title": "New Todo",
    "content": "Todo description",
    "completed": false,
    "priority": "high",
    "category": "work",
    "color": "bg-red-500",
    "position": 0,
    "sortId": 1,
    "dueDate": "2025-05-30T00:00:00.000Z",
    "userId": "user_id",
    "isActive": true,
    "syncStatus": "synced",
    "createdAt": "2025-05-25T10:00:00.000Z",
    "updatedAt": "2025-05-25T10:00:00.000Z"
  }
}
```

### `PUT /api/todos/[id]`

Updates an existing todo.

**Parameters:**

- `id` - Todo ID

**Body:**

```json
{
  "title": "Updated Todo",
  "content": "Updated description",
  "completed": true,
  "priority": "low",
  "category": "personal",
  "color": "bg-green-500",
  "dueDate": "2025-06-01"
}
```

**Response:**

```json
{
  "success": true,
  "todo": {
    "_id": "todo_id",
    "title": "Updated Todo",
    "completed": true
    // ... other fields
  }
}
```

### `DELETE /api/todos/[id]`

Deletes a todo (soft delete).

**Parameters:**

- `id` - Todo ID

**Response:**

```json
{
  "success": true,
  "message": "Todo deleted successfully"
}
```

### `PUT /api/todos/reorder`

Updates todo positions after drag-and-drop.

**Body:**

```json
{
  "todoIds": ["id1", "id2", "id3"]
}
```

**Response:**

```json
{
  "success": true,
  "todos": [
    // Updated todos with new positions
  ],
  "message": "Todos reordered successfully"
}
```

---

## User Management

### `GET /api/user/preferences`

Gets user preferences and profile data.

**Response:**

```json
{
  "success": true,
  "preferences": {
    "theme": "dark",
    "notifications": true,
    "emailDigest": false,
    "defaultPriority": "medium",
    "defaultColor": "bg-blue-500"
  },
  "profile": {
    "name": "User Name",
    "email": "user@example.com",
    "image": "profile_image_url",
    "provider": "google",
    "joinDate": "2025-05-25T10:00:00.000Z",
    "lastLogin": "2025-05-25T15:30:00.000Z"
  }
}
```

### `PUT /api/user/preferences`

Updates user preferences and profile.

**Body:**

```json
{
  "preferences": {
    "theme": "light",
    "notifications": false,
    "emailDigest": true,
    "defaultPriority": "high",
    "defaultColor": "bg-red-500"
  },
  "profile": {
    "name": "Updated Name"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "User preferences updated successfully",
  "preferences": {
    "theme": "light",
    "notifications": false,
    "emailDigest": true,
    "defaultPriority": "high",
    "defaultColor": "bg-red-500"
  },
  "profile": {
    "name": "Updated Name",
    "email": "user@example.com",
    "image": "profile_image_url"
  }
}
```

### `DELETE /api/user/preferences`

Deactivates user account (soft delete).

**Response:**

```json
{
  "success": true,
  "message": "Account deactivated successfully"
}
```

---

## Error Responses

All endpoints may return these error responses:

### Authentication Error

```json
{
  "error": "Unauthorized",
  "status": 401
}
```

### Validation Error

```json
{
  "error": "Validation error",
  "details": ["Title is required", "Invalid priority value"],
  "status": 400
}
```

### Not Found Error

```json
{
  "error": "User not found",
  "status": 404
}
```

### Server Error

```json
{
  "error": "Internal server error",
  "message": "Detailed error message",
  "status": 500
}
```

---

## Data Types

### Todo Object

```typescript
{
  _id: string;
  title: string;
  content?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  color: string; // Tailwind CSS class
  position: number;
  sortId: number;
  dueDate?: Date;
  tags?: string[];
  userId: string;
  isActive: boolean;
  lastModified: Date;
  syncStatus: 'synced' | 'pending' | 'error';
  createdAt: Date;
  updatedAt: Date;
}
```

### User Object

```typescript
{
  _id: string;
  name: string;
  email: string;
  image?: string;
  googleId: string;
  provider: string;
  providerId: string;
  emailVerified: boolean;
  todos: string[]; // Array of todo IDs
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    emailDigest: boolean;
    defaultPriority: 'low' | 'medium' | 'high';
    defaultColor: string;
  };
  isActive: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Constants

### Available Colors

```javascript
[
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
```

### Priority Levels

```javascript
["low", "medium", "high"];
```

### Theme Options

```javascript
["light", "dark", "system"];
```

---

## Usage Examples

### Creating a Todo with Fetch

```javascript
const createTodo = async (todoData) => {
  const response = await fetch("/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todoData),
  });

  if (!response.ok) {
    throw new Error("Failed to create todo");
  }

  return response.json();
};
```

### Updating User Preferences

```javascript
const updatePreferences = async (preferences) => {
  const response = await fetch("/api/user/preferences", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ preferences }),
  });

  return response.json();
};
```

### Reordering Todos

```javascript
const reorderTodos = async (todoIds) => {
  const response = await fetch("/api/todos/reorder", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ todoIds }),
  });

  return response.json();
};
```

---

For more detailed information, see [DOCUMENTATION.md](./DOCUMENTATION.md).
