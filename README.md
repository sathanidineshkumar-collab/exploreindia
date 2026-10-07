# 🇮🇳 ExploreIndia — Travel Discovery, Itinerary & Booking Platform

ExploreIndia is an Indian tourism web application that enables travelers to explore premier destinations, luxury hotels, authentic local restaurants, heritage resorts, temples, and cafes across India. It features smart discovery powered by Gemini AI with offline geographical fallbacks, an interactive map, a multi-day trip planner, hotel bookings, and a moderation/analytics admin dashboard.

---

## 1. Project Overview
- **Name**: ExploreIndia
- **Primary Use-Case**: Discover India's tourist attractions, hotels, restaurants, and temples with real-time search, interactive maps, itineraries, and reservations.
- **Audience**: Travelers exploring India and platform administrators managing listings and moderating reviews.
- **Architecture**: Modular Client-Server Architecture (separated into `frontend/` and `backend/`).

---

## 2. Technologies Used

| Category | Technology / Library |
| :--- | :--- |
| **Frontend Framework** | React 19 (`react`, `react-dom`) |
| **Frontend Build Tool** | Vite 6 (`vite`, `@vitejs/plugin-react`) |
| **Styling & Icons** | Tailwind CSS v4, Lucide React (`lucide-react`), Motion (`motion`) |
| **Backend Runtime & Framework** | Node.js (v20+), Express 4 (`express`) |
| **Language & Execution** | TypeScript 5.8, executed via `tsx` |
| **Authentication & Security** | JWT (`jsonwebtoken`), Bcrypt (`bcryptjs`) |
| **Artificial Intelligence** | Google GenAI SDK (`@google/genai`) with Gemini 2.5 Flash |
| **Mapping & Geocoding** | OpenStreetMap / Leaflet, Nominatim Geocoding API |
| **Database** | File-based JSON Database (`data_store.json`) |

---

## 3. Frontend Technology
- **React 19**: Modern component architecture using hooks (`useState`, `useEffect`, `useMemo`).
- **Vite 6**: Fast development build tool with built-in development proxy (`/api` -> backend).
- **Tailwind CSS v4**: Utility-first CSS styling with custom theme variables in `src/index.css`.
- **Lucide React**: Modern iconography for category badges, maps, stars, and controls.
- **Motion**: Fluid UI transitions and micro-interactions.
- **TypeScript**: Static typing for components, state, and API service interfaces.

---

## 4. Backend Technology
- **Node.js + Express 4**: RESTful API server with custom route handlers and middleware.
- **TypeScript + TSX**: Strongly-typed backend code executed seamlessly without separate build steps in development.
- **JWT (JSON Web Tokens)**: Stateless authorization for authenticated user and admin endpoints.
- **Bcrypt.js**: Cryptographic password hashing with salt generation.
- **Google GenAI**: AI concierge queries using structured JSON schema output.
- **CORS Middleware**: Native cross-origin resource sharing allowing requests from frontend ports (3000, 5173).

---

## 5. Database
- **Type**: File-based persistent JSON Database (`data_store.json`).
- **Persistence Engine**: Synchronous atomic file reads and writes (`loadDatabase()` / `saveDatabase()`) via Node.js `fs`.
- **Pre-seeded Collections**:
  - `cities`: 1,280+ curated Indian cities with coordinates, images, and descriptions.
  - `places`: 196+ curated Indian hotels, resorts, restaurants, temples, and attractions.
  - `users`: Registered users with hashed passwords and role flags (`user` vs `admin`).
  - `reviews`: Community reviews with moderation flags (`approved: true/false`).
  - `trips`: Custom multi-day trip itineraries and daily notes.
  - `bookings`: Hotel/resort room reservations with status tracking.
  - `notifications`: User notifications for review approvals and platform alerts.
  - `searchHistory`: User search queries for analytics and personalized history.

---

## 6. Project Folder Structure

