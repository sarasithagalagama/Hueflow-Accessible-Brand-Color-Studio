# Hueflow - MERN Stack Codex Master Build Prompt

You are a senior full-stack engineer, product designer, and accessibility-focused UX specialist. Build a complete, production-quality portfolio project called **Hueflow**.

Do not stop after planning or scaffolding. Inspect the workspace, create the application, implement the core workflows, run it, test it, fix problems, and leave the repository in a polished state.

## 1. Product Vision

Hueflow is an accessible brand colour and gradient design studio for designers and frontend developers.

It should combine:

- Gradient creation
- Brand palette generation
- Accessibility testing
- Real interface previews
- Project organisation
- Developer-ready exports

The product must feel like a focused professional design tool, not a generic SaaS landing-page template and not a clone of GradientHub, Coolors, or another existing product.

The main differentiator is this workflow:

> Create a gradient or palette, test its accessibility, preview it on realistic UI components, save it as a project, and export production-ready design tokens without leaving the application.

## 2. Target Users

- UI/UX designers creating brand colour systems
- Frontend developers who need CSS and Tailwind-ready colours
- Freelancers preparing visual systems for clients
- Students learning colour theory and accessibility
- Small teams that need shareable colour projects

## 3. Technology Stack

Use the following unless the existing repository already has an appropriate equivalent:

- MongoDB, preferably MongoDB Atlas for production
- Express.js 5
- React 19
- Node.js using the current active LTS release
- Vite for the React application
- TypeScript in strict mode across client, server and shared code
- Tailwind CSS
- Accessible reusable React components
- Lucide icons
- Mongoose with TypeScript
- React Router
- TanStack Query for API server state, caching and mutations
- Context plus `useReducer`, or a small Zustand store, for complex Studio state
- JWT authentication using secure HTTP-only cookies
- bcrypt for password hashing
- Zod for validation
- React Hook Form where complex forms need it
- Helmet, CORS, cookie-parser and express-rate-limit
- Vitest and React Testing Library for focused unit/component tests
- Supertest for Express API tests
- Playwright for core end-to-end workflows

Use a workspace-based MERN monorepo:

```text
hueflow/
├── client/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── features/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── stores/
│       ├── styles/
│       ├── types/
│       └── utils/
├── server/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── types/
│       ├── utils/
│       ├── app.ts
│       └── server.ts
├── shared/
│   └── shared schemas and types where genuinely useful
└── package.json
```

Keep the Express app separate from the HTTP server startup so API tests can import it without opening a port. Keep API calls in a central client API layer rather than spreading fetch calls throughout components.

Do not add an external service when a reliable browser or framework API can perform the task.

## 4. Visual Direction

Create an original design system for Hueflow.

### Brand

- Product name: Hueflow
- Tagline: Create colour systems that work everywhere.
- Personality: expressive, intelligent, practical and modern
- Visual style: bright editorial design mixed with a professional creative tool
- Avoid a one-colour purple theme
- Avoid decorative gradient blobs, excessive glassmorphism and oversized rounded cards
- Use gradients where they demonstrate the product, not as meaningless decoration

### Layout

- The actual studio should appear in the first viewport
- Use a compact top navigation and a desktop editor layout
- Desktop editor: large live canvas with a right-side control panel
- Tablet: narrower canvas and collapsible controls
- Mobile: canvas first, controls in logical stacked sections or a bottom sheet
- Use border radii of 8px or less for most controls and panels
- Maintain strong spacing, hierarchy and contrast
- Support both light and dark application themes
- Ensure there is no clipping, horizontal overflow or overlapping UI

### Typography

- Use a clean system or locally available sans-serif font
- Use large type only for meaningful page headings
- Keep studio controls compact and highly scannable
- Do not use negative letter spacing

## 5. Main Navigation

Provide:

- Studio
- Explore
- Projects
- Accessibility
- Sign in / account menu
- Theme toggle

The logo should return to the studio.

## 6. Required Pages

### A. Studio - `/studio`

This is the main product and default page.

Build a live gradient editor with:

