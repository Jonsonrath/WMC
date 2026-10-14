# Repository Guidelines

## Project Structure & Module Organization

This repository is a small TypeScript/Express API. Application startup and route mounting live in `app.ts`; user and role endpoints are in `user.route.ts` and `role.route.ts`; their in-memory data and operations are in `user.service.ts` and `role.service.ts`. Database connection setup is in `db.ts`, and `docker-compose.yml` defines the MariaDB and phpMyAdmin services. There is currently no separate test or asset directory. Keep related route and service changes in their existing modules unless the project grows enough to justify a new folder.

## Build, Test, and Development Commands

- `npm start` runs `app.ts` with Node's watch mode for local development.
- `npm run lint` runs Oxlint against the project.
- `npm run lint:fix` applies supported Oxlint fixes; review its changes before committing.
- `npx tsc --noEmit` checks TypeScript types using `tsconfig.json`.
- `docker compose up -d` starts the configured database and phpMyAdmin services.

`npm test` is currently a placeholder that exits with an error; do not treat it as a test suite.

## Coding Style & Naming Conventions

Use TypeScript with the strict compiler settings in `tsconfig.json`. Follow the existing four-space indentation in service modules and two-space indentation in route modules, while keeping new or substantially edited files internally consistent. Use `PascalCase` for types and interfaces, `camelCase` for variables and functions, and descriptive `.route.ts` / `.service.ts` filenames. Preserve explicit `.ts` extensions on relative imports, as used by the current ESM configuration.

## Testing Guidelines

No test framework or test files are configured yet. For changes, run `npm run lint` and `npx tsc --noEmit`; manually exercise affected routes when practical. Add automated tests alongside a chosen test framework before introducing coverage requirements.

## Commit & Pull Request Guidelines

Recent commits use brief subjects, often a short project label or timestamp, and do not establish a stricter convention. Write a concise imperative subject describing the change (for example, `Add role lookup route`). Pull requests should summarize behavior changes, note relevant validation commands and results, and include request/response examples for API changes. Link related issues when available.

## Configuration & Data

The Compose file currently uses local development credentials and the database service name `db`. Keep secrets out of committed source and use environment configuration if credentials or deployment settings change. The current user and role services store data in memory, so changes are lost when the process restarts.
