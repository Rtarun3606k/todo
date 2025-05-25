# 📝 Modern Todo Application

A feature-rich, responsive todo application built with **Next.js 15**, **React**, and **MongoDB**. This project showcases modern web development practices including drag-and-drop functionality, real-time data synchronization, Google OAuth authentication, and a beautiful dark/light theme system.

## 🚀 Live Demo

[Add your deployed application URL here]

## ✨ Features

### Core Functionality

- ✅ **Complete CRUD Operations** - Create, read, update, and delete todos
- 🎯 **Drag & Drop Reordering** - Intuitive task organization with real-time position saving
- 🔐 **Google OAuth Authentication** - Secure sign-in with Google accounts
- 🌓 **Dark/Light Theme Toggle** - Beautiful UI with theme persistence
- 📱 **Fully Responsive Design** - Perfect experience on desktop, tablet, and mobile
- ⚡ **Real-time Data Sync** - Instant updates across all sessions

### Advanced Features

- 🎨 **Color-coded Tasks** - Customizable task colors for better organization
- 📊 **Priority Levels** - High, medium, and low priority categorization
- 📈 **Analytics Dashboard** - Comprehensive statistics and productivity insights
- 🏆 **Achievement System** - Gamified experience with progress tracking
- 🔍 **Search & Filter** - Advanced filtering by status, priority, and categories
- 📤 **Data Export/Import** - Backup and restore your data in JSON format
- ⚙️ **User Preferences** - Customizable settings and default configurations

### Technical Features

- 🔄 **Optimistic Updates** - Smooth UX with instant visual feedback
- 🛡️ **Protected Routes** - Middleware-based authentication
- 🗄️ **MongoDB Integration** - Robust data persistence with Mongoose
- 🎭 **Server-Side Rendering** - SEO-friendly with Next.js App Router
- 🚀 **Performance Optimized** - Fast loading and smooth interactions

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React features and hooks
- **Tailwind CSS** - Utility-first CSS framework
- **@dnd-kit** - Modern drag and drop library
- **React Icons** - Beautiful icon components
- **next-themes** - Theme switching system

### Backend & Database

- **Node.js** - Runtime environment
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **NextAuth.js v5** - Authentication library

### Development Tools

- **ESLint** - Code linting and formatting
- **Turbopack** - Fast bundler for development
- **PostCSS** - CSS processing

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 18 or higher)
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- **MongoDB** database (local or cloud)
- **Google OAuth credentials** (for authentication)

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/todo-app
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todo-app

# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Optional: Environment
NODE_ENV=development
```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/todo-app.git
cd todo-app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Set Up Environment Variables

- Copy the environment variables template above
- Create a `.env.local` file in the root directory
- Fill in your actual values (see [Environment Setup](#environment-setup) below)

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### 5. Open Your Browser

Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

## 🔧 Environment Setup

### MongoDB Setup

#### Option 1: Local MongoDB

1. Install MongoDB on your system
2. Start MongoDB service
3. Use: `MONGODB_URI=mongodb://localhost:27017/todo-app`

#### Option 2: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Use: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todo-app`

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Set **Application type** to **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy **Client ID** and **Client Secret** to your `.env.local`

### NextAuth Secret

Generate a secure secret for NextAuth.js:

```bash
openssl rand -base64 32
```

Or use: [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)

## 📁 Project Structure

```
todo-app/
├── app/                          # Next.js App Router
│   ├── (views)/                  # Route groups
│   │   ├── (user)/              # Protected user routes
│   │   │   ├── home/            # Main dashboard
│   │   │   ├── profile/         # User profile & settings
│   │   │   └── add-todo/        # Add new todo
│   │   └── auth/                # Authentication pages
│   ├── api/                     # API routes
│   │   ├── auth/                # NextAuth.js endpoints
│   │   ├── todos/               # Todo CRUD operations
│   │   └── user/                # User management
│   ├── components/              # Reusable React components
│   ├── globals.css              # Global styles
│   ├── layout.js                # Root layout
│   └── auth.js                  # NextAuth configuration
├── hooks/                       # Custom React hooks
├── utils/                       # Utility functions
│   ├── MongoDB.js               # Database connection
│   ├── Schema.js                # Mongoose schemas
│   └── syncManager.js           # Data synchronization
├── middleware.js                # Next.js middleware
└── public/                      # Static assets
```

## 🔗 API Endpoints

### Authentication

- `GET/POST /api/auth/*` - NextAuth.js endpoints
- `POST /api/auth/callback` - User sync after authentication

### Todos

- `GET /api/todos` - Fetch all user todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/[id]` - Update specific todo
- `DELETE /api/todos/[id]` - Delete specific todo
- `POST /api/todos/reorder` - Update todo positions

### User

- `GET /api/user` - Get user information
- `GET/PUT/DELETE /api/user/preferences` - Manage user preferences

## 🎨 Component Overview

### Core Components

- **TodoCard** - Individual todo item with drag/drop support
- **TodoModal** - Add/edit todo modal with form validation
- **TodoDashboard** - Analytics and statistics dashboard
- **Navbar** - Navigation with authentication and theme toggle
- **ThemeSwitcher** - Dark/light mode toggle component

### Layout Components

- **ClientOnly** - Hydration-safe component wrapper
- **SessionProvider** - NextAuth session context
- **SyncStatusIndicator** - Real-time sync status display

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed on any platform that supports Next.js:

- **Netlify**
- **Railway**
- **Heroku**
- **DigitalOcean App Platform**

### Build for Production

```bash
npm run build
npm start
```

## 🧪 Available Scripts

```bash
# Development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## 📋 Quick Reference

### Key Features

- ✅ Complete CRUD operations
- 🎯 Drag & drop reordering
- 🔐 Google OAuth authentication
- 🌓 Dark/light theme toggle
- 📱 Fully responsive design
- ⚡ Real-time data sync
- 🎨 Color-coded tasks
- 📊 Priority levels
- 🔍 Search & filter
- 📈 Analytics dashboard

### Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Node.js, MongoDB, Mongoose
- **Auth**: NextAuth.js v5 with Google OAuth
- **UI**: @dnd-kit, React Icons, next-themes

### Useful Commands

```bash
# Reset database (development)
mongosh todo-app --eval "db.dropDatabase()"

# Clear Next.js cache
rm -rf .next

# Reset node_modules
rm -rf node_modules package-lock.json && npm install

# Generate NextAuth secret
openssl rand -base64 32
```

## 📚 Documentation

- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Complete technical documentation
- **[API.md](./API.md)** - Complete API reference and endpoint documentation
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines and development process
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Quick deployment guide for various platforms
- **[CHANGELOG.md](./CHANGELOG.md)** - Project history and release notes

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](./CONTRIBUTING.md) for detailed information about the development process.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Follow our [development guidelines](./CONTRIBUTING.md)
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Vercel** - For hosting and deployment platform
- **MongoDB** - For the database solution
- **@dnd-kit** - For the drag and drop functionality
- **Tailwind CSS** - For the utility-first CSS framework
- **React Icons** - For the beautiful icon library

## 📞 Support

If you have any questions or run into issues, please:

1. Check the [Issues](https://github.com/your-username/todo-app/issues) page
2. Create a new issue if your problem isn't already listed
3. Provide as much detail as possible including:
   - Your operating system
   - Node.js version
   - Browser version
   - Steps to reproduce the issue

---

**Happy coding! 🎉**

Built with ❤️ by [Your Name]
