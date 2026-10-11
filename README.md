# 🇮🇳 ExploreIndia — Travel Discovery, Itinerary & Hotel Booking Platform

ExploreIndia is a full-stack Indian travel discovery and booking platform built with **React 19**, **Vite 6**, **Node.js**, **Express 4**, and **TypeScript**. It enables travelers to explore curated destinations, luxury hotels, authentic local restaurants, heritage resorts, and ancient temples across India. The platform features fast multi-category search, Leaflet OpenStreetMap navigation, multi-day itinerary planning, hotel room reservations with server-side validation, user profile management, and an administrative moderation dashboard.

---

## Table of Contents
1. [Project Overview & Key Features](#1-project-overview--key-features)
2. [Verified Technology Stack](#2-verified-technology-stack)
3. [Exact Database Technology & Storage Mechanism](#3-exact-database-technology--storage-mechanism)
4. [Architecture & Folder Structure](#4-architecture--folder-structure)
5. [Database Schema & Collections](#5-database-schema--collections)
6. [Hotel Booking Lifecycle (Frontend to Storage)](#6-hotel-booking-lifecycle-frontend-to-storage)
7. [Prerequisites & Local Setup (Windows & VS Code)](#7-prerequisites--local-setup-windows--vs-code)
8. [Environment Variable Configuration](#8-environment-variable-configuration)
9. [Available Scripts & Startup Commands](#9-available-scripts--startup-commands)
10. [API Reference (Endpoints, Request & Response Examples)](#10-api-reference)
11. [Testing & Quality Verification](#11-testing--quality-verification)
12. [Common Errors & Troubleshooting](#12-common-errors--troubleshooting)
13. [Deployment Instructions](#13-deployment-instructions)
14. [Technical Interview Defense Guide (10 Q&A)](#14-technical-interview-defense-guide)

---

## 1. Project Overview & Key Features

* **Smart Destination Discovery:** Fast search across 1,280+ Indian cities and 490+ curated places with 17 distinct category filters (Hotels, Resorts, Temples, Heritage Monuments, Beaches, Waterfalls, Nature, Wildlife, Bazaars, Food).
* **Hotel & Room Booking:** Select check-in and check-out dates, choose guest counts and room types, validate dates on client and server, prevent duplicate/conflicting bookings, and persist reservations to disk.
* **Interactive Geographic Maps:** Leaflet and OpenStreetMap integration showing exact latitude/longitude coordinates and custom popups without mandatory paid Google Maps APIs.
* **Trip & Itinerary Planner:** Custom multi-day travel planner with daily place additions, drag/drop organization, and personal notes.
* **User Authentication & Profiles:** Register with password hashing (`bcryptjs`) and 6-digit OTP verification, authenticate using stateless JSON Web Tokens (JWT), save favorite places, and track search history.
* **Admin Moderation & Analytics:** Role-protected admin dashboard (`admin@exploreindia.com`) to inspect platform KPI metrics, manage destination records, and moderate user reviews.

---

## 2. Verified Technology Stack

| Component | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `^19.0.1` | Declarative component UI and state management |
| **Frontend Bundler** | Vite | `^6.2.3` | Ultra-fast HMR dev server and production asset bundler |
| **CSS Framework** | Tailwind CSS | `^4.1.14` | Utility-first styling with modern dark/light mode support |
| **Icons & Animation** | Lucide React / Motion | `^0.546.0` / `^12.23.24` | Modern vector icons and fluid UI transitions |
| **Map Rendering** | Leaflet | `^1.9.4` | Open-source interactive map rendering via OpenStreetMap tiles |
| **Backend Framework** | Express.js | `^4.21.2` | RESTful API server routing, middleware, and request handling |
| **Runtime Language** | TypeScript | `~5.8.2` | End-to-end type safety for models, requests, and services |
| **Dev Execution** | tsx | `^4.21.0` | Node.js TypeScript execution without manual compilation steps |
| **Authentication** | jsonwebtoken / bcryptjs | `^9.0.3` / `^3.0.3` | Signed JWT session tokens and cryptographic password hashing |
| **AI Integration** | Google GenAI SDK | `^2.4.0` | Optional Gemini AI recommendations with offline curated fallback |
| **Database** | File-backed JSON Database | Native `fs` | Embedded document store at `backend/data_store.json` |

---

## 3. Exact Database Technology & Storage Mechanism

ExploreIndia uses a **File-Based JSON Document Store** located at [`backend/data_store.json`](file:///c:/Users/satha/Downloads/exploreindia/backend/data_store.json).

### How Persistence Works:
1. **Boot Hydration:** On application startup, [`backend/src/config/db.ts`](file:///c:/Users/satha/Downloads/exploreindia/backend/src/config/db.ts) reads `data_store.json` using `fs.readFileSync` and parses it into an in-memory typed JavaScript object (`db: Database`).
2. **In-Memory Querying:** To ensure instant response times, [`backend/src/services/databaseEngine.ts`](file:///c:/Users/satha/Downloads/exploreindia/backend/src/services/databaseEngine.ts) builds in-memory inverted hash maps (`idIndex`, `cityIndex`, `categoryIndex`, `tokenIndex`) on boot for $O(1)$ lookups.
3. **Write Synchronization:** Whenever a write occurs (e.g. creating a booking, registering a user, submitting a review), `saveDatabase(db)` serializes the updated database state and writes it back to disk synchronously using `fs.writeFileSync`.
4. **Data Durability:** Because writes flush to `data_store.json` on disk, **all saved bookings, trips, and user data remain completely intact when the server restarts**.
5. **No External Server Required:** The project does not require installing or running MySQL, PostgreSQL, or MongoDB daemons, making local setup effortless.

---

## 4. Architecture & Folder Structure

```
exploreindia/
├── client/ (or frontend/)                  # React 19 Frontend Client (Port 3000)
│   ├── public/                             # Static assets & favicon
│   ├── src/
│   │   ├── components/                     # Navbar, Footer, ExploreMap
│   │   ├── services/                       # Centralized API service client (api.ts)
│   │   ├── constants/                      # Default cities, tips, fallback images
│   │   ├── types.ts                        # Frontend TypeScript data interfaces
│   │   ├── App.tsx                         # View controller and state manager
│   │   ├── main.tsx                        # React DOM mounting
│   │   └── index.css                       # Global Tailwind CSS definitions
│   ├── package.json                        # Frontend dependencies & scripts
│   ├── tsconfig.json                       # Frontend TypeScript config
│   └── vite.config.ts                      # Vite build config with /api reverse proxy
│
├── server/ (or backend/)                   # Express 4 Backend Server (Port 5000)
│   ├── src/
│   │   ├── config/                         # DB path resolver (db.ts), env loader (env.ts)
│   │   ├── controllers/                    # Domain controllers (auth, booking, place, trip, admin)
│   │   ├── middleware/                     # JWT auth guard, error handler
│   │   ├── models/                         # Backend TypeScript contracts (types.ts)
│   │   ├── routes/                         # Express route definitions
│   │   ├── services/                       # DatabaseEngine, locationService, imageService
│   │   ├── app.ts                          # Express app configuration & middleware
│   │   └── server.ts                       # HTTP listener startup
│   ├── data_store.json                     # Canonical persistent JSON database file
│   ├── package.json                        # Backend dependencies & scripts
│   ├── tsconfig.json                       # Backend TypeScript config
│   └── .env.example                        # Backend environment template
│
├── docs/
│   ├── ARCHITECTURE.md                     # Layered system architecture & design
│   ├── DATABASE.md                         # Detailed database documentation & ERD
│   └── API_DOCUMENTATION.md                # REST API endpoints reference
│
├── scripts/
│   ├── dev.cjs                             # Concurrent backend + frontend Windows launcher
│   └── seed_db.cjs                         # Database seeder script
│
├── tests/
│   └── test_flow.cjs                       # 17-step automated end-to-end integration test
│
├── .env.example                            # Root environment template
├── .gitignore                              # Git exclusion rules
├── package.json                            # Workspace root orchestration scripts
└── README.md                               # Comprehensive project documentation
```

---

## 5. Database Schema & Collections

The JSON document database contains 9 typed collections:

```typescript
export interface Database {
  users: User[];
  places: Place[];
  bookings: Booking[];
  trips: Trip[];
  reviews: Review[];
  cities: CityInfo[];
  travelTips: TravelTip[];
  searchHistory: SearchHistory[];
  notifications: Notification[];
}
```

### Key Entity Schemas

#### Booking Record (`db.bookings`)
```typescript
interface Booking {
  id: string;              // e.g. "b-mv3d46qh-qkmmvh"
  userId: string;          // Foreign reference to User.id
  placeId: string;         // Foreign reference to Place.id
  placeName: string;       // e.g. "Taj Exotica Resort & Spa"
  placePhoto: string;      // Destination thumbnail image URL
  placeType: PlaceType;    // "hotel" | "resort" | "attraction" | "restaurant"
  city: string;            // City name
  date: string;            // Check-in date (YYYY-MM-DD)
  dateOut: string;         // Check-out date (YYYY-MM-DD)
  checkIn: string;         // Alias matching check-in date
  checkOut: string;        // Alias matching check-out date
  guests: number;          // Guest count (1 to 20)
  time?: string;           // Optional reservation time
  roomType: string;        // e.g. "Deluxe Room", "Sea View Suite"
  totalPrice: string;      // e.g. "₹25,000 per night"
  status: string;          // "confirmed" | "cancelled"
  createdAt: string;       // ISO 8601 timestamp
}
```

#### Place Record (`db.places`)
```typescript
interface Place {
  id: string;              // Unique identifier (e.g. "p-goa-1")
  name: string;            // Destination / Hotel name
  type: PlaceType;         // "hotel" | "resort" | "restaurant" | "attraction" | "temple"
  category: string;        // Category filter tag
  rating: number;          // Average rating (1.0 to 5.0)
  reviewCount: number;     // Number of verified reviews
  priceLevel: number;      // 1 to 4 ($ to $$$$)
  priceRange?: string;     // e.g. "₹18,000 - ₹32,000 per night"
  address: string;         // Full physical address
  city: string;            // City name
  state: string;           // State name
  coordinates: { lat: number; lng: number }; // Coordinates for maps
  photos: string[];        // Array of verified image URLs
  facilities: string[];    // Array of amenities (WiFi, Pool, AC, etc.)
  rooms?: Array<{ type: string; price: string; amenities: string[] }>;
}
```

---

## 6. Hotel Booking Lifecycle (Frontend to Storage)

```
1. USER CLICKS "BOOK NOW"
   - User navigates to a hotel in Details view.
   - Form inputs: Check-In Date, Check-Out Date, Guest Count.

2. FRONTEND CLIENT VALIDATION (App.tsx)
   - Verifies user authentication (opens Login modal if unauthenticated).
   - Validates that check-in date is provided and not in the past.
   - Verifies check-out date is strictly after check-in date.
   - Disables submit button and shows "Reserving..." state.

3. SERVICE LAYER (frontend/src/services/api.ts)
   - Invokes `api.bookings.create(token, payload)`.
   - Attaches `Authorization: Bearer <token>` in HTTP request headers.
   - Dispatches `POST /api/bookings` via Vite proxy (`http://localhost:3000/api/...` -> `http://localhost:5000/api/...`).

4. AUTHENTICATION GUARD (backend/src/middleware/auth.ts)
   - `authenticateToken` middleware verifies the signed JWT token.
   - Decodes user identity (`id`, `email`, `role`) and attaches it to `req.user`.

5. SERVER-SIDE VALIDATION & CONSTRAINTS (backend/src/controllers/bookingController.ts)
   - Validates presence of `placeId`, `date`, and `guests`.
   - Validates that date is valid format and not in the past.
   - Validates that check-out date > check-in date.
   - Sanitizes and validates guest count (must be integer between 1 and 20).
   - Verifies place exists in database.
   - CONFLICT CHECK: Prevents duplicate active reservations for the same user, place, and date.

6. PERSISTENCE ENGINE (backend/src/config/db.ts)
   - Pushes new booking object into in-memory `db.bookings`.
   - Calls `saveDatabase(db)` which executes `fs.writeFileSync('backend/data_store.json', ...)`.
   - If writing fails, rolls back memory state and returns HTTP 500.

7. UI CONFIRMATION & PROFILE UPDATE
   - Returns HTTP 201 Created with the persisted booking object.
   - Frontend displays confirmation banner: "Reservation Confirmed!".
   - Booking record appears immediately in Profile -> "My Bookings" tab.
```

---

## 7. Prerequisites & Local Setup (Windows & VS Code)

### Prerequisites
* **Node.js**: v20 or newer (Run `node -v` to verify).
* **npm**: v10 or newer (Run `npm -v` to verify).
* **Git**: (Run `git --version` to verify).
* **VS Code** (Recommended editor).

### Step-by-Step Setup Guide

#### Step 1: Open the Project in VS Code
Open VS Code, press `Ctrl + K, Ctrl + O`, and select the `exploreindia` project folder.

#### Step 2: Install Workspace Dependencies
Open the VS Code Terminal (`Ctrl + ~`) and install all packages:
```powershell
# Install root orchestration tools
npm install

# Install backend dependencies
npm --prefix backend install

# Install frontend dependencies
npm --prefix frontend install
```

#### Step 3: Configure Environment Variables
Copy the provided `.env.example` file to create your active `.env` file:
```powershell
# Copy root env template
Copy-Item .env.example .env

# Copy backend env template
Copy-Item backend\.env.example backend\.env
```
*(No edits are required: default fallback credentials work automatically!)*

#### Step 4: Verify Database Seeding (Optional)
The project comes pre-seeded with 490+ places and 1,280+ cities. If you ever need to re-seed:
```powershell
npm run seed
```

#### Step 5: Start the Development Server
Run the single unified start command from the project root:
```powershell
npm run dev
```

* Both servers will start simultaneously:
  * **Frontend Client:** `http://localhost:3000` (Open in browser)
  * **Backend API Server:** `http://localhost:5000`

---

## 8. Environment Variable Configuration

### Root `.env` (Project Root)
```ini
# Port for backend Express server
PORT=5000

# Secret key for signing and verifying JWT tokens
JWT_SECRET=explore_india_secret_key_1337

# Optional: Google Gemini API Key (If omitted, offline curated database is used)
GEMINI_API_KEY=

# Base URL for backend server
APP_URL=http://localhost:5000

# Optional: Google Maps Platform key (If omitted, OpenStreetMap / Leaflet is used)
GOOGLE_MAPS_PLATFORM_KEY=
```

### Frontend `.env` (`frontend/.env`)
```ini
# Optional: Explicit backend API URL (Leave blank to use Vite development proxy)
VITE_API_BASE_URL=
```

### Pre-configured Default Test Credentials
| Account Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@exploreindia.com` | `admin123` | Full access: Admin analytics, inventory CRUD, review moderation |
| **Standard User** | `sathanidineshkumar@gmail.com` | `user123` | Bookings, favorites, trip planner, review submissions |

---

## 9. Available Scripts & Startup Commands

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | **Start Full Application:** Concurrently launches backend (5000) and frontend (3000) with colored logs. |
| `npm run dev:frontend` | Starts only the Vite frontend dev server on port 3000. |
| `npm run dev:backend` | Starts only the Express backend server on port 5000 using `tsx`. |
| `npm run lint` | Performs strict TypeScript type checks across both frontend and backend (`tsc --noEmit`). |
| `npm test` | Executes the 17-step automated end-to-end integration test suite. |
| `npm run seed` | Re-seeds the database with curated Indian places, cities, and landmarks. |
| `npm run build` | Compiles production assets: builds Vite frontend, copies to `dist/`, bundles `api/index.js`, and builds backend via `tsc`. |
| `npm start` | Starts the compiled production backend server from `dist/server.js`. |
| `npm run clean` | Removes compiled `dist/` folders. |

---

## 10. API Reference

### Authentication Endpoints (`/api/auth`)

#### `POST /api/auth/login`
Authenticates a user and issues a signed JWT token.
* **Request Body:**
  ```json
  {
    "email": "sathanidineshkumar@gmail.com",
    "password": "user123",
    "rememberMe": true
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "user": {
      "id": "user-id",
      "name": "Dinesh Kumar",
      "email": "sathanidineshkumar@gmail.com",
      "role": "user",
      "isVerified": true,
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

---

### Bookings Endpoints (`/api/bookings`)

#### `POST /api/bookings`
Creates a hotel or tourist spot reservation. Requires `Authorization: Bearer <token>`.
* **Request Body:**
  ```json
  {
    "placeId": "p-goa-1",
    "date": "2026-11-10",
    "dateOut": "2026-11-15",
    "guests": 2,
    "time": "14:00",
    "roomType": "Deluxe Sea View Room",
    "totalPrice": "₹28,000"
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "id": "b-mv3d46qh-qkmmvh",
    "userId": "user-id",
    "placeId": "p-goa-1",
    "placeName": "Taj Exotica Resort & Spa",
    "placePhoto": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600",
    "placeType": "resort",
    "city": "Goa",
    "date": "2026-11-10",
    "dateOut": "2026-11-15",
    "checkIn": "2026-11-10",
    "checkOut": "2026-11-15",
    "guests": 2,
    "time": "14:00",
    "roomType": "Deluxe Sea View Room",
    "totalPrice": "₹28,000",
    "status": "confirmed",
    "createdAt": "2026-10-11T05:07:24.000Z"
  }
  ```
* **Error Response (409 Conflict):**
  ```json
  {
    "error": "You already have a confirmed reservation for this destination on this date"
  }
  ```

#### `GET /api/bookings`
Returns all reservations belonging to the authenticated user.
* **Headers:** `Authorization: Bearer <token>`
* **Response (200 OK):**
  ```json
  [
    {
      "id": "b-mv3d46qh-qkmmvh",
      "placeName": "Taj Exotica Resort & Spa",
      "date": "2026-11-10",
      "dateOut": "2026-11-15",
      "guests": 2,
      "status": "confirmed"
    }
  ]
  ```

#### `DELETE /api/bookings/:id`
Cancels and removes a user reservation.
* **Headers:** `Authorization: Bearer <token>`
* **Response (200 OK):**
  ```json
  {
    "success": true
  }
  ```

---

### Discovery Endpoints (`/api/discover`)

#### `POST /api/discover`
Discovers places matching city queries with multi-category counts and pagination.
* **Request Body:**
  ```json
  {
    "query": "Hyderabad",
    "page": 1,
    "limit": 24,
    "category": "all"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "city": {
      "name": "Hyderabad",
      "state": "Telangana",
      "lat": 17.3850,
      "lng": 78.4867,
      "image": "https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=1600"
    },
    "places": [ ... ],
    "total": 17,
    "categoryCounts": {
      "all": 17,
      "hotel": 4,
      "restaurant": 4,
      "temple": 2,
      "heritage": 5
    }
  }
  ```

---

## 11. Testing & Quality Verification

ExploreIndia includes an automated integration test suite covering 17 critical system flows:
```powershell
npm test
```
The test verifies:
1. API Health Check (`/api/health`)
2. City Discovery (`/api/discover` for Hyderabad)
3. User Authentication (`/api/auth/login`)
4. Favorites Toggling (`/api/favorites/toggle`)
5. Review Submission (`/api/reviews`)
6. Trip Itinerary Creation (`/api/trips`)
7. Day-by-day Itinerary Destination Addition
8. Hotel Booking Lifecycle (`POST /api/bookings` & duplicate prevention)
9. Admin Authentication & Role Guards
10. Admin Analytics Statistics Aggregation
11. Admin Review Moderation Queue Approval
12. User Profile Retrieval
13. City Hero Photo Uniqueness across 5 major Indian cities
14. In-Page Landmark Image Uniqueness
15. Reverse Geocoding via OpenStreetMap Nominatim
16. Real-time Weather Fetch via Open-Meteo
17. Dynamic Landmark Photo Matching

---

## 12. Common Errors & Troubleshooting

| Error | Cause | Resolution |
| :--- | :--- | :--- |
| `ECONNREFUSED 127.0.0.1:5000` | Backend server is not running | Start backend with `npm run dev` or `npm --prefix backend run dev`. |
| `Access token is required` (401) | Calling protected API without token | Log in via the Navbar button to store your JWT token. |
| `Admin access required` (403) | Logged in as standard user on admin route | Log out and log in as `admin@exploreindia.com` (password: `admin123`). |
| `Check-out date must be after check-in date` | Selected invalid date range | Ensure check-out date is later than check-in date in the booking form. |
| `You already have a confirmed reservation...` | Duplicate booking submission | Check "My Bookings" in your profile; you already reserved this date. |

---

## 13. Deployment Instructions

### Option 1: Vercel (Frontend & Serverless API)
The repository includes `vercel.json` and `api/[...all].ts` for one-click Vercel deployment:
1. Push repository to GitHub.
2. Import project into Vercel.
3. Add environment variables: `JWT_SECRET` and optional `GEMINI_API_KEY`.
4. Deploy.

### Option 2: Render / Railway / Ubuntu VPS (Node.js Server)
1. Build the production package: `npm run build`.
2. Start the Express server: `npm start`.
3. Set environment variable `PORT=5000`.

---

## 14. Technical Interview Defense Guide

Here are 10 likely technical interview questions and answers tailored to this project:

### Q1: What database does ExploreIndia use and how does it persist data?
> **Answer:** ExploreIndia uses an embedded, file-backed JSON document store located at `backend/data_store.json`. On server startup, `loadDatabase()` reads and parses the JSON file into memory as a typed object. Any create, update, or delete operations (like saving a hotel booking) modify this memory state and immediately write back to disk via `fs.writeFileSync`. This gives us persistence across server restarts with zero database daemon setup.

### Q2: Why did you choose a file-based JSON store instead of MySQL or MongoDB?
> **Answer:** For an academic and portfolio project, portability and developer onboarding are paramount. Using an embedded JSON store means anyone evaluating the project can clone the repository and run `npm run dev` instantly without needing Docker, MySQL, or MongoDB services running locally. For scale, the repository cleanly abstracts database access behind a service layer (`db.ts` and `databaseEngine.ts`), meaning transitioning to MongoDB or PostgreSQL would only require swapping the query methods in that layer without touching the controllers or frontend.

### Q3: How do you prevent slow searches when querying hundreds of places stored in JSON?
> **Answer:** We implemented an in-memory indexing engine in `databaseEngine.ts`. On boot, it constructs multiple hash map indexes (`Map<string, Place>`, `cityIndex`, `categoryIndex`, and a full-text `tokenIndex`). Instead of scanning the entire array on every request ($O(N)$), city and category lookups take constant $O(1)$ time by intersecting indexed ID sets.

### Q4: How is authentication implemented in ExploreIndia?
> **Answer:** We use stateless JSON Web Tokens (JWT) and `bcryptjs`. When a user registers, their password is encrypted using a cryptographic salt with 10 rounds of hashing. On login, `bcrypt.compare` verifies the credentials. If valid, the backend signs a JWT containing the user ID, email, and role (`user` or `admin`) with a secret key. The frontend stores this token and passes it in the `Authorization: Bearer <token>` header for protected routes.

### Q5: How do you protect administrative routes like approving reviews or deleting users?
> **Answer:** We use an Express middleware chain. The route is guarded by `authenticateToken`, which verifies and decodes the JWT. It is followed by `requireAdmin` middleware, which checks if `req.user.role === 'admin'`. If not, it halts the request with an HTTP 403 Forbidden status code.

### Q6: Walk me through the hotel booking validation flow.
> **Answer:** Validation happens in two layers:
> 1. **Client-side (React):** We ensure dates are selected, check-in is not in the past, and check-out is strictly after check-in.
> 2. **Server-side (Express):** In `bookingController.ts`, we validate date formats, verify that the hotel exists, sanitize guest count between 1 and 20, and enforce a duplicate constraint to prevent overlapping confirmed bookings on the same date for the same user.

### Q7: What happens if Google Gemini AI fails or is not configured?
> **Answer:** The system is designed to be fully fault-tolerant. In `placeController.ts` and `geoDataService.ts`, the application checks if `GEMINI_API_KEY` is present. If absent or if an external network timeout occurs, it automatically falls back to our curated offline geographic database covering 90+ Indian cities and 490+ verified destinations. The user never sees a broken page.

### Q8: How does the frontend communicate with the backend during development?
> **Answer:** We use a reverse proxy in `vite.config.ts`. In development, the React frontend runs on port 3000 and the Express backend runs on port 5000. Any frontend request directed to `/api/*` is transparently forwarded by Vite to `http://localhost:5000/api/*`. This eliminates CORS issues in development and allows the frontend to use clean, relative API URLs.

### Q9: How do you ensure image uniqueness across destination cards and cities?
> **Answer:** We built a dedicated `imageService.ts` with a disjoint landmark registry and a stable hashing algorithm (`CITY_LANDMARK_REGISTRY`). Major cities (Delhi, Mumbai, Bangalore, Hyderabad, Chennai) have curated hero photo mappings, and cards within the same search page are deduplicated using a photo set tracker to ensure no two cards display duplicate photos.

### Q10: If this application had to support 100,000 daily bookings in production, what architectural changes would you make?
> **Answer:** 
> 1. Replace the file-based JSON store with a distributed ACID-compliant relational database like PostgreSQL with connection pooling.
> 2. Add an indexing and caching layer using Redis for hot destination searches and session management.
> 3. Implement database row locking or transactional isolation (`SERIALIZABLE`) to handle race conditions on hotel room inventory.
> 4. Decouple long-running operations (like confirmation emails or booking receipt PDFs) into background message queues using BullMQ or RabbitMQ.
