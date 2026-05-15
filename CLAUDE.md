# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- Install dependencies: `pnpm install`
- Start development server: `pnpm run dev`
- Build for production: `pnpm run build`
- Start production server: `pnpm start`
- Lint code: `pnpm run lint`
- Format code: `pnpm run format`

Note: There is no test script configured; testing is done manually.

## Project Architecture

- **Framework**: Next.js 16 (App Router) with TypeScript
- **UI**: Tailwind CSS v4, shadcn/ui components
- **State Management**: Zustand (used in hooks like `use-workspace-groups`, `use-image-picker`)
- **Data Persistence**: Local storage via helpers in `src/helpers/persistence.ts` and `src/helpers/data-processing.ts`
- **Export Functionality**: Exports JSON or ZIP (with images) for use in Unity client

### Directory Structure

- `src/app/`: Next.js app directory
  - `src/app/workspaces/[workspace-name]/`: Each game (collector) has its own folder with:
    - `page.tsx`: Main page for the workspace, orchestrates state and uses shared components
    - `components/`: Workspace-specific components
    - `types.ts`: TypeScript types for the workspace (if needed)
  - `src/app/layout.tsx`: Root layout
  - `src/app/globals.css`: Global styles
  - `src/app/page.tsx`: Home page (likely workspace selector)
- `src/components/shared`: Reusable components across workspaces (e.g., `WorkspaceShell`, `FileActions`, `ImagePicker`, `WorkspaceHeader`)
- `src/hooks`: Custom React hooks (e.g., `use-image-picker`, `use-workspace-groups`, `use-workspace-header`)
- `src/helpers`: Utility functions for data processing, persistence, validation, etc.
- `src/lib`: Utility libraries (e.g., image cropping, general utils)
- `src/types`: Shared TypeScript types
- `public/`: Static assets (favicon, etc.)
- `.next/`: Next.js build output (ignored in git)

### Key Conventions

- Each workspace is a lightweight `page.tsx` that delegates UI to shared components.
- Components are designed to be generic and receive data via props.
- Entity IDs are generated with `nanoid()` (imported from `nanoid` package, though not shown in deps, likely via another).
- State is managed via Zustand hooks or React state in the workspace page.
- Export actions are handled by `FileActions` component, which triggers JSON/ZIP generation and download.
- Image handling uses `use-image-picker` hook which manages ObjectURLs and cleanup.

### Common Tasks

- Adding a new workspace: Create a folder under `src/app/workspaces/[name]`, add a `page.tsx` that uses `WorkspaceShell` and `FileActions`, and implement workspace-specific components in a `components` subfolder.
- Adding a shared component: Place in `src/components/shared` and ensure it's generic and reusable.
- Modifying validation: Refer to Roadmap.md for planned validation engine; currently validation is ad-hoc.

## Guidelines

- Follow the existing code style (ESLint with Next.js and TypeScript config).
- Keep workspace pages focused on orchestration; move UI to shared components.
- Use TypeScript strictly; avoid `any` types.
- When adding new dependencies, run `pnpm install` and commit updated lockfile.
- For image-related features, be mindful of ObjectURL leaks; use `skipCleanupOnUnmount` when necessary as noted in Roadmap.md.
