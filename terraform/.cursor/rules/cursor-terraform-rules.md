# Terraform Code Style and Best Practices

This file defines the rules and best practices for writing Terraform code for AWS serverless infrastructure in this repository. All contributors (human or AI) should follow these guidelines.

## Formatting

- Use `terraform fmt` to automatically format code.
- Use 2 spaces for indentation.
- Use consistent naming conventions: lowercase with hyphens for resources.
- Use descriptive variable and resource names.
- Limit line length to 80 characters where possible.

## Design Principles

- **Single Responsibility Principle (SRP):** Each module should manage one logical component.
- **DRY (Don't Repeat Yourself):** Use modules and variables to avoid code duplication.
- **KISS (Keep It Simple, Stupid):** Avoid over-engineering infrastructure.
- **YAGNI (You Aren't Gonna Need It):** Don't add resources "just in case."

## File Organization

- Use a clear directory structure: `main.tf`, `variables.tf`, `outputs.tf`, `providers.tf`.
- Separate environments into different directories or workspaces.
- Use modules for reusable components.
- Keep sensitive values in separate `.tfvars` files (not committed to version control).

## AWS Serverless Best Practices

- Use AWS provider with region specification.
- Implement proper IAM roles and policies with least privilege.
- Use data sources to reference existing AWS resources.
- Tag all resources consistently for cost tracking and management.
- Use lifecycle rules for resources that need special handling.

## State Management

- Use local state for development (suitable for solo work).
- Consider remote state (S3 + DynamoDB) for production.
- Use workspaces to separate environments.
- Backup state files regularly.
- Use `terraform plan` before every apply.

## Variables and Outputs

- Define all variables with descriptions and types.
- Use validation blocks for critical variables.
- Provide default values where appropriate.
- Use outputs to expose important resource information.
- Keep outputs focused and meaningful.

## Security and Compliance

- Never hardcode sensitive values in Terraform files.
- Use AWS Secrets Manager or Parameter Store for secrets.
- Implement proper encryption for data at rest and in transit.
- Use VPC and security groups appropriately.
- Follow AWS security best practices for serverless.

## Testing & Validation

- Use `terraform validate` to check syntax.
- Use `terraform plan` to preview changes.
- Test modules in isolation before integration.
- Use `terraform fmt` and `terraform validate` in CI/CD.

## Commenting

- Do not comment code where the purpose is clear from resource names and structure.
- Add comments when:
  1. The intent or "why" is not immediately obvious.
  2. There is a subtle detail or gotcha.
  3. A block of 3+ lines works together in a non-trivial way.
  4. A design decision is made (e.g., choosing performance over cost or vice versa).
  5. Avoid explaining the obvious or restating the resource name in a comment.
  6. When comments are pasted in code, keep them in returned code with suggestions.
  7. When a new module or resource is added, describe it in a single-sentence comment above it.

## Lambda-Specific Guidelines

- Use appropriate runtime and memory configurations.
- Implement proper environment variables.
- Use IAM roles with minimal required permissions.
- Consider using layers for shared code.
- Implement proper error handling and logging.

## Additional Guidelines

- Use data sources to reference existing resources.
- Implement proper dependency management.
- Use `depends_on` sparingly; let Terraform handle dependencies automatically.
- Use `count` or `for_each` for similar resources.
- Keep modules small and focused.
- Use consistent tagging strategy across all resources. 