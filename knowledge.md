# Baserow SDK

## Project Overview

- TypeScript SDK for interacting with Baserow API
- Provides type-safe access to Baserow database operations
- Uses code generation to create strongly-typed models from Baserow tables

## Key Concepts

- Row: Base class for all table row models
- Factory: Creates and manages row instances
- BaserowSdk: Core client for making API requests

## Code Style

- Validate numeric IDs with Number.isFinite()
- Keep error messages concise and descriptive
- Use TypeScript generics for type safety

## Architecture

- /src/codegen/: Code generation utilities
  - codegen.ts: Handles table imports and overall code generation orchestration
  - Individual utilities handle specific generation tasks (types, getters, etc)
- /src/: Core SDK implementation
- Factory pattern for managing row instances
- Repository pattern for data access

## Testing

- Use Vitest for unit tests
- Mock HTTP requests in tests
- Test error cases and edge cases
- Verify tests fail before fixing bugs
- Test file location matters:
  - codegen.ts handles table imports and circular dependencies
  - Individual codegen utilities handle specific generation tasks

## Common Tasks

- Adding a new table model: Use code generation utilities
- Adding API endpoints: Extend BaserowSdk class
- Adding field types: Update getRawType.ts

## Known Issues

- None currently tracked
