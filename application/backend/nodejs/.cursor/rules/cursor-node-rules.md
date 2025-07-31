# Node.js Code Style and Best Practices

This file defines the rules and best practices for writing Node.js code in this repository. All contributors (human or AI) should follow these guidelines.

## Formatting

- Follow ESLint and Prettier configurations for consistent code style.
- Use 2 spaces for indentation.
- Use semicolons at the end of statements.
- Use single quotes for strings unless double quotes are required.
- Use camelCase for variables and functions, PascalCase for classes.

## Design Principles

- **Single Responsibility Principle (SRP):** Each function/module should do one thing.
- **DRY (Don't Repeat Yourself):** Abstract repeated logic into utility functions or middleware.
- **KISS (Keep It Simple, Stupid):** Avoid over-engineering solutions.
- **YAGNI (You Aren't Gonna Need It):** Don't add features "just in case."

## Module Structure

- Use ES6 modules (`import`/`export`) instead of CommonJS (`require`/`module.exports`).
- Keep modules focused on a single responsibility.
- Export functions and classes, not objects with mixed responsibilities.
- Use default exports sparingly; prefer named exports for better tree-shaking.

## Error Handling

- Always handle errors explicitly with try-catch blocks.
- Use async/await for asynchronous operations.
- Return meaningful error messages to clients.
- Log errors appropriately for debugging.
- Use custom error classes for different error types.

## Testing & Tooling

- Unit tests: Use `jest` or `mocha` with `chai`.
- Linting: Use `eslint` with Node.js-specific rules.
- Formatting: Use `prettier`.
- Type checking: Use `TypeScript` or `JSDoc` for type annotations.

## Other Good Practices

- Use meaningful variable and function names.
- Avoid global variables and side effects.
- Use environment variables for configuration.
- Implement proper logging with structured logging libraries.
- Use middleware for cross-cutting concerns (authentication, validation, etc.).
- Handle process signals gracefully (SIGTERM, SIGINT).

## API Design

- Use RESTful conventions for API endpoints.
- Implement proper HTTP status codes.
- Use consistent response formats.
- Implement request validation with libraries like `joi` or `yup`.
- Use middleware for authentication and authorization.

## Database and Data

- Use connection pooling for database connections.
- Implement proper transaction handling.
- Sanitize and validate all input data.
- Use parameterized queries to prevent SQL injection.
- Handle database errors gracefully.

## Commenting

- Do not comment code where the purpose is clear from clean, idiomatic naming.
- Add comments when:
  1. The intent or "why" is not immediately obvious.
  2. There is a subtle detail or gotcha.
  3. A block of 3+ lines works together in a non-trivial way.
  4. A design decision is made (e.g., choosing performance over readability or vice versa).
  5. Avoid explaining the obvious or restating the function name in a comment.
  6. When comments are pasted in code, keep them in returned code with suggestions.
  7. When a new function or class is added, describe it in a single-sentence comment above it.

## File Organization

- Use kebab-case for file names.
- Group related functionality in directories.
- Keep index files for clean imports.
- Separate business logic from route handlers.
- Use a clear directory structure (routes, controllers, models, etc.).

## Additional Guidelines

- Initialize any variables that may be missing.
- Add imports for common libraries as needed (e.g., `lodash` for utilities).
- Use TypeScript interfaces for function parameters when possible.
- Implement proper cleanup in event listeners and timers.
- Use environment-specific configuration files. 