- Linear gradients
- Radial gradients
- Conic gradients
- Mesh-style gradients created with layered radial gradients
- Two to six editable colour stops
- Colour picker and validated HEX input
- Draggable or adjustable stop positions
- Gradient angle control
- Gradient centre/position controls where applicable
- Noise or grain amount
- Blur/softness control for mesh gradients
- Canvas aspect-ratio presets:
  - 16:9
  - 4:3
  - 1:1
  - 9:16
  - Custom
- Randomise action
- Undo and redo
- Reset action
- Editable gradient name
- Full-screen preview

Add realistic preview modes:

- Website hero
- Mobile application screen
- Social media post
- Poster
- Button and component set
- Plain background

The previews must use the current colours and make it easy to assess text readability.

### B. Palette Panel

Allow users to:

- Add and remove colours
- Reorder colours
- Lock specific colours during randomisation
- Generate complementary, analogous, triadic, split-complementary and monochromatic harmonies
- Generate light-to-dark scales for a selected colour
- Rename semantic roles such as primary, secondary, accent, surface and text
- Copy an individual HEX, RGB, HSL or OKLCH value

### C. Accessibility Workspace - `/accessibility`

Provide:

- Foreground and background selectors
- WCAG contrast ratio
- AA normal text result
- AA large text result
- AAA normal text result
- AAA large text result
- UI component contrast guidance
- A matrix comparing all palette colours against each other
- Suggested accessible alternatives that preserve the original hue where practical
- Text preview at multiple sizes
- Button, input, badge and link previews
- Colour-vision deficiency simulations:
  - Protanopia
  - Deuteranopia
  - Tritanopia
  - Achromatopsia

Do not claim full compliance based only on checking gradient endpoints. Explain in the interface that text over a gradient can encounter different contrast values across the background. Sample several positions across the rendered gradient and show the lowest measured contrast as the conservative result.

### D. Explore - `/explore`

Create a curated gradient and palette gallery.

Include:

- Responsive masonry-like or balanced grid
- Search by name, colour or tag
- Filters for bright, pastel, dark, warm, cool, monochrome and accessible
- Sort by newest, popular and most saved
- Preview card with name, colours and type
- One-click copy
- Open in Studio
- Save/favourite
- Pagination or progressive loading
- Useful empty, loading and error states

Seed the application with at least 24 original presets. Do not copy names or exact colour combinations from existing gradient websites.

### E. Projects - `/projects`

Authenticated users can:

- Create a project
- Rename or delete a project
- Save gradients and palettes
- Add a description and tags
- Duplicate a project
- Mark a project public or private
- Generate a public read-only share link
- View recently updated projects

Unauthenticated users may experiment in the studio. Preserve their current draft in browser storage and offer to attach it to their account after sign-in.

### F. Shared Project - `/share/[slug]`

Display:

- Project name and creator
- Large gradient preview
- Palette swatches
- Accessibility summary
- CSS and token preview
- Copy and duplicate-to-workspace actions

Private projects must never be accessible through this route.

### G. Authentication

Provide:

- Sign up
- Sign in
- Sign out
- Protected project routes
- Friendly validation and error states

If external OAuth credentials are unavailable, implement credential-based local development authentication and document how to configure a production provider.

Implement authentication through the Express API:

- Hash passwords with bcrypt
- Issue a short-lived JWT access token
- Store the token in an `httpOnly` cookie with secure production settings
- Never store authentication tokens in `localStorage` or `sessionStorage`
- Add `GET /api/auth/me` to restore the current session
- Add authentication middleware that attaches the verified user identity to the request
- Clear the authentication cookie during logout
- Return generic login errors that do not reveal whether an email exists

For the initial portfolio version, a secure cookie-based access-token session is sufficient. Do not add refresh-token complexity unless it is implemented completely with rotation, revocation and tests.

## 7. Export Features

Users must be able to export:

- CSS `linear-gradient`, `radial-gradient` or `conic-gradient`
- CSS variables
- Tailwind theme configuration
- JSON design tokens
- SCSS variables
- SVG
- PNG in selected aspect ratio and resolution

