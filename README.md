# StoreScore | Role-Based Store Rating & Analytics Platform 🏪⭐

StoreScore is a full-stack, role-based store rating and management platform. It provides dedicated experiences for **Platform Administrators**, **Store Owners**, and **Normal Users**, enabling store discovery, verified 1–5 star ratings, real-time business metrics, and centralized administrative controls.

---

## 🌐 Live Deployments & Demo

- **Frontend (Vercel):** [https://storescore-harshit.vercel.app](https://storescore-harshit.vercel.app)

### 🔑 Demo Accounts (Pre-Seeded)

| Role | Email | Password | Access / Dashboard View |
|---|---|---|---|
| 👑 **Administrator** | `admin@storescore.com` | `DemoPassword123!` | Global platform statistics, user creation, store registration, and sorting/filtering tables. |
| 🏪 **Store Owner** | `owner@storescore.com` | `DemoPassword123!` | Store analytics dashboard (*Apex Electronics*), average rating, and customer review breakdown. |
| 👤 **Normal User** | `user@storescore.com` | `DemoPassword123!` | Store catalog, search by name/address, and interactive 1–5 star rating submission. |

---

## 🛠️ Tech Stack

### Frontend
- **Framework & Build Tool:** React 19, Vite
- **Styling:** Tailwind CSS v4
- **Routing & Client State:** React Router v7
- **HTTP Client:** Axios (centralized client with JWT request interceptors)

### Backend
- **Runtime & Framework:** Node.js, Express.js 5
- **Database Driver:** `pg` (node-postgres) with connection pooling
- **Authentication & Security:** JSON Web Tokens (`jsonwebtoken`), password hashing (`bcrypt`), and CORS middleware
- **Serverless Adapter:** `serverless-http` (AWS Lambda compatibility wrapper)

### Database & Cloud Infrastructure
- **Database:** PostgreSQL (Hosted on Supabase with IPv4 Connection Pooler)
- **Serverless Compute:** AWS Lambda (`Node.js 20.x`)
- **API Gateway:** AWS API Gateway (HTTP API with CORS and proxy integration)
- **CI/CD Automation:** GitHub Actions (Automated build, package, and deployment on push to `main`)
- **Frontend Hosting:** Vercel (Edge CDN with SPA route rewrites)

---

## 🏛️ High-Level Architecture

```
                               ┌─────────────────────────────┐
                               │     Client (React + Vite)   │
                               │      Hosted on Vercel CDN   │
                               └──────────────┬──────────────┘
                                              │
                                    HTTPS Requests + JWT
                                              │
                                              ▼
                               ┌─────────────────────────────┐
                               │   AWS API Gateway (HTTP)    │
                               │   (Routes: ANY /{proxy+})   │
                               └──────────────┬──────────────┘
                                              │
                                       Lambda Event
                                              │
                                              ▼
                               ┌─────────────────────────────┐
                               │     AWS Lambda Function     │
                               │   (Express + serverless-http)│
                               └──────────────┬──────────────┘
                                              │
                                   Connection Pooler (:6543)
                                              │
                                              ▼
                               ┌─────────────────────────────┐
                               │    PostgreSQL (Supabase)    │
                               │  (users, stores, ratings)   │
                               └─────────────────────────────┘
```

---

## ✨ Key Features

### 1. System Administrator
- **Platform Analytics:** Real-time metrics tracking total registered users, registered stores, and total submitted ratings.
- **User Management:** Create new users with specific role assignments (`ADMIN`, `STORE_OWNER`, `USER`).
- **Store Registration:** Create new stores with address and assign them to existing store owners.
- **Interactive Tables:** Filter users and stores via instant multi-field search (Name, Email, Address, Role) and sort any column ascending/descending.
- **Owner Score Calculation:** Automatically calculates and displays a store owner's platform rating based on their assigned store.

### 2. Store Owner
- **Isolated Metrics:** View average store rating and total rating count for the assigned store.
- **Customer Feedback List:** Review individual customer ratings with reviewer names, emails, and star scores.
- **Graceful Empty State:** Clean placeholder interface if an owner account does not yet have an assigned store.
- **Password Management:** Secure password update modal requiring current password verification before applying updates.

### 3. Normal User
- **Store Catalog:** Browse and search all registered stores by name or address.
- **Rating System:** Submit integer ratings from 1 to 5 stars; dynamically update existing ratings.
- **Account Controls:** Self-registration and password management.

### 4. Security & Data Integrity
- **Role-Based Access Control (RBAC):** Backend route middleware (`verifyToken`, `isAdmin`, `isOwner`) paired with client-side route guards (`ProtectedRoute.jsx`).
- **Strict Field Validation:**
  - Name: 20–60 characters.
  - Address: Maximum 400 characters.
  - Password: 8–16 characters, strictly requiring at least 1 uppercase letter and 1 special character.
  - Ratings: Enforced strict integers between 1 and 5.
- **SQL Injection Prevention:** All queries utilize parameterized inputs (`$1, $2, ...`).
- **Password Security:** Salted hashes using `bcrypt` (10 rounds); password changes strictly require verifying current credentials.
- **Email Normalization:** All emails are sanitized with `.trim().toLowerCase()` to prevent account duplication.

---

## 📁 Repository Structure

```
StoreScore/
├── .github/
│   └── workflows/
│       └── deploy-backend.yml     # Automated AWS Lambda CI/CD pipeline
├── client/
│   ├── src/
│   │   ├── components/            # Modals, Navbar, ProtectedRoute
│   │   ├── pages/                 # AdminDashboard, OwnerDashboard, StoreBrowser, Login, Signup
│   │   ├── utils/                 # Centralized Axios API client
│   │   ├── App.jsx                # Route definitions & guards
│   │   └── main.jsx               # React entry point
│   ├── vercel.json                # Vercel SPA routing configuration
│   └── package.json
├── server/
│   ├── controllers/               # authController, adminController, ownerController, ratingController
│   ├── middleware/                # authMiddleware, validateAuth, errorHandler
│   ├── routes/                    # authRoutes, adminRoutes, ownerRoutes, storeRoutes, ratingRoutes
│   ├── app.js                     # Express app configuration & middleware
│   ├── index.js                   # Local development server entry (app.listen)
│   ├── lambda.js                  # AWS Lambda serverless handler entry
│   ├── db.js                      # PostgreSQL pool configuration
│   ├── schema.sql                 # Database DDL schema & indexes
│   ├── seed.js                    # Automated migration & seed script
│   └── package.json
└── README.md
```

---

## 💻 Local Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL database instance (or Supabase project)

### 1. Clone the Repository
```bash
git clone https://github.com/Harshit-Patle/StoreScore.git
cd StoreScore
```

### 2. Configure Environment Variables

**Backend (`server/.env`):**
Create `server/.env` (reference [server/.env.example]):
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-region.pooler.supabase.com:6543/postgres
```

**Frontend (`client/.env`):**
Create `client/.env` (reference [client/.env.example]):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies & Seed Database
```bash
# Install backend dependencies
cd server
npm install

# Run database schema creation and seed demo accounts
node seed.js

# Install frontend dependencies
cd ../client
npm install
```

### 4. Run Locally

**Start Backend Server (Port 5000):**
```bash
cd server
npm start
```

**Start Frontend Client (Port 5173):**
```bash
cd client
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 🧠 Important Technical Decisions

1. **Dual-Target Backend Architecture (`app.js` + `lambda.js` + `index.js`)**:
   - Decoupling Express route definitions into `app.js` allows the same codebase to run locally via `index.js` (`app.listen()`) and in the cloud via `lambda.js` (`serverless-http`) without maintaining separate backend implementations.
2. **Automated CI/CD with GitHub Actions**:
   - A custom GitHub Actions workflow (`deploy-backend.yml`) packages production dependencies and triggers `aws lambda update-function-code` on every push to `main`.
3. **Database Connection Pooler for Serverless**:
   - Supabase direct connection strings resolve exclusively over IPv6. Using the Supabase Connection Pooler (`:6543`) provides IPv4 compatibility for AWS Lambda and local developer machines while preventing connection exhaustion during concurrent invocations.
4. **Centralized Error Handling & Error Mapping**:
   - Implemented standard Express error middleware mapping PostgreSQL error codes (`23505` duplicate key ➔ 409 Conflict, `23503` foreign key violation ➔ 400 Bad Request) into uniform JSON error payloads.
5. **SPA Direct Route Handling (`vercel.json`)**:
   - Configured Vercel rewrites to route deep URLs (e.g. `/admin`, `/stores`) back to `index.html`, eliminating 404 errors on page refreshes.

---

## ⚠️ Known Limitations

- **Lambda Cold Starts:** Serverless execution on AWS Lambda may introduce a 1–2 second latency during cold starts after extended inactivity.
- **Store-to-Owner Relationship:** Current schema enforces a 1:1 relationship where each store owner manages a single assigned store.
- **Client-Side Pagination:** Filtering and sorting operate on fetched arrays; server-side SQL pagination (`LIMIT` / `OFFSET`) can be added for enterprise scale datasets (> 10,000 stores).

---

## 👨‍💻 Author

**Harshit Patle**  
*Full-Stack Developer*  
- **GitHub:** [@Harshit-Patle](https://github.com/Harshit-Patle)