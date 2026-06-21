# Hueflow

Hueflow is an accessible brand colour and gradient design studio for designers and frontend developers. It brings gradient creation, palette generation, contrast testing, realistic interface previews, project organisation, public sharing, and developer-ready exports into one focused workflow.

> Create colour systems that work everywhere.

## Screenshots

Screenshots can be captured from the running application at:

- `/studio` — live gradient editor and interface previews
- `/accessibility` — contrast workbench and palette matrix
- `/explore` — curated preset gallery
- `/projects` — authenticated project workspace

## Main workflows

- Build linear, radial, conic, or layered mesh gradients with two to six colour stops.
- Lock, reorder, rename, and randomise colours; generate harmonies and tonal scales.
- Preview the system on a website hero, mobile app, social post, poster, component set, or plain canvas.
- Audit WCAG contrast, sample text contrast across a gradient, and simulate colour-vision deficiencies.
- Export CSS gradients, CSS variables, Tailwind configuration, JSON tokens, SCSS, SVG, and PNG.
- Save browser drafts without authentication.
- Register with secure cookie-based authentication, create projects, save gradients, and share public read-only links.
- Search and filter 24 original presets.

## Technology

- React 19, Vite, strict TypeScript, React Router, TanStack Query, Zustand
- Express 5, Mongoose, MongoDB, Zod, JWT HTTP-only cookies, bcrypt
- Vitest, React Testing Library, Supertest, MongoDB Memory Server, Playwright
- CSS design system with light/dark themes and responsive desktop/mobile editor layouts

## Architecture

```text
client/  React application, central API client, Studio state, pages and reusable UI
server/  Express app/server split, Mongoose models, validation, auth and REST routes
shared/  Zod contracts, domain types, colour maths, gradients, exports and presets
```

Colour calculations and export generators live in `shared`, separate from React. The Express application is exported independently from HTTP startup so Supertest can import it without opening a port. User identity always comes from the verified JWT; client-supplied owner IDs are ignored.

### Data model and indexes

- `User`: unique normalised email; password hash excluded by default.
- `Project`: owner reference, unique public slug, bounded tags; indexes on `(owner, updatedAt)` and `(visibility, updatedAt)`.
- `Gradient`: project and owner references, validated mode fields, bounded embedded colour stops; indexes on project/owner update lists.
- `Favourite`: compound unique index on `(user, targetType, target)`.

Deleting a project explicitly deletes its gradients and gradient favourites. Public sharing queries require `visibility: public`; private projects never resolve through `/api/share/:slug`.

## Local setup

Requirements: Node.js 22+, npm 10+, and MongoDB 7+ (or a MongoDB Atlas connection).

```bash
npm install
copy .env.example .env
npm run dev
```

Open:

- Client: http://localhost:5173
- API health: http://localhost:5000/api/health

The Vite development server proxies `/api` to the Express server.

### MongoDB Atlas

1. Create a cluster and database user in Atlas.
2. Add your current IP address to Network Access.
3. Put the connection string in `MONGODB_URI`.
4. Use a long random value (at least 32 characters) for `JWT_ACCESS_SECRET`.
5. Do not place secrets in `VITE_` variables.

The read-only preset library ships in the shared package. `npm run seed` verifies the preset count and database connection; user-generated data remains untouched.

## Environment variables

Server (`.env` at the repository root):

```text
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/hueflow
JWT_ACCESS_SECRET=replace-with-a-long-random-secret-at-least-32-characters
JWT_ACCESS_EXPIRES_IN=15m
CLIENT_URL=http://localhost:5173
COOKIE_NAME=hueflow_access
```

Client (`client/.env`, optional in local development):

```text
VITE_API_URL=/api
```

## Commands

```bash
npm run dev
npm run dev:client
npm run dev:server
npm run build
npm run typecheck
npm run lint
npm test
npm run test:e2e
npm run seed
```

API tests use `mongodb-memory-server`; they never touch a development or production database.

## Deployment

Build the client with `npm run build -w client` and deploy `client/dist` to Vercel, Netlify, or Cloudflare Pages. Configure an SPA rewrite to `index.html` for application routes while preserving real asset 404s.

Build the API with `npm run build -w server` and start it with `npm run start -w server` on Render, Railway, or another Node host. Configure:

- `NODE_ENV=production`
- Atlas `MONGODB_URI`
- a production `JWT_ACCESS_SECRET`
- the exact deployed frontend URL in `CLIENT_URL`
- a health check at `/api/health`

When frontend and API use different sites, cookies are sent with `Secure; SameSite=None`; both fetch and CORS credentials are enabled. Prefer sibling subdomains under one registrable domain where possible.

Update `client/public/sitemap.xml` and canonical deployment URLs before launch.

## Known limitations

- Mesh gradients export as layered radial CSS, SVG/raster representations rather than a native CSS mesh primitive.
- Gradient contrast is sampled at multiple positions and reports the lowest result; it is a conservative design aid, not a guarantee for every rendered pixel or text placement.
- Credential authentication is implemented for this portfolio build. A production OAuth provider can be added without changing the cookie session boundary.
- PNG export currently uses a high-resolution linear canvas rendering; SVG or CSS export preserves richer radial/conic/mesh semantics.
