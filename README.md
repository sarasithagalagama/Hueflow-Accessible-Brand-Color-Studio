# Hueflow

**Hueflow** is an accessible brand colour and gradient design studio for designers, frontend developers, freelancers, students, and small creative teams.

It combines colour exploration, accessibility analysis, realistic interface previews, project organisation, and production-ready exports in one focused workspace.

> Create colour systems that work everywhere.

## The idea

Colour tools often separate the creative and technical parts of the process. A designer may create a gradient in one application, build a palette elsewhere, test contrast using another website, manually recreate the colours in interface mockups, and then prepare code for development.

Hueflow brings that entire workflow together:

1. Create a gradient or palette.
2. Refine the colour relationships.
3. Preview the colours in realistic interfaces.
4. Test readability and accessibility.
5. Save the work as a project.
6. Share it with others.
7. Export implementation-ready code and assets.

The application is designed as a professional creative tool rather than a generic dashboard or gradient gallery.

## Main areas

### Studio

The Studio is the main Hueflow workspace and the default application view.

It provides a live gradient canvas with an adjacent control panel. Every change is reflected immediately in the preview.

Supported gradient types:

- Linear gradients
- Radial gradients
- Conic gradients
- Mesh-style gradients built from layered radial gradients

Studio controls include:

- Two to six editable colour stops
- Native colour picker and validated HEX values
- Adjustable stop positions
- Editable semantic colour names
- Stop locking during randomisation
- Colour reordering
- Gradient angle
- Radial and conic centre positioning
- Grain and noise
- Mesh softness
- Editable gradient name
- Full-screen preview
- Reset, undo, and redo
- Random colour generation
- Canvas aspect ratios including 16:9, 4:3, 1:1, 9:16, and custom ratios

The current Studio draft is saved in browser storage, allowing visitors to experiment without creating an account and continue after refreshing the page.

### Palette generation

Hueflow treats colours as a reusable system rather than isolated swatches.

Palette tools provide:

- Complementary harmonies
- Analogous harmonies
- Triadic harmonies
- Split-complementary harmonies
- Monochromatic harmonies
- Light-to-dark tonal scales
- Semantic roles such as primary, secondary, accent, surface, and text
- HEX, RGB, HSL, and OKLCH values
- Individual colour copying

Colour calculation logic is independent from the interface and shared between the Studio, accessibility analysis, previews, and exports.

### Interface previews

Colours can be inspected in six practical contexts:

- Website hero
- Mobile application screen
- Social media post
- Editorial poster
- Buttons and interface components
- Plain gradient background

These previews help users evaluate hierarchy, mood, text readability, and the practical behaviour of a colour system before exporting it.

### Accessibility workspace

The Accessibility workspace analyses foreground and background relationships using WCAG contrast calculations.

It includes:

- Foreground and background colour selection
- Exact contrast ratio
- WCAG AA normal-text result
- WCAG AA large-text result
- WCAG AAA normal-text result
- WCAG AAA large-text result
- Text specimens at multiple sizes
- Button and link previews
- Suggested accessible alternatives
- Full palette contrast matrix

Hueflow also tests text over the active gradient. It samples multiple positions across the gradient and reports the lowest measured contrast ratio and weakest area.

This result is intentionally presented as a conservative design aid. Gradient endpoints alone cannot guarantee readable text across every position or final layout.

Supported colour-vision simulations:

- Protanopia
- Deuteranopia
- Tritanopia
- Achromatopsia

### Explore gallery

Explore contains 24 original Hueflow presets with varied colour combinations, moods, and gradient types.

Users can:

- Search by name, tag, or colour value
- Filter bright, pastel, dark, warm, cool, monochrome, and accessible presets
- Sort by newest, popularity, or saved state
- Copy gradient CSS
- Copy individual colours
- Save favourites
- Open a preset directly in the Studio
- Progressively load more presets

The preset library avoids copied names and exact colour combinations from existing gradient websites.

### Accounts and authentication

Visitors can use the Studio without signing in. Accounts unlock persistent project organisation and public sharing.

Authentication supports:

- Account registration
- Sign in
- Sign out
- Session restoration
- Protected project access
- Friendly validation and error states

Passwords are hashed with bcrypt. Authentication uses a short-lived JWT stored in an HTTP-only cookie rather than browser storage.

### Projects

Authenticated users can organise their colour work into projects.

Project functionality includes:

- Creating projects
- Attaching the current Studio draft
- Adding descriptions
- Adding tags
- Private or public visibility
- Recently updated project lists
- Project deletion with confirmation
- Saving multiple gradients
- Project duplication through the API

Ownership is enforced by the server. The application never trusts a user identifier supplied by the browser.

### Public sharing

Public projects receive a unique read-only share link.

Shared project pages display:

- Project name
- Creator
- Large gradient presentation
- Palette swatches
- Colour names and values
- Developer token preview
- CSS variable copying
- Duplicate-to-Studio action

Private projects are never returned through the public sharing route.

### Export system

Hueflow converts colour systems into practical design and development formats.

Available exports:

- CSS gradient
- CSS custom properties
- Tailwind theme configuration
- JSON design tokens
- SCSS variables
- SVG
- PNG

Exports use clean filenames derived from the gradient name and provide copy or download feedback.

Mesh gradients are clearly represented as layered radial CSS because CSS does not currently provide a native mesh-gradient primitive.

## Colour engine

The shared colour engine provides:

