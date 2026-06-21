# Hueflow contributor guide

## Commands

- Install: `npm install`
- Development: `npm run dev`
- Client only: `npm run dev:client`
- Server only: `npm run dev:server`
- Build: `npm run build`
- Lint: `npm run lint`
- Type-check: `npm run typecheck`
- Unit/API tests: `npm test`
- End-to-end tests: `npm run test:e2e`

## Conventions

- Keep TypeScript strict and avoid `any`.
- Put reusable colour maths, schemas, and serialisable domain types in `shared`.
- Keep API calls in `client/src/api`; do not scatter `fetch` calls through components.
- Keep authoritative ownership checks in the server and derive owners from `request.user`.
- Validate request data with Zod and select explicit update fields.
- Keep the Express app importable without starting an HTTP listener.
- Use semantic HTML, visible focus styles, labelled controls, live feedback, and keyboard-operable interactions.
- Preserve the compact editorial tool aesthetic: radii at 8px or less, purposeful gradients, no decorative glass blobs.

## Verification expectations

Before handing off a change, run type-checking, lint, focused tests, and a production build. For visual work, inspect Studio, Explore, Accessibility, Projects, and authentication at desktop and mobile sizes. Do not claim MongoDB-backed workflows pass unless the API tests or a local database verify them.