```
exploreindia/
├── frontend/                               # Independent Frontend Client (Port 3000)
│   ├── public/                             # Static public assets
│   ├── src/
│   │   ├── components/                     # Reusable UI components (Navbar, Footer, ExploreMap)
│   │   ├── services/                       # Strongly-typed API client service (api.ts)
│   │   ├── App.tsx                         # View router & state coordinator
│   │   ├── main.tsx                        # React application root mount
│   │   ├── index.css                       # Global Tailwind CSS definitions
│   │   ├── constants.ts                    # Fallback SVG images and avatars
│   │   ├── types.ts                        # TypeScript interfaces for data models
│   │   └── vite-env.d.ts                   # Vite environment type declarations
│   ├── index.html                          # Single-page application entry HTML
│   ├── package.json                        # Frontend dependencies & scripts
│   ├── tsconfig.json                       # Frontend TypeScript configuration
│   ├── vite.config.ts                      # Vite build config with /api proxy to :5000
│   └── .env.example                        # Frontend environment variables template
│
├── backend/                                # Independent Backend Server (Port 5000)
│   ├── src/
│   │   ├── config/                         # DB access layer & env loader
│   │   ├── controllers/                    # 8 domain-specific request controllers
│   │   ├── middleware/                     # JWT auth guard & central error handler
│   │   ├── models/                         # Backend data contracts & schemas
│   │   ├── routes/                         # Express REST route aggregators
│   │   ├── services/                       # Gemini AI & offline Geo services
│   │   └── server.ts                       # Express setup, CORS, and port listener
│   ├── data_store.json                     # Active persistent database file
│   ├── package.json                        # Backend dependencies & scripts
│   ├── tsconfig.json                       # Backend TypeScript configuration
│   ├── .env                                # Backend environment configuration
│   └── .env.example                        # Backend environment variables template
│
├── scripts/                                # Operational & developer tooling
│   ├── dev.cjs                             # Cross-platform concurrent dev launcher
│   └── seed_db.cjs                         # Database seed & hydration script
│
├── tests/                                  # Automated test suites
│   └── test_flow.cjs                       # 12-step end-to-end integration test
│
├── docs/                                   # Architectural & API specifications
│   ├── ARCHITECTURE.md                     # Deep-dive architectural documentation
│   └── API_DOCUMENTATION.md                # Full REST API endpoint reference
│
├── archive/                                # Archived legacy monolith files
│   ├── server.legacy.ts                    # Archived monolithic server
│   └── extract_geo.legacy.cjs              # Archived migration script
│
├── package.json                            # Workspace root orchestration scripts
├── tsconfig.json                           # Root TypeScript workspace configuration
├── .gitignore                              # Git exclusion rules
└── README.md                               # Comprehensive documentation
```

---

## 7. Frontend Responsibilities
- **Views & UI Flow**:
  - `home`: Hero search input with category quick-chips, trending Indian cities, luxury heritage hotel showcases, travel guides.
  - `search`: Filterable results page with tabs (All, Tourism, Stays, Food, Temples), price range, minimum rating, amenities, and split-screen interactive map.
  - `details`: Rich place view featuring high-definition photo galleries, TripAdvisor green bubble ratings, amenities, address, phone/website, reviews list, and action buttons (Book, Add to Trip, Add Review).
  - `trips`: Trip planner allowing travelers to build multi-day itineraries, add/remove places per day, and write notes.
  - `profile`: User dashboard showing personal details, saved favorite places, and recent search history.
  - `admin`: Admin portal with platform KPI metrics, places inventory CRUD, user moderation, and review approval queue.
- **Components**:
  - `Navbar`: Global header with search trigger, notification badge counter with popup list, theme toggle, and profile drop-down.
  - `Footer`: Links, quick categories, newsletter subscription, and copyright.
  - `ExploreMap`: Leaflet/OpenStreetMap wrapper rendering place coordinates, interactive popups, and route paths.