- HEX normalisation
- HEX and RGB conversion
- RGB and HSL conversion
- OKLCH representation
- Relative luminance
- WCAG contrast ratio
- Colour interpolation
- Gradient generation
- Gradient sampling
- Harmony generation
- Tonal scale generation
- Accessible colour suggestions
- Colour-vision simulation
- Best foreground-colour selection
- Export generation
- Public slug generation

Keeping this logic separate from React components makes the calculations reusable and independently testable.

## User experience and accessibility

Hueflow targets a compact, professional editor experience with a bright editorial visual direction.

Interface characteristics:

- Light and dark themes
- Responsive desktop, tablet, and mobile layouts
- Canvas-first mobile experience
- Visible keyboard focus
- Semantic HTML
- Labelled controls
- Keyboard-operable actions
- ARIA live feedback for copy and save actions
- Reduced-motion support
- Destructive-action confirmation
- Loading, empty, and error states
- No critical hover-only controls
- A 12px minimum text size

Keyboard shortcuts:

- `R` — randomise unlocked colours
- `Ctrl/Cmd + Z` — undo
- `Ctrl/Cmd + Shift + Z` — redo

## Technology stack

### Frontend

- React 19
- TypeScript in strict mode
- Vite
- React Router
- TanStack Query
- Zustand
- React Hook Form-compatible validation architecture
- Zod
- Lucide React
- Custom responsive CSS design system

### Backend

- Node.js
- Express 5
- TypeScript
- MongoDB
- MongoDB Atlas
- Mongoose
- Zod request validation
- JWT authentication
- HTTP-only cookies
- bcrypt password hashing
- Helmet
- CORS
- Cookie Parser
- Express Rate Limit

### Testing

- Vitest
- React Testing Library
- Supertest
- MongoDB Memory Server
- Playwright

Tests cover colour calculations, gradients, export syntax, component updates, validation, authentication cookies, protected routes, project creation, public sharing, private-project rejection, draft persistence, preset loading, and desktop/mobile workflows.

## Application architecture

Hueflow is organised as a workspace-based MERN monorepo:

```text
client/
  src/
    api/          Central API communication
    components/   Shared application UI
    features/     Studio-specific features
    hooks/        Authentication and reusable hooks
    pages/        Route-level screens
    stores/       Studio state and draft persistence
    styles/       Application design system

server/
  src/
    config/       Environment and database configuration
    middleware/   Authentication, validation, and errors
    models/       Mongoose schemas and indexes
    routes/       Versioned REST API behaviour
    utils/        Server utilities
    app.ts        Express application
    server.ts     HTTP and database startup

shared/
  src/
    colour.ts     Colour conversion and accessibility maths
    gradient.ts   Gradient generation and sampling
    export.ts     Developer export generation
    presets.ts    Original preset library
    schemas.ts    Shared Zod contracts
    types.ts      Shared domain types
```

The client uses a central API layer rather than placing network requests inside presentation components. TanStack Query manages server state, while Zustand manages the interactive Studio history and local draft.

The Express application is separated from server startup so API tests can import it without opening a network port.

## Data model

### User

Stores:

- Name
- Normalised unique email
- Secure password hash
- Optional profile image
- Creation and update timestamps

Password hashes are excluded from normal database queries and API responses.

### Project

Stores:

- Owner reference
- Project name
- Unique public slug
- Description
- Private or public visibility
- Bounded tags
- Creation and update timestamps

Indexes support owner project lists, recent updates, public filtering, and share-link lookup.

### Gradient

Stores:

- Project and owner references
- Name and gradient type
- Angle and centre position
- Grain and softness
- Aspect ratio
- Two to six embedded colour stops
- Semantic stop names
- HEX values
- Positions and lock states
- Tags and save count
- Creation and update timestamps

### Favourite

Stores a user, target, and target type. A compound unique index prevents the same item from being favourited twice by one user.

## API capabilities

The REST API provides:

- Registration, login, logout, and session restoration
- Protected project creation, reading, editing, deletion, and duplication
- Gradient creation, reading, editing, and deletion
- Explore search, filters, sorting, and pagination
- Favourite creation and removal
- Public read-only project sharing
- Health reporting

All request bodies are validated with Zod. Resource identifiers are checked before querying MongoDB, ownership is enforced server-side, and API responses use a consistent structured format.

## Security approach

- Passwords are never stored in plain text.
- JWTs are never stored in local or session storage.
- Authentication cookies are HTTP-only.
- Login failures do not reveal whether an email address exists.
- Authentication routes use stricter rate limiting.
- MongoDB updates use explicitly selected fields.
- Request objects are validated before database queries.
- Private project data is excluded from public routes.
- Password hashes, internal error stacks, and server secrets are never returned to clients.

## Brand and visual direction

Hueflow uses a custom visual identity built around an expressive ribbon-shaped “h” mark and a multicolour gradient.

The interface combines:

- Bright editorial typography
- Compact professional controls
- Purposeful use of gradients
- Restrained border radii
- Strong contrast and spacing
- Warm neutral application surfaces
- A responsive light and dark theme

Gradients are used to demonstrate the product itself rather than as unrelated decoration.

## Project status

Hueflow currently provides a complete portfolio-ready implementation of its central workflow:

> Create a colour system, test it, preview it, save it, share it, and export it without leaving the application.

The project was designed and developed by [Sarasitha Galagama](https://www.sarasitha.me/).

© 2026 Hueflow. All rights reserved.
