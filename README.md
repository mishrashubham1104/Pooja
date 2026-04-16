# Pooja Connect 🕉️

Welcome to **Pooja Connect** — a premium, full-stack spiritual service booking platform that bridges the gap between devotees and experienced Pandits across India's sacred cities. 

## 🌟 Key Features

* **Role-Based Access Control (RBAC):** Distinct dashboards and capabilities for Customers, Pandits, and Admins.
* **Premium Discovery UI:** Features a dynamic, 3D card stacking Swiper effect for mobile devices and a seamless horizontal marquee auto-scroll for desktop users to discover Divine Destinations.
* **Service Directory:** A comprehensive A-Z directory of Poojas, Havans, and Dosh Nivaran ceremonies.
* **Intelligent Booking Flow:** Customers can search by city, specific ritual, or Pandit specialization, and book appointments directly.
* **Interactive Dashboards:** 
  * *Pandits:* Manage incoming booking requests (Accept/Reject/Complete), view total earnings, and manage public profiles.
  * *Customers:* Track upcoming/completed poojas, view booking status, and manage their favorite Pandits roster.
* **Security Hardened:** Powered by JWT Authentication, Express Rate Limiting, Helmet security headers, and secure OTP-based password recovery.

## 💻 Tech Stack

**Frontend:**
* React 18 + Vite
* Tailwind CSS v4
* Framer Motion (for smooth micro-animations)
* Swiper.js (for mobile 3D touch gestures)
* Lucide React (for premium iconography)

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose (NoSQL Database)
* JSON Web Tokens (JWT) & bcryptjs (Authentication)
* express-rate-limit & helmet (Security)

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
* [Node.js](https://nodejs.org/en/) (v16+)
* [MongoDB](https://www.mongodb.com/) (Local or MongoDB Atlas Cluster)
* Git

### 1. Clone the repository
```bash
git clone https://github.com/mishrashubham1104/Pooja.git
cd Pooja
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside the `/backend` folder:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Start the backend server:
```bash
npm start
```
*The backend API will run on http://localhost:5000*

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```

Create a `.env` file inside the `/frontend` folder:
```env
VITE_API_URL=http://localhost:5000
```

Start the Vite development server:
```bash
npm run dev
```
*The frontend will run on http://localhost:5173*

---

## 🛠️ Deployment Instructions

### Frontend (via Vercel)
1. Import the repository into Vercel.
2. Set the **Root Directory** to `frontend`.
3. Set **Framework Preset** to `Vite`.
4. Add the Environment Variable: `VITE_API_URL` = `https://your-backend-url.onrender.com`.
5. Deploy.

### Backend (via Render)
1. Create a new "Web Service" on Render.
2. Set the **Root Directory** to `backend`.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `npm start`.
5. Add the relevant Environment Variables (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, `FRONTEND_URL=[vercel-link]`).
6. Deploy.

---

### 🎨 Design Philosophy
Pooja Connect abandons generic, flat UI norms by adopting a rich aesthetic. With saffron and maroon hues, subtle glassmorphism, responsive architectural card sliders, and heavy use of curated imagery, the platform aims to incite feelings of trust, devotion, and premium spirituality from the very first tap.
