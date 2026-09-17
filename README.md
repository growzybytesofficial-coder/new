# IT SAATHI - MERN Stack E-commerce Website

**Smart Tech, Trusted Service**  
An enterprise-grade, high-performance, and secure MERN stack e-commerce web platform engineered for IT accessories, CCTV solutions, and networking products.

---

## 📂 Monorepo Folder Structure

```
it-saathi/
├── frontend/             # Premium React + Vite + Tailwind CSS Storefront
├── admin/                # Dedicated React Admin Control Panel
├── backend/              # Node.js + Express.js Security-focused API Server
│   ├── src/
│   │   ├── config/       # Databases, Cloud Services, Payment Gateways config
│   │   ├── controllers/  # REST Endpoints logic controllers
│   │   ├── middleware/   # Role Auth, Error boundaries, Upload, Rate Limiting
│   │   ├── models/       # Mongoose Schemas & Data validation hooks
│   │   ├── routes/       # API routers mappings
│   │   ├── services/     # Third-party utilities (Emails, Payment verification)
│   │   ├── utils/        # Token generators, formatting helpers
│   │   ├── validators/   # Input sanitization and validators (express-validator)
│   │   ├── seed/         # Admin and database bootstrapping scripts
│   │   ├── app.js        # Express app and dev routing logic
│   │   └── server.js     # Server launcher and DB connectors
│   └── package.json
├── README.md
└── package.json          # Root Monorepo configuration with npm Workspaces
```

---

## 🛠️ Technology Stack & Architecture

- **Frontend & Admin**: React.js 18, Vite, Tailwind CSS, Lucide Icons, React Router DOM v6
- **Backend**: Node.js, Express.js (RESTful architecture)
- **Database**: MongoDB Atlas + Mongoose
- **Security**: JWT Access/Refresh tokens (HTTPOnly cookies), bcrypt password hashing, CORS whitelist, Helmet headers, express-rate-limit, request validation (express-validator)
- **Communications**: Nodemailer SMTP / Ethereal Fallback
- **Media**: Cloudinary + Multer
- **Payment**: Razorpay SDK + Cash on Delivery

---

## 🚀 Getting Started (Phase 1 Local Setup)

### 1. Configure Environment Variables
Copy `.env.example` to `.env` in both the **root** folder and `/backend` folder:
```bash
cp .env.example .env
cp .env.example backend/.env
```
Fill in the credentials in `.env` (MongoDB Atlas URI, SMTP details, JWT secrets, Cloudinary keys, and Razorpay API keys).

### 2. Install Dependencies
Since we are using **npm Workspaces**, run the installation once at the root:
```bash
npm install
```

### 3. Seed Default Admin Account
Bootstrap your MongoDB database with the default administrator account:
```bash
node backend/src/seed/seedAdmin.js
```
- **Username**: `admin@itsaathi.in`
- **Password**: `ChangeMe@2026`
- **Role**: `admin`
- **Note**: The user has the `forcePasswordChange` flag set to `true` for security compliance.

### 4. Run the Development Server
Launch the backend server (which serves the API and mounts the dynamic Vite middleware on port 3000):
```bash
npm run dev
```

---

## 🧪 Postman / API Testing Guide

### 📍 Core Auth API Endpoints (Port 3000 / 5000)

1. **Register Customer**
   - **Method**: `POST`
   - **URL**: `http://localhost:3000/api/auth/register`
   - **Headers**: `Content-Type: application/json`
   - **Body (JSON)**:
     ```json
     {
       "name": "John Doe",
       "email": "johndoe@example.com",
       "password": "SecurePassword123",
       "phone": "+919876543210"
     }
     ```

2. **Login User (Admin / Customer)**
   - **Method**: `POST`
   - **URL**: `http://localhost:3000/api/auth/login`
   - **Headers**: `Content-Type: application/json`
   - **Body (JSON)**:
     ```json
     {
       "email": "admin@itsaathi.in",
       "password": "ChangeMe@2026"
     }
     ```
   - **Expected Response**: Returns an `accessToken` in the JSON body, and sets a secure `refreshToken` as an `httpOnly` cookie.

3. **Get My Profile (Protected)**
   - **Method**: `GET`
   - **URL**: `http://localhost:3000/api/auth/me`
   - **Headers**: `Authorization: Bearer <Your_Access_Token>`

4. **Refresh Session**
   - **Method**: `POST`
   - **URL**: `http://localhost:3000/api/auth/refresh`
   - **Cookies**: Requires `refreshToken` cookie.
   - **Expected Response**: Generates and returns a fresh short-lived `accessToken`.

5. **Forgot Password**
   - **Method**: `POST`
   - **URL**: `http://localhost:3000/api/auth/forgot-password`
   - **Body**: `{"email": "admin@itsaathi.in"}`

6. **Reset Password**
   - **Method**: `POST`
   - **URL**: `http://localhost:3000/api/auth/reset-password/<token_received_in_email>`
   - **Body**: `{"password": "NewSecurePassword2026"}`

---

## 🔒 Security Measures Implemented
- **Salt-and-Hash Password Security**: Schema-level password hashing prevents cleartext storage.
- **Double Token Refresh Flow**: Keeps active access credentials short-lived (15 mins) and securely refreshes using cookies (7 days), protecting against credential hijacking.
- **Strict Rate Limiting**: Limiters added on public auth and inquiries APIs to prevent abuse.
- **CORS Allowed Origins Enforcement**: Configured dynamically based on environment configuration.
- **Helmet Headers Integrations**: Hardens the HTTP server headers.
