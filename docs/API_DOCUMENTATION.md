# ExploreIndia REST API Reference

Base URL (Development): `http://localhost:5000/api`

---

## 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Public | Register new user account with hashed password and OTP |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials and return JWT token |
| `POST` | `/api/auth/verify-otp` | Public | Verify 6-digit registration OTP code |
| `POST` | `/api/auth/forgot-password` | Public | Generate password reset OTP code |
| `POST` | `/api/auth/reset-password` | Public | Reset account password using verification OTP |

### POST `/api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "sathanidineshkumar@gmail.com",
    "password": "user123"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "user": {
      "id": "user-id",
      "name": "Dinesh Kumar",
      "email": "sathanidineshkumar@gmail.com",
      "role": "user",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

---

## 2. Places & Discovery Endpoints (`/api`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/discover` | Public | AI/offline search for places by Indian city or landmark |
| `GET` | `/api/places/trending` | Public | List all top-rated places across India |
| `GET` | `/api/places/:id` | Public | Fetch detailed place information with approved reviews |
| `GET` | `/api/hotels/famous` | Public | Retrieve curated iconic Indian luxury heritage hotels |
| `GET` | `/api/cities/trending` | Public | Retrieve curated list of top Indian travel cities |
| `GET` | `/api/tips` | Public | Retrieve curated Indian travel tips and recommendations |

### POST `/api/discover`
- **Request Body**:
  ```json
  {
    "query": "Hyderabad",
    "lat": 17.3850,
    "lng": 78.4867
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "places": [ ... ],
    "city": { "name": "Hyderabad", "state": "Telangana", "lat": 17.3850, "lng": 78.4867 },
    "metadata": { "cityName": "Hyderabad" }
  }
  ```

---

## 3. User, Favorites & Reviews (`/api`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/user/profile` | Protected | Fetch current user profile, favorites, and search history |
| `POST` | `/api/user/profile/update`| Protected | Update user profile name and avatar |
| `POST` | `/api/user/clear-history` | Protected | Clear user search history |
| `POST` | `/api/favorites/toggle` | Protected | Toggle a place in user's saved favorites |
| `POST` | `/api/reviews` | Protected | Submit a user review (queued for admin approval) |
| `GET` | `/api/notifications` | Protected | Fetch user notifications |
| `POST` | `/api/notifications/read-all`| Protected | Mark all user notifications as read |

---

## 4. Trips & Bookings (`/api`)

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

---

## 5. Admin Moderation & Analytics (`/api/admin`)

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
| `POST` | `/api/admin/reviews/approve/:id` | Admin Only | Approve user review and recalculate place rating |
| `DELETE`| `/api/admin/reviews/:id` | Admin Only | Reject and delete a user review |
