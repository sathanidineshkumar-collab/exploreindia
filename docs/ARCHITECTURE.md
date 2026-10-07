# ExploreIndia Architecture & Technical Design

## 1. System Overview

ExploreIndia is an Indian tourism web platform featuring smart AI-powered destination discovery, interactive geographical mapping, multi-day itinerary planning, hotel/resort room booking, and platform administration.

The project follows a **Decoupled Client-Server Architecture** designed for maintainability, independent deployment, and developer ergonomics:

```
┌────────────────────────────────────────────────────────┐
│                   Client Layer                         │
│   React 19 + TypeScript + Tailwind CSS v4 + Motion     │
│   Vite Dev Server (Port 3000)                          │
└──────────────────────────┬─────────────────────────────┘
                           │
             HTTP / REST   │  (Vite Proxy in Dev: /api -> :5000)
                           ▼
┌────────────────────────────────────────────────────────┐
│                   Backend API Layer                    │
│   Node.js + Express 4 + TypeScript (tsx)               │
│   Express REST Server (Port 5000)                      │
│   ├── Controllers (Request orchestration)              │
│   ├── Middleware (JWT auth guard, central errors)      │
│   ├── Services (Gemini AI, Geo data & fallbacks)       │
│   └── Config (DB access layer, environment config)     │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│                   Data Persistence                     │
│   File-based JSON Database: `backend/data_store.json`  │
│   - Users & JWT Password Hashes                        │
│   - 196+ Curated Places & 1,280+ Curated Cities        │
│   - Reviews & Admin Moderation Queue                   │
│   - Multi-Day Trips & Room Bookings                    │
└────────────────────────────────────────────────────────┘
```

---

## 2. Directory Layout & Module Responsibilities

### `frontend/` (Client Application)
- **`src/components/`**: Reusable modular UI components (`Navbar.tsx`, `Footer.tsx`, `ExploreMap.tsx`).
- **`src/services/api.ts`**: Strongly-typed API client handling authentication headers, error envelopes, and REST calls.
- **`src/types.ts`**: Client-side TypeScript contracts matching backend entities.
- **`src/constants.ts`**: Fallback avatars and SVG placeholders for resilient image handling.
- **`src/App.tsx`**: Main application coordinator containing view routing (Home, Search, Details, Trip Planner, Bookings, Admin).
- **`vite.config.ts`**: Vite configuration containing Tailwind CSS plugin and `/api` reverse proxy to `http://localhost:5000`.

### `backend/` (Server Application)
- **`src/config/`**:
  - `env.ts`: Typed environment configuration with default fallbacks.
  - `db.ts`: Database file path resolver and atomic synchronous `loadDatabase()` / `saveDatabase()` engine.
- **`src/controllers/`**: HTTP handlers organized strictly by business domain:
  - `authController.ts`: Signup, bcrypt password hashing, login, JWT token signing, OTP verification.
  - `placeController.ts`: AI-assisted place discovery, curated trending lists, places by ID.
  - `userController.ts`: Profile management, favorites toggling, search history clearing.
  - `tripController.ts`: Multi-day trip itinerary CRUD.
  - `bookingController.ts`: Room reservation creation and cancellation.
  - `reviewController.ts`: Review submissions and rating recalculations.
  - `notificationController.ts`: Platform notifications.
  - `adminController.ts`: Platform analytics, place management, user moderation, review approval queue.
- **`src/middleware/`**:
  - `auth.ts`: JWT bearer token validator and `requireAdmin` role guard.
  - `errorHandler.ts`: Central error-catching middleware with structured JSON responses.
- **`src/models/types.ts`**: TypeScript entity models and Database schema definitions.
- **`src/routes/`**: Express route declarations mounted onto modular routers.
- **`src/services/`**:
  - `geminiService.ts`: Integration with Google GenAI SDK (`@google/genai`) with structured JSON parsing.
  - `geoDataService.ts`: Offline database covering 90+ Indian cities and mock generation fallback.
- **`data_store.json`**: Active JSON database file for the backend.

### `scripts/` (Build & Operational Tooling)
- **`dev.cjs`**: Cross-platform launcher running both backend and frontend concurrently with unified colored terminal logging.
- **`seed_db.cjs`**: Data hydration script populating curated places and cities into `backend/data_store.json`.

### `tests/` (Quality Assurance)
- **`test_flow.cjs`**: Automated end-to-end integration test validating 12 critical API flows against the backend.

---

## 3. Communication & Security Flow

1. **Development Proxy**:
   During development, the frontend makes relative calls (e.g., `fetch('/api/discover')`). The Vite dev server proxies these to `http://localhost:5000/api/discover`, avoiding browser CORS complications.

2. **Cross-Origin Resource Sharing (CORS)**:
   The backend includes built-in CORS middleware permitting credentials and requests originating from frontend development servers (`http://localhost:3000`, `http://localhost:5173`).

3. **Authentication**:
   - Passwords are encrypted using `bcryptjs` with salt rounds.
   - Sessions are managed statelessly using `jsonwebtoken` (JWT).
   - Protected endpoints require `Authorization: Bearer <token>`.

4. **Fault-Tolerant AI & Geocoding**:
   If `GEMINI_API_KEY` is not provided or invalid, the backend seamlessly falls back to `geoDataService.ts` containing offline coordinates and curated listings for over 90 Indian destinations.