Include:

- Copy buttons with success feedback
- Download buttons
- Clean file names based on the gradient or project name
- An export modal with tabs
- Proper escaping and valid generated syntax

For mesh gradients, clearly label whether an export is native CSS, layered CSS, SVG or raster output.

## 8. MongoDB Data Model

Design efficient Mongoose schemas based on real access patterns. Use references for entities with independent lifecycles and embed bounded data normally read and updated with its parent.

### User Collection

- `_id`
- name
- normalised email with a unique index
- `passwordHash` with `select: false`
- image
- createdAt
- updatedAt

### Project Collection

- `_id`
- owner as a User reference
- name
- slug with an appropriate unique index
- description
- visibility enum: `private` or `public`
- tags as a bounded string array
- createdAt
- updatedAt

Add indexes supporting owner project lists sorted by update time, public slug lookup, and public gallery filtering.

### Gradient Collection

- `_id`
- project as a Project reference
- owner as a User reference for efficient secure queries
- name
- type enum
- angle
- centre or position configuration
- noise
- blur
- aspectRatio
- colour stops as bounded embedded subdocuments:
  - `_id`
  - name or semantic role
  - hex
  - position
  - locked
  - order
- validated mode-specific configuration
- tags
- saveCount
- createdAt
- updatedAt

### Favourite Collection

- `_id`
- user reference
- target reference
- targetType enum: `preset` or `gradient`
- createdAt

Create a compound unique index preventing the same user from favouriting the same target twice.

### Preset Collection or Seeded Read-Only Data

- name
- slug
- gradient configuration
- tags
- mood
- accessibility metadata
- saveCount
- createdAt

Use Mongoose validation, enums, timestamps, indexes and bounded array limits. Do not use unvalidated `Mixed` fields for core gradient data.

Never trust a user ID supplied by the client. Resolve ownership from the verified JWT request identity.

MongoDB does not automatically cascade deletes. When deleting a project, explicitly delete its dependent gradients and related favourites. Use a MongoDB transaction only when the deployment supports transactions and a multi-document operation must succeed atomically.

## 9. API and Server Behaviour

Create a versioned REST API under `/api`.

Implement at least:

```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/projects
POST   /api/projects
GET    /api/projects/:projectId
PATCH  /api/projects/:projectId
DELETE /api/projects/:projectId
POST   /api/projects/:projectId/duplicate

GET    /api/projects/:projectId/gradients
POST   /api/projects/:projectId/gradients
GET    /api/gradients/:gradientId
PATCH  /api/gradients/:gradientId
DELETE /api/gradients/:gradientId

GET    /api/explore
GET    /api/presets/:slug
POST   /api/favourites
DELETE /api/favourites/:targetType/:targetId
GET    /api/share/:slug
GET    /api/health
```

The API must support:

- Project CRUD
- Gradient CRUD
- Favourites
- Public sharing
- Search and filters

Requirements:

- Validate all input with Zod
- Reuse compatible validation contracts between client and server where practical
- Return structured errors
- Enforce authentication and ownership server-side
- Use controllers for HTTP concerns and services for substantial business logic
- Add central not-found and error-handling middleware
- Use async error handling consistently
- Use Mongoose `.lean()` for read-only queries where document methods are unnecessary
- Select only fields required by list and gallery endpoints
- Add pagination limits and prevent unbounded collection reads
- Add explicit indexes for repeated filter and sort patterns
- Use transactions only when multi-document atomicity is genuinely required
- Prevent private project data leakage
- Apply stricter rate limits to authentication endpoints
- Configure CORS with an explicit frontend origin and credentials support
- Use Helmet and secure cookie settings
- Limit JSON request body size
- Validate MongoDB ObjectIds before querying
- Never pass request bodies directly into Mongoose update operations
- Prevent NoSQL operator injection by accepting only validated, explicitly selected fields
- Return a consistent response format, for example `{ success, data, message, errors }`
- Set correct HTTP status codes for validation, authentication, authorisation, not-found and conflict errors
- Do not return password hashes, internal error stacks or sensitive configuration

