# Contributing to Todo App

Thank you for your interest in contributing to this project! 🎉

## 🚀 Quick Start

1. **Fork** the repository
2. **Clone** your fork locally
3. **Install** dependencies: `npm install`
4. **Set up** environment variables (see `.env.example`)
5. **Start** development server: `npm run dev`

## 📝 Development Process

### Before You Start

- Check existing [issues](https://github.com/your-username/todo-app/issues) and [pull requests](https://github.com/your-username/todo-app/pulls)
- Create an issue to discuss major changes
- Fork the repository and create a new branch

### Making Changes

1. **Create a branch** from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:

   - Follow existing code style
   - Add comments for complex logic
   - Keep commits small and focused
   - Write descriptive commit messages

3. **Test your changes**:

   - Ensure the app runs without errors
   - Test on different screen sizes
   - Verify authentication works
   - Check drag-and-drop functionality

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:

```
feat: add dark mode toggle to navbar
fix: resolve drag and drop position syncing
docs: update installation instructions
style: improve mobile responsiveness
```

### Pull Request Process

1. **Update documentation** if needed
2. **Test thoroughly** on different devices/browsers
3. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```
4. **Open a Pull Request** with:
   - Clear title and description
   - Screenshots/GIFs for UI changes
   - Reference any related issues
   - List of changes made

## 🐛 Bug Reports

When reporting bugs, please include:

- **Environment details** (OS, browser, Node.js version)
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Screenshots** if applicable
- **Console errors** (if any)

## 💡 Feature Requests

For new features:

- **Check existing issues** first
- **Describe the problem** you're trying to solve
- **Propose a solution** with examples
- **Consider alternatives** and their trade-offs

## 🎨 UI/UX Guidelines

- **Responsive design** - Test on mobile, tablet, and desktop
- **Accessibility** - Follow WCAG guidelines
- **Consistent styling** - Use existing Tailwind classes
- **Dark mode support** - Ensure features work in both themes
- **Performance** - Keep bundle size reasonable

## 🧪 Code Quality

- **ESLint** - Run `npm run lint` before committing
- **Clean code** - Use meaningful variable names
- **Error handling** - Add proper try-catch blocks
- **Comments** - Explain complex logic
- **Performance** - Avoid unnecessary re-renders

## 📁 Project Structure

```
app/
├── (views)/          # Route groups
├── api/              # API endpoints
├── components/       # Reusable components
└── globals.css       # Global styles

hooks/                # Custom React hooks
utils/                # Utility functions
middleware.js         # Next.js middleware
```

## 🤔 Need Help?

- **Documentation** - Check the main README.md
- **Issues** - Browse existing issues or create a new one
- **Discussions** - Use GitHub Discussions for questions
- **Code Review** - Ask for feedback in your PR

## 📋 Areas We Need Help With

- 🐛 **Bug fixes** - Check open issues
- 📱 **Mobile improvements** - Better touch interactions
- 🎨 **UI enhancements** - Animations and micro-interactions
- 📊 **Analytics features** - More detailed statistics
- 🔐 **Security** - Code review and improvements
- 📚 **Documentation** - Better examples and guides
- 🧪 **Testing** - Unit and integration tests
- ♿ **Accessibility** - WCAG compliance improvements

## ✅ Code Style

- Use **Tailwind CSS** for styling
- Follow **React best practices**
- Use **functional components** with hooks
- Keep components **small and focused**
- Use **TypeScript** where beneficial
- Follow **Next.js conventions**

## 🙏 Thank You!

Every contribution helps make this project better. Whether it's:

- 🐛 Fixing a bug
- 💡 Suggesting an idea
- 📚 Improving documentation
- 🎨 Enhancing the UI
- 🧪 Adding tests

Your efforts are appreciated! 🎉

---

**Happy contributing!** 🚀