- **Service Layer**:
  - `src/services/api.ts` provides strongly typed, promise-based API functions.

---

## 8. Backend Responsibilities
- **Routes & Controllers**: Clean separation between routing definitions (`routes/*.ts`) and request handling logic (`controllers/*.ts`).
- **Services**:
  - `geminiService.ts`: Communicates with Google's Gemini AI to generate contextual Indian travel recommendations when online.
  - `geoDataService.ts`: Provides zero-latency offline fallbacks, landmark mappings, and mock generation for 90+ Indian cities.
- **Middleware**:
  - `authenticateToken`: Validates incoming Bearer JWT tokens in the `Authorization` header.
  - `requireAdmin`: Enforces role-based access control, ensuring only users with `role: "admin"` access moderation endpoints.
  - `errorHandler`: Catches unhandled errors and returns structured JSON responses.
- **Data Persistence**:
  - Atomic read and write operations via `loadDatabase()` and `saveDatabase()`.

---

## 9. Complete API Endpoint List

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Public | Register new user account with hashed password and OTP |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials and return JWT token |
| `POST` | `/api/auth/verify-otp` | Public | Verify 6-digit registration OTP code |
| `POST` | `/api/auth/forgot-password` | Public | Generate password reset OTP code |
| `POST` | `/api/auth/reset-password` | Public | Reset account password using verification OTP |

### Places & Discovery (`/api`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/discover` | Public | AI/offline search for places by Indian city or landmark |
| `GET` | `/api/places/trending` | Public | List all top-rated places across India |
| `GET` | `/api/places/:id` | Public | Fetch detailed place information with approved reviews |
| `GET` | `/api/hotels/famous` | Public | Retrieve curated iconic Indian luxury heritage hotels |
| `GET` | `/api/cities/trending` | Public | Retrieve curated list of top Indian travel cities |
| `GET` | `/api/tips` | Public | Retrieve curated Indian travel tips and recommendations |

### User, Favorites & Reviews
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/user/profile` | Protected | Fetch current user profile, favorites, and search history |
| `POST` | `/api/user/profile/update`| Protected | Update user profile name and avatar |
| `POST` | `/api/user/clear-history` | Protected | Clear user search history |
| `POST` | `/api/favorites/toggle` | Protected | Toggle a place in user's saved favorites |
| `POST` | `/api/reviews` | Protected | Submit a user review (queued for admin approval) |
| `GET` | `/api/notifications` | Protected | Fetch user notifications |
| `POST` | `/api/notifications/read-all`| Protected | Mark all user notifications as read |

### Trips & Bookings
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/trips` | Protected | Fetch all user trip itineraries |
| `POST` | `/api/trips` | Protected | Create a new multi-day trip |
| `DELETE`| `/api/trips/:id` | Protected | Delete a trip |
| `POST` | `/api/trips/:id/add-place`| Protected | Add a destination to a specific trip day |
| `POST` | `/api/trips/:id/remove-place`| Protected | Remove a destination from a specific trip day |
| `POST` | `/api/trips/:id/update-notes`| Protected | Update notes for a specific trip day |
| `GET` | `/api/bookings` | Protected | Fetch all user hotel room reservations |
| `POST` | `/api/bookings` | Protected | Book a hotel room reservation |
| `DELETE`| `/api/bookings/:id` | Protected | Cancel a reservation |

### Admin Moderation & Analytics (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/analytics` | Admin Only | Platform statistics (users, places, reviews, search counts) |
| `GET` | `/api/admin/places` | Admin Only | Full place inventory list |
| `POST` | `/api/admin/places` | Admin Only | Create a new place listing |
| `PUT` | `/api/admin/places/:id` | Admin Only | Update an existing place listing |
| `DELETE`| `/api/admin/places/:id` | Admin Only | Delete a place listing |
| `GET` | `/api/admin/users` | Admin Only | List all registered platform users |
| `DELETE`| `/api/admin/users/:id` | Admin Only | Delete a user account (except root admin) |
| `GET` | `/api/admin/reviews/pending` | Admin Only | Moderation queue for user reviews |
| `POST` | `/api/admin/reviews/approve/:id` | Admin Only | Approve user review and update place rating |
| `DELETE`| `/api/admin/reviews/:id` | Admin Only | Reject and delete a user review |

