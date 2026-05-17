# Contributing to InfiQ

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone <your-fork>`
3. Create a branch: `git checkout -b feature/amazing-feature`
4. Install dependencies: `npm install`
5. Start development: `npm run dev`

## Development Workflow

### Before Making Changes

1. Create an issue describing the feature/bug
2. Discuss approach with maintainers
3. Wait for approval before implementation

### While Developing

1. Follow the existing code style
2. Write meaningful commit messages
3. Add comments for complex logic
4. Test your changes locally

### Before Submitting PR

1. Ensure code compiles: `npm run build`
2. Run type checking: `npm run type-check`
3. Test the feature manually
4. Update documentation if needed

## Code Style

### TypeScript
- Use strict type checking
- Avoid `any` types
- Export types from files
- Use descriptive names

### React Components
- Use functional components with hooks
- Extract custom hooks for reusable logic
- Memoize expensive operations
- Add prop types/interfaces

### File Organization
```
feature/
├── Component.tsx
├── Component.module.css
├── Component.test.tsx
└── hooks/
    └── useFeature.ts
```

## Commit Messages

Follow conventional commits:
```
feat: add new feature
fix: resolve issue
docs: update documentation
refactor: restructure code
test: add tests
chore: maintenance
```

## Pull Request Process

1. Update main branch: `git fetch origin && git rebase origin/main`
2. Push changes: `git push origin feature/amazing-feature`
3. Create PR on GitHub
4. Fill out PR template
5. Wait for review
6. Address feedback
7. Merge when approved

## Testing

```bash
# Run tests
npm test

# Generate coverage
npm run test:coverage
```

## Documentation

- Keep README up to date
- Document new features
- Add API examples
- Update type definitions

## Reporting Issues

### Bug Reports
Include:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment info

### Feature Requests
Include:
- Description of feature
- Use cases
- Expected behavior
- Possible implementation

## Questions?

Open a discussion or reach out to maintainers.

---

Thank you for contributing! 🎉