## 10. Gradient and Colour Utilities

Create tested utility modules for:

- HEX, RGB, HSL and OKLCH conversion
- Relative luminance
- WCAG contrast ratio
- Gradient CSS generation
- Gradient sampling
- Colour harmony generation
- Colour scale generation
- Accessible alternative suggestions
- Export generation
- Public slug generation

Keep colour calculations separate from React components.

For gradient contrast:

1. Render or mathematically sample the gradient at multiple points.
2. Compare the selected text colour at each point.
3. Report the minimum contrast ratio.
4. Identify the weakest area.
5. Do not present the result as guaranteed accessibility for every possible layout.

## 11. UX Requirements

- All important actions must have visible feedback
- Confirm destructive actions
- Support keyboard navigation
- Provide visible focus styles
- Use semantic labels and accessible names
- Ensure colour is not the only way information is communicated
- Do not hide critical controls behind hover-only interactions
- Add skeletons for meaningful loading states
- Provide useful empty and error states
- Preserve unsaved studio work
- Warn before discarding meaningful unsaved changes
- Make copy, save and export actions fast

Add keyboard shortcuts:

- `R`: randomise
- `Cmd/Ctrl + Z`: undo
- `Cmd/Ctrl + Shift + Z`: redo
- `Cmd/Ctrl + S`: save
- `Cmd/Ctrl + C` only when a copy action is focused or explicitly triggered; do not override normal browser copying

Display shortcuts in tooltips or a shortcuts modal.

## 12. Accessibility Requirements

- Target WCAG 2.2 AA for the application interface
- Correct heading hierarchy
- Semantic HTML
- Keyboard-operable controls
- Accessible dialogs with focus trapping
- Proper form labels and descriptions
- Announce copy/save/export success through an ARIA live region
- Never rely only on colour for pass/fail states
- Respect reduced-motion preferences
- Ensure touch targets are usable on mobile

## 13. Performance

- Avoid unnecessary large client bundles
- Lazy-load expensive preview or export code
- Optimise MongoDB queries with projections, pagination and suitable indexes
- Debounce gallery search
- Do not store large raster files directly in MongoDB documents
- Keep layout stable while content loads
- Prefer CSS-generated previews where practical
- Use dynamic imports for rarely used export logic

## 14. SEO and Metadata

Add:

- Page-specific titles and descriptions
- Open Graph metadata
- Twitter card metadata
- Sitemap
- Robots configuration
- Canonical URLs where appropriate
- Structured metadata for the public gallery if useful

Private project pages must not be indexed.

Use React Helmet Async or an equivalent React-compatible metadata solution. Configure the deployed host to return `index.html` for valid client-side routes while allowing actual missing assets to return 404 responses.

## 15. Testing

Add focused automated tests for:

- Colour conversion
- Contrast ratio calculations
- CSS gradient generation
- Export syntax
- Ownership and visibility rules
- Form validation
- Project creation
- Saving a gradient
- Opening a preset in the studio
- Exporting CSS
- Public share access
- Private project rejection
- Authentication cookies and protected API routes
- Mongoose model validation
- API validation and structured error responses

Use Supertest for Express routes. Use a dedicated test database or `mongodb-memory-server`; never run automated tests against a production or personal development database.

Use Playwright to verify at least:

1. A visitor edits a gradient and copies CSS.
2. A visitor creates a draft and retains it after refresh.
3. An authenticated user creates a project and saves a gradient.
4. A user shares a public project.
5. Another visitor cannot access a private project.
6. The main workflow works at desktop and mobile viewport sizes.

## 16. Seed Data

Create at least 24 original presets with:

- Unique names
- Two to five colours
- Type
- Angle or position
- Tags
- Mood category
- Accessibility metadata where appropriate

Use varied combinations. Avoid making most presets purple, blue or visually similar.

## 17. Repository Documentation

Create:

- `README.md`
- `.env.example`
- `AGENTS.md`
- MongoDB Atlas and local MongoDB setup instructions
- Mongoose schema and index notes
- Seed instructions
- Local development instructions
- Test commands
- Deployment instructions
- Architecture overview
- Feature list
- Known limitations