---

## 10. Database Information
- **Location**: `backend/data_store.json`
- **Format**: JSON structured object
- **Credentials**: No external database credentials or passwords required.
- **Default Test Accounts**:
  - **Administrator**:
    - Email: `admin@exploreindia.com`
    - Password: `admin123`
  - **Regular User**:
    - Email: `sathanidineshkumar@gmail.com`
    - Password: `user123`

---

## 11. Environment Variables Required

### Backend (`backend/.env`):
```ini
PORT=5000
JWT_SECRET=explore_india_secret_key_1337
GEMINI_API_KEY=YOUR_GEMINI_API_KEY     # Optional: offline engine used if empty
APP_URL=http://localhost:5000
```

### Frontend (`frontend/.env`):
```ini
VITE_API_BASE_URL=                    # Optional: leave blank to use Vite proxy
GOOGLE_MAPS_PLATFORM_KEY=            # Optional: OpenStreetMap is default fallback
```

---

## 12. Installation Steps

Clone or navigate to the project directory:

```bash
# 1. Install workspace dependencies
npm install

# 2. Install backend dependencies
cd backend && npm install && cd ..

# 3. Install frontend dependencies
cd frontend && npm install && cd ..
```

---

## 13. Running the Project

### Start Full Stack (Recommended)
From the project root:
```bash
npm run dev
```
*Concurrently starts the Backend on `http://localhost:5000` and the Frontend on `http://localhost:3000` with unified terminal logs.*

### Start Individual Services
```bash
# Frontend only (port 3000)
npm run dev:frontend

# Backend only (port 5000)
npm run dev:backend
```

### Running Tests & Database Seeding
```bash
# Run automated 12-step integration test suite
npm test

# Re-seed curated places & cities into database
npm run seed

# Build production assets for frontend & backend
npm run build
```

---

## 15. How Frontend Connects to Backend

1. **Development Proxy**:
   In `frontend/vite.config.ts`, Vite is configured with an automated reverse proxy:
   ```ts
   server: {
     port: 3000,
     proxy: {
       '/api': {
         target: 'http://localhost:5000',
         changeOrigin: true
       }
     }
   }
   ```
   When the React app makes a call like `fetch('/api/discover')`, the Vite server transparently forwards it to `http://localhost:5000/api/discover`.

2. **CORS Handling**:
   The backend includes built-in CORS headers permitting requests from `http://localhost:3000` and `http://localhost:5173`.

3. **Authentication**:
   When a user logs in, the backend returns a signed JWT token. The frontend stores this token and passes it in the HTTP headers:
   ```
   Authorization: Bearer <jwt_token>
   ```

---

## 16. Common Errors and Solutions

| Error | Root Cause | Solution |
| :--- | :--- | :--- |
| `ECONNREFUSED 127.0.0.1:5000` | Backend server is not running | Start the backend server using `npm run dev:backend` or `cd backend && npm run dev`. |
| `Access token is required` (401) | Protected endpoint called without JWT | Ensure the user is logged in and `Bearer <token>` is present in the `Authorization` header. |
| `Admin access required` (403) | Non-admin user accessing `/api/admin/*` | Log in with the administrator account (`admin@exploreindia.com`). |
| `GEMINI_API_KEY is not set` | Missing Gemini key | The application automatically falls back to the curated offline engine covering 90+ Indian cities. To enable live Gemini generation, add your API key in `backend/.env`. |
| `Port 5000 already in use` | Another process is occupying port 5000 | Set `PORT=5001` in `backend/.env` and update the proxy target in `frontend/vite.config.ts`. |
