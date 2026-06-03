# StoreScore | Full-Stack Store Rating Platform 🏪⭐

StoreScore is a secure, role-based web application that allows users to browse, search, and rate their favorite stores. It features a fully authenticated dashboard system dynamically tailored for Normal Users, Store Owners, and System Administrators.

**Live Frontend (Vercel):** https://store-score-psi.vercel.app

**Live Backend (Render):** https://storescore-api.onrender.com/api

---

## 🚀 Tech Stack
* **Frontend:** React.js (Vite), Tailwind CSS v4
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (Hosted on Supabase)
* **Authentication:** JSON Web Tokens (JWT) & bcrypt
* **Deployment:** Vercel (Client) & Render (Server)

---

## 🔒 Role-Based Features

### 1. System Administrator (Admin)
* **Global Dashboard:** View real-time platform statistics (Total Users, Stores, Ratings).
* **Data Management:** Add new Users, Admin users, and Store Owners directly from the UI.
* **Store Creation:** Register new stores and assign them directly to existing Store Owners.
* **Advanced Tables:** View comprehensive lists of all platform users and stores.
* **Smart Filtering & Sorting:** Apply instant client-side searches (Name, Email, Address, Role) and sort table columns ascending/descending.
* **Owner Analytics:** Automatically calculates and displays a Store Owner's global average rating within the user list.

### 2. Store Owner
* **Isolated Environment:** Secured backend routing ensures owners only see data belonging to their assigned stores.
* **Store Analytics:** View the aggregate average rating and total rating count for their business.
* **Customer Feedback:** Access a real-time data table displaying all individual customer ratings, including the reviewer's name and email.
* **Security:** Ability to securely update passwords using strict validation protocols.

### 3. Normal User
* **Store Browser:** View and search through all registered stores on the platform by Name or Address.
* **Interactive Rating System:** Submit a 1-5 star rating for any store.
* **Dynamic Modifying:** Instantly click to modify or update previously submitted ratings.
* **Account Management:** Secure signup with strict field validations and post-login password modification.

---

## 🛡️ Form Validations & Security
The application strictly enforces data integrity on both the client (React) and server (Express) levels:
* **Name:** 20 - 60 characters minimum requirement.
* **Address:** Maximum 400 characters.
* **Password:** 8-16 characters, strictly requiring at least one uppercase letter and one special character (Enforced via Regex).
* **Email:** Standard email validation format.
* **SQL Injection Prevention:** Utilizes parameterized queries (`$1, $2`) for all PostgreSQL transactions.

---

## 💻 Local Setup & Installation

### Prerequisites
* Node.js installed on your machine.
* A Supabase account (or local PostgreSQL instance).

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/storescore.git
cd storescore
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
DATABASE_URL="postgresql://postgres.[your-project]:[password]@aws-0-region.pooler.supabase.com:6543/postgres"
JWT_SECRET="your_super_secret_jwt_key_here"
```
*Note: Make sure your Supabase connection string uses the Connection Pooler (`:6543`) for IPv4 compatibility.*

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the frontend:
```bash
npm run dev
```

### 4. Database Seeding (Optional but Recommended)
To instantly populate the database with the required tables and dummy data for testing the three roles:
```bash
cd server
node seedAll.js
node seedStores.js
```
**Demo Login Credentials:**
* **Admin:** `admin@storescore.com` | `DemoPassword123!`
* **Owner:** `owner@storescore.com` | `DemoPassword123!`
* **User:** `user@storescore.com` | `DemoPassword123!`

---

## 👨‍💻 Author
**Harshit Patle**

*Full-Stack Developer*