The README should include:

- Product overview
- Screenshots or a clearly marked screenshot section
- Technology stack
- Main workflows
- Local setup
- Environment variables
- Database commands
- Testing
- Deployment

`AGENTS.md` should document:

- Install command
- Development command
- Build command
- Lint command
- Type-check command
- Unit test command
- End-to-end test command
- Code conventions
- Verification expectations

## 18. Implementation Process

Follow this sequence:

1. Inspect the existing workspace and preserve useful existing work.
2. Summarise the current state and implementation approach.
3. Create a short task checklist.
4. Scaffold only what is needed.
5. Establish the design tokens, layout and shared components.
6. Build the Studio and colour utility modules first.
7. Add accessibility analysis and export functions.
8. Add Express, MongoDB, Mongoose, JWT authentication and Projects workflows.
9. Add Explore and public sharing.
10. Add responsive behaviour, themes and polished states.
11. Add tests and documentation.
12. Run all available checks.
13. Fix failures and obvious visual defects.
14. Start the development server and provide its URL.

Do not ask me to make ordinary implementation choices that can be inferred from this specification. Make reasonable decisions and continue.

Ask only when you need:

- A secret or third-party credential
- Approval for a destructive action
- Clarification that would materially change the product

## 19. Engineering Constraints

- Use TypeScript strict mode
- Avoid `any` unless there is a documented reason
- Avoid giant components
- Keep business logic out of presentation components
- Reuse established components without over-abstracting
- Do not introduce Redux unless state complexity clearly requires it
- Do not use placeholder buttons that do nothing
- Do not leave core workflows as TODO comments
- Do not claim a feature is complete unless it works
- Do not expose secrets to the client
- Do not store authoritative project data only in browser storage
- Do not store JWTs in localStorage or sessionStorage
- Do not expose uncontrolled Mongoose documents directly as API responses
- Do not construct MongoDB queries from unvalidated client objects
- Do not copy another website's branding, text, presets or exact layout

## 20. Definition of Done

The project is complete when:

- The studio is usable without authentication
- Gradient editing updates the preview immediately
- At least four gradient modes work
- Accessibility analysis reports meaningful results
- UI preview modes work
- Exports generate valid output
- Authentication and protected routes work
- Users can create and manage projects
- Public and private sharing rules are enforced
- Explore search and filters work
- Draft persistence works
- The application is responsive
- Light and dark themes are polished
- Empty, loading and error states exist
- Core utilities and workflows have automated tests
- Lint, type-check, test and production build pass
- Documentation is sufficient for another developer to run the project

## 21. MERN Environment Configuration

Create safe environment examples containing placeholders only.

Server variables:

```text
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/hueflow
JWT_ACCESS_SECRET=replace-with-a-long-random-secret
JWT_ACCESS_EXPIRES_IN=15m
CLIENT_URL=http://localhost:5173
COOKIE_NAME=hueflow_access
```

Client variables:

```text
VITE_API_URL=http://localhost:5000/api
```

Requirements:

- Validate required server environment variables during startup
- Never include secrets in `VITE_` variables
- Configure Vite development proxying if useful
- Provide one root command to run client and server concurrently
- Provide separate development commands for client and server
- Support graceful Express shutdown and MongoDB disconnection

## 22. MERN Deployment

Prepare the frontend and API for independent deployment:

- React frontend: Vercel, Netlify or Cloudflare Pages
- Express API: Render, Railway or another Node.js host
- Database: MongoDB Atlas

Document:

- Production environment variables
- Production build and start commands
- CORS origin configuration
- Secure cookie behaviour when frontend and API use different domains
- MongoDB Atlas network access
- Health-check configuration using `GET /api/health`

Do not hardcode localhost URLs.

## 23. Final Response Format

When finished, report:

- What was built
- Important architecture decisions
- Main files created or changed
- Database and environment setup required
- Commands run
- Test and build results
- Local preview URL
- Any genuine remaining limitations

Begin by inspecting the workspace. Then implement the project rather than returning only a plan.
