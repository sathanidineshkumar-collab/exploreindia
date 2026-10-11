# ExploreIndia — System Architecture & Layer Design

## 1. High-Level Architecture Overview

ExploreIndia follows a **Decoupled Client-Server Architecture** tailored for simplicity, fast local development, and clear separation of concerns.

```
+-------------------------------------------------------------------------+
|                         PRESENTATION LAYER                              |
|   React 19 + TypeScript + Tailwind CSS v4 + Motion + Lucide Icons       |
|   Local Dev: Vite Dev Server (http://localhost:3000)                    |
+------------------------------------+------------------------------------+
                                     |
               REST API Requests     |  Vite Dev Proxy: /api -> :5000
               (JSON Payloads)       |  Production: direct /api
                                     v
+-------------------------------------------------------------------------+
|                         APPLICATION API LAYER                           |
|   Node.js + Express 4 + TypeScript (tsx / tsc)                          |
|   Express HTTP Server (http://localhost:5000)                           |
|                                                                         |
|   +-----------------------+   +------------------------------------+    |
|   |   Route Handlers      |   |   Middleware Pipeline              |    |
|   |   - /api/auth         |   |   - CORS Header Manager            |    |
|   |   - /api/places       |   |   - authenticateToken (JWT)        |    |
|   |   - /api/bookings     |   |   - requireAdmin (Role Guard)      |    |
|   |   - /api/trips        |   |   - central errorHandler           |    |
|   +-----------+-----------+   +-----------------+------------------+    |
|               |                                 |                       |
|               +----------------+----------------+                       |
|                                |                                        |
|                                v                                        |
|   +----------------------------------------------------------------+    |
|   |   Services & Domain Logic                                      |    |
|   |   - DatabaseEngine (In-memory Inverted Indexes: O(1) lookups)  |    |
|   |   - locationService (Open-Meteo Weather, Nominatim Geocoding)  |    |
|   |   - geminiService (Optional Gemini AI with offline fallbacks)  |    |
|   |   - imageService (Curated landmark photo registry)             |    |
|   +----------------------------+-----------------------------------+    |
+--------------------------------|----------------------------------------+
                                 |
                                 v
+-------------------------------------------------------------------------+
|                         PERSISTENCE LAYER                               |
|   File-based JSON Document Store: backend/data_store.json               |
|   - Synchronous, atomic file writes via fs.writeFileSync                |
|   - Zero database daemon setup required                                 |
|   - 490+ Places, 1,280+ Cities, Users, Bookings, Reviews, Trips         |
+-------------------------------------------------------------------------+
```

---

## 2. Beginner-Friendly Explanation of Each Layer

### Layer 1: Presentation Layer (`frontend/`)
* **What it does:** Renders the user interface in the web browser, collects user input, validates forms client-side, and provides responsive visual feedback.
* **Key Components:**
  * `src/App.tsx`: Main application controller that manages view state (`home`, `search`, `details`, `trips`, `profile`, `admin`), active filters, and user session.
  * `src/components/Navbar.tsx`: Navigation header with search bar, theme toggler (Dark/Light mode), and auth triggers.
  * `src/components/Footer.tsx`: Informational footer with quick navigation links.
  * `src/components/ExploreMap.tsx`: Interactive map utilizing Leaflet and OpenStreetMap tiles to render place coordinates.
  * `src/services/api.ts`: Centralized service client wrapping browser `fetch` calls, automatic authorization headers, and error parsing.

### Layer 2: API & Routing Layer (`backend/src/routes/` & `controllers/`)
* **What it does:** Receives incoming HTTP requests from the frontend, verifies user credentials, validates request bodies, and calls domain services.
* **Key Controllers:**
  * `authController.ts`: Handles user registration, bcrypt password hashing, login, JWT token generation, and OTP email verification.
  * `bookingController.ts`: Handles hotel, resort, and attraction reservation creation, validation, duplicate prevention, and deletion.
  * `placeController.ts`: Discovers places by city/category with pagination, handles trending places, and serves destination details.
  * `tripController.ts`: Creates and manages custom day-by-day travel itineraries.
  * `adminController.ts`: Serves moderation queues, analytics, user administration, and review approvals.

