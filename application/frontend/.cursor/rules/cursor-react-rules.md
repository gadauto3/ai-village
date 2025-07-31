# React Code Style and Best Practices

This file defines the rules and best practices for writing React code in this repository. All contributors (human or AI) should follow these guidelines.

## Formatting

- Follow ESLint and Prettier configurations for consistent code style.
- Use 2 spaces for indentation.
- Use semicolons at the end of statements.
- Use single quotes for strings unless double quotes are required.
- Use camelCase for variables and functions, PascalCase for components.

## Design Principles

- **Single Responsibility Principle (SRP):** Each component should do one thing.
- **DRY (Don't Repeat Yourself):** Abstract repeated logic into custom hooks or utility functions.
- **KISS (Keep It Simple, Stupid):** Avoid over-engineering components.
- **YAGNI (You Aren't Gonna Need It):** Don't add features "just in case."

## Component Structure

- Use functional components with hooks instead of class components.
- Keep components small and focused on a single responsibility.
- Extract reusable logic into custom hooks.
- Use prop destructuring for cleaner component signatures.
- Prefer composition over inheritance.

## State Management

- Use React hooks (`useState`, `useEffect`, `useContext`) for local state.
- Keep state as close to where it's used as possible.
- Avoid prop drilling by using Context API when appropriate.
- Use `useCallback` and `useMemo` for performance optimization when needed.

## Testing & Tooling

- Unit tests: Use `jest` and `@testing-library/react`.
- Linting: Use `eslint` with React-specific rules.
- Formatting: Use `prettier`.
- Type checking: Use `TypeScript` or `PropTypes`.

## Other Good Practices

- Use meaningful component and variable names.
- Avoid inline styles; use CSS modules or styled-components.
- Handle loading and error states gracefully.
- Use proper accessibility attributes (aria-labels, roles, etc.).
- Avoid side effects in render functions.
- Use React.memo() for performance optimization when appropriate.

## Commenting

- Do not comment code where the purpose is clear from clean, idiomatic naming.
- Add comments when:
  1. The intent or "why" is not immediately obvious.
  2. There is a subtle detail or gotcha.
  3. A block of 3+ lines works together in a non-trivial way.
  4. A design decision is made (e.g., choosing performance over readability or vice versa).
  5. Avoid explaining the obvious or restating the function name in a comment.
  6. When comments are pasted in code, keep them in returned code with suggestions.
  7. When a new component or hook is added, describe it in a single-sentence comment above it.

## File Organization

- Use PascalCase for component file names.
- Group related components in the same directory.
- Keep index files for clean imports.
- Separate business logic from UI components.

## Additional Guidelines

- Initialize any variables that may be missing.
- Add imports for common libraries as needed (e.g., `lodash` for utilities).
- Use TypeScript interfaces for prop definitions when possible.
- Handle component lifecycle properly with useEffect cleanup functions. 