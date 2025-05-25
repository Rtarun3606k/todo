# 📖 Todo App Documentation

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Setup Guide](#setup-guide)
- [API Documentation](#api-documentation)
- [Component Documentation](#component-documentation)
- [Database Schema](#database-schema)
- [Deployment Guide](#deployment-guide)
- [Troubleshooting](#troubleshooting)

## Overview

This is a modern, full-stack todo application built with Next.js 15, featuring real-time synchronization, drag-and-drop functionality, and a comprehensive user management system.

### Key Technologies

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Node.js with Next.js API routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js v5 with Google OAuth
- **UI/UX**: Responsive design with dark/light theme support
- **Drag & Drop**: @dnd-kit library for intuitive task reordering

## Features

### ✅ Completed Features

- Complete CRUD operations for todos
- Drag-and-drop task reordering with position persistence
- Google OAuth authentication
- Dark/light theme toggle with persistence
- Responsive design (mobile, tablet, desktop)
- Real-time data synchronization
- Color-coded task organization
- Priority levels (high, medium, low)
- Category-based task organization
- Due date management with overdue detection
- Search and filter functionality
- User profile management with statistics
- Achievement system and progress tracking
- Data export/import capabilities
- Optimistic UI updates
- Protected routes with middleware
- Error handling and loading states

### 🚧 Planned Features

- Collaborative todo lists
- Push notifications
- Offline support with sync
- Task templates
- Calendar integration
- File attachments
- Advanced analytics
- Team workspaces

## Architecture

### Project Structure

```
todo-app/
├── app/                     # Next.js App Router
│   ├── (views)/            # Route groups
│   │   ├── (user)/        # Protected user routes
│   │   └── auth/          # Authentication pages
│   ├── api/               # API endpoints
│   ├── components/        # React components
│   └── globals.css        # Global styles
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
├── middleware.js          # Route protection
└── public/               # Static assets
```

### Data Flow

1. **Authentication**: NextAuth.js handles Google OAuth
2. **State Management**: React hooks with optimistic updates
3. **API Layer**: Next.js API routes with MongoDB
4. **Real-time Sync**: Custom sync manager for data consistency
5. **UI Updates**: Immediate feedback with error recovery

## Setup Guide

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Google Cloud Console account
- Git

### Installation Steps

1. **Clone Repository**

   ```bash
   git clone <repository-url>
   cd todo-app
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

4. **Database Setup**

   - Local: Start MongoDB service
   - Cloud: Create MongoDB Atlas cluster

5. **Google OAuth Setup**

   - Create Google Cloud Console project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs

6. **Start Development Server**
   ```bash
   npm run dev
   ```

### Environment Variables

| Variable               | Description                          | Required |
| ---------------------- | ------------------------------------ | -------- |
| `MONGODB_URI`          | MongoDB connection string            | Yes      |
| `NEXTAUTH_URL`         | Application base URL                 | Yes      |
| `NEXTAUTH_SECRET`      | NextAuth.js secret key               | Yes      |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID               | Yes      |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret           | Yes      |
| `NODE_ENV`             | Environment (development/production) | No       |

## API Documentation

### Authentication Endpoints

#### `POST /api/auth/callback`

Syncs user data after authentication.

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

### Todo Endpoints

#### `GET /api/todos`

Fetches all todos for authenticated user.

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

#### `POST /api/todos`

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

#### `PUT /api/todos/[id]`

Updates an existing todo.

#### `DELETE /api/todos/[id]`

Deletes a todo.

#### `PUT /api/todos/reorder`

Updates todo positions after drag-and-drop.

**Body:**

```json
{
  "todoIds": ["id1", "id2", "id3"]
}
```

### User Endpoints

#### `GET /api/user/preferences`

Gets user preferences and profile data.

#### `PUT /api/user/preferences`

Updates user preferences.

**Body:**

```json
{
  "preferences": {
    "theme": "dark",
    "notifications": true,
    "defaultPriority": "medium"
  },
  "profile": {
    "name": "Updated Name"
  }
}
```

## Component Documentation

### Core Components

#### `TodoCard`

Individual todo item with drag-and-drop support.

**Props:**

- `id`: Todo ID
- `name`: Todo title
- `content`: Todo description
- `color`: Background color class
- `priority`: Priority level
- `completed`: Completion status
- `onUpdate`: Update callback
- `onDelete`: Delete callback
- `onEdit`: Edit callback

#### `TodoModal`

Modal for creating/editing todos.

**Props:**

- `isOpen`: Modal visibility
- `onClose`: Close callback
- `onSave`: Save callback
- `todo`: Todo data (for editing)
- `loading`: Loading state

#### `TodoDashboard`

Analytics and statistics dashboard.

**Props:**

- `todos`: Array of todos
- `onRefresh`: Refresh callback
- `onAddTodo`: Add todo callback
- `loading`: Loading state
- `error`: Error message

### Utility Components

#### `ClientOnly`

Prevents hydration mismatches for client-side features.

#### `SyncStatusIndicator`

Shows real-time sync status.

#### `ThemesSwitching`

Dark/light theme toggle component.

## Database Schema

### User Schema

```javascript
{
  name: String,              // User's display name
  email: String,             // Email (unique)
  image: String,             // Profile image URL
  googleId: String,          // Google OAuth ID
  provider: String,          // Auth provider
  todos: [ObjectId],         // Reference to user's todos
  preferences: {
    theme: String,           // 'light' | 'dark' | 'system'
    notifications: Boolean,  // Email notifications
    defaultPriority: String, // Default priority for new todos
    defaultColor: String     // Default color for new todos
  },
  isActive: Boolean,         // Soft delete flag
  lastLogin: Date,           // Last login timestamp
  createdAt: Date,          // Account creation date
  updatedAt: Date           // Last update date
}
```

### Todo Schema

```javascript
{
  title: String,            // Todo title (required)
  content: String,          // Todo description
  completed: Boolean,       // Completion status
  priority: String,         // 'low' | 'medium' | 'high'
  category: String,         // Category name
  color: String,           // Background color class
  position: Number,        // Position for ordering
  sortId: Number,          // Unique sort identifier
  dueDate: Date,           // Due date
  tags: [String],          // Array of tags
  userId: ObjectId,        // Reference to user
  isActive: Boolean,       // Soft delete flag
  lastModified: Date,      // Last modification date
  syncStatus: String,      // 'synced' | 'pending' | 'error'
  createdAt: Date,         // Creation date
  updatedAt: Date          // Last update date
}
```

## Deployment Guide

### Vercel Deployment (Recommended)

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

3. **Environment Variables in Vercel**
   - Add all variables from `.env.example`
   - Update `NEXTAUTH_URL` to your domain
   - Add production Google OAuth redirect URI

### Other Platforms

#### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway init
railway up
```

#### Netlify

```bash
# Build command
npm run build

# Publish directory
.next
```

### Database Considerations

#### MongoDB Atlas (Production)

- Use connection string with authentication
- Enable IP whitelist (0.0.0.0/0 for dynamic IPs)
- Set up database user with appropriate permissions
- Consider using MongoDB Atlas Search for advanced queries

#### Local MongoDB (Development)

- Ensure MongoDB service is running
- Use local connection string
- Consider MongoDB Compass for database management

## Troubleshooting

### Common Issues

#### Authentication Problems

**Issue**: "Error: Configuration invalid" during sign in

**Solutions:**

1. Verify Google OAuth credentials
2. Check authorized redirect URIs
3. Ensure `NEXTAUTH_SECRET` is set
4. Verify `NEXTAUTH_URL` matches your domain

#### Database Connection Issues

**Issue**: "MongooseError: buffering timed out"

**Solutions:**

1. Check MongoDB connection string
2. Verify MongoDB service is running
3. Check network connectivity
4. Verify IP whitelist in MongoDB Atlas

#### Drag and Drop Not Working

**Issue**: Items not reordering properly

**Solutions:**

1. Check if JavaScript is enabled
2. Verify touch device compatibility
3. Clear browser cache
4. Check for console errors

#### Theme Not Persisting

**Issue**: Theme resets on page reload

**Solutions:**

1. Check if localStorage is available
2. Verify `next-themes` configuration
3. Clear browser data
4. Check for hydration errors

### Performance Issues

#### Slow Loading

**Optimizations:**

1. Implement lazy loading for images
2. Use React.memo for expensive components
3. Optimize database queries
4. Enable Next.js image optimization

#### Memory Leaks

**Prevention:**

1. Clean up event listeners
2. Cancel pending requests on unmount
3. Use AbortController for fetch requests
4. Avoid creating functions in render

### Development Tips

#### Hot Reload Issues

```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

#### Database Reset

```bash
# Connect to MongoDB and drop database
mongosh
use todo-app
db.dropDatabase()
```

#### Dependency Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed contribution guidelines.

## Support

- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check this file and README.md
- **Email**: [Add your contact email]

---

**Last Updated**: May 25, 2025
**Version**: 1.0.0