### Layer 3: Middleware Pipeline (`backend/src/middleware/`)
* **What it does:** Intercepts requests before reaching controllers to ensure security and consistency.
  * `auth.ts`: Extracts `Bearer <token>` from the HTTP `Authorization` header, verifies its digital signature using `ENV.JWT_SECRET`, and attaches the decoded user payload to `req.user`.
  * `errorHandler.ts`: Catches unhandled errors across all routes and returns a predictable `{ error: message }` JSON envelope with appropriate HTTP status codes.

### Layer 4: Domain & Indexing Engine (`backend/src/services/`)
* **What it does:** Provides fast search and external service integrations.
  * `databaseEngine.ts`: On server startup, builds in-memory inverted hash maps (`cityIndex`, `categoryIndex`, `tokenIndex`) over `db.places`. When a user filters by city or category, lookups complete in $O(1)$ constant time without scanning all 490+ records sequentially.
  * `locationService.ts`: Queries OpenStreetMap Nominatim for reverse geocoding and Open-Meteo for real-time weather forecasts.
  * `geminiService.ts`: Communicates with Google's Gemini AI if `GEMINI_API_KEY` is configured. If the key is absent or invalid, seamlessly falls back to the curated offline engine.

### Layer 5: Persistence Layer (`backend/src/config/db.ts`)
* **What it does:** Manages disk storage in `backend/data_store.json`.
  * On server boot, `loadDatabase()` reads `data_store.json` using `fs.readFileSync` and deserializes it into memory.
  * On mutations, `saveDatabase(db)` serializes the updated state using `JSON.stringify` and flushes it to disk via `fs.writeFileSync`.
  * Guarantees that bookings, reviews, and registered users remain persistent across server restarts.

---

## 3. End-to-End Hotel Booking Flow

Here is the exact step-by-step lifecycle of a hotel reservation:

```
[1. User Action]
User selects a hotel in Search/Details view -> clicks "Book".
       |
       v
[2. Frontend Validation (App.tsx)]
- Checks user authentication (prompts Login modal if unauthenticated).
- Checks check-in date is not empty and not in the past.
- If hotel/resort, checks check-out date is strictly after check-in date.
- Sets `isSubmittingBooking = true` to prevent double-clicks.
       |
       v
[3. Service Layer (api.ts)]
- Calls `api.bookings.create(token, payload)`
- Sends HTTP POST to `/api/bookings` with `Authorization: Bearer <token>`.
       |
       v
[4. Authentication Guard (auth.ts)]
- `authenticateToken` middleware verifies JWT token using `JWT_SECRET`.
- Attaches decoded `user` (id, email, role) to `req.user`.
       |
       v
[5. Controller Validation (bookingController.ts)]
- Validates placeId exists in `db.places`.
- Validates guest count (numeric range 1 to 20).
- Validates check-in date >= today; check-out date > check-in date.
- Checks for duplicate active bookings for the same user, place, and date.
       |
       v
[6. Persistence Operation (db.ts)]
- Generates unique ID `b-<timestamp>-<random>`.
- Pushes new booking object into in-memory `db.bookings` array.
- Calls `saveDatabase(db)` -> synchronously writes to `backend/data_store.json`.
       |
       v
[7. HTTP Response & State Update]
- Returns HTTP 201 Created with saved booking JSON object.
- Frontend prepends booking to `userBookings` state.
- Form shows animated green success banner: "Reservation Confirmed!".
- Booking immediately appears in User Profile -> "My Bookings" tab.
```

---

## 4. Local Development vs. Production Execution

| Mode | Command | Frontend URL | Backend URL | How API Requests Flow |
| :--- | :--- | :--- | :--- | :--- |
| **Development** | `npm run dev` | `http://localhost:3000` | `http://localhost:5000` | Browser calls `/api/...` -> Vite Proxy forwards to `http://localhost:5000/api/...` |
| **Production Build** | `npm run build && npm start` | `http://localhost:5000` | `http://localhost:5000` | Express serves compiled frontend static assets (`dist/`) and handles `/api/...` directly |
