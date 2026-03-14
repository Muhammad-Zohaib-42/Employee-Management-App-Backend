# 👔 Employee Management App — Backend

A **production-level** REST API backend for an Employee Management System built with **Node.js**, **Express.js**, and **MongoDB (Cloud)**. Features complete authentication system with secure password hashing and JWT-based authorization.

---

## 🔗 Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime Environment |
| Express.js | Web Framework |
| MongoDB Atlas | Cloud Database |
| Mongoose | ODM / Schema Modeling |
| bcrypt | Password Hashing |
| JWT | Authentication & Authorization |
| dotenv | Environment Variables |
| cookie-parser | Cookie Handling |

---

## ✨ Features

- 🔐 **Production-level Auth System** — Register, Login, Logout, Get Me
- 🔑 **JWT** based authentication with secure token handling
- 🔒 **bcrypt** password hashing — plain passwords never stored
- ☁️ **MongoDB Atlas** cloud database
- 🗂️ **Well-structured schemas & models** for Employee data
- 🛡️ **Protected routes** — only authenticated users can access
- ⚙️ **Environment-based config** with `.env`
- 📦 Clean **MVC folder structure**

---

## 📁 Folder Structure
```
employee-management-backend/
├── controllers/
│   ├── auth.controller.js
│   └── employee.controller.js
├── models/
│   ├── user.model.js
│   └── employee.model.js
├── routes/
│   ├── auth.routes.js
│   └── employee.routes.js
├── middleware/
│   └── auth.middleware.js
├── config/
│   └── db.js
├── .env
├── .env.example
├── .gitignore
├── server.js
└── package.json
```

---

## 🔐 Auth API Endpoints

**Base URL:** `/api/v1/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register a new user | ❌ |
| POST | `/login` | Login and get token | ❌ |
| POST | `/logout` | Logout and clear token | ✅ |
| GET | `/getme` | Get logged in user info | ✅ |

---

### 📝 Register
**POST** `/api/v1/auth/register`

Request Body:
```json
{
  "name": "Muhammad Zohaib",
  "email": "zohaib@example.com",
  "password": "yourpassword"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here"
}
```

---

### 🔑 Login
**POST** `/api/v1/auth/login`

Request Body:
```json
{
  "email": "zohaib@example.com",
  "password": "yourpassword"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here"
}
```

---

### 🚪 Logout
**POST** `/api/v1/auth/logout`

Clears the JWT cookie and logs the user out.

Response:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 👤 Get Me
**GET** `/api/v1/auth/getme`

Returns currently logged in user's data. Requires valid JWT token.

Response:
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "Muhammad Zohaib",
    "email": "zohaib@example.com"
  }
}
```

---

## 🗄️ Database Schemas

### User Schema
```js
{
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },  // bcrypt hashed
  role:     { type: String, default: "admin" },
  timestamps: true
}
```

### Employee Schema
```js
{
  name:       { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  phone:      { type: String },
  department: { type: String },
  position:   { type: String },
  salary:     { type: Number },
  joinDate:   { type: Date },
  status:     { type: String, enum: ["active", "inactive"], default: "active" },
  timestamps: true
}
```

---

## ⚙️ Local Setup

### Step 1 — Clone the Repo
```bash
git clone https://github.com/YOUR_USERNAME/employee-management-backend.git
cd employee-management-backend
```

### Step 2 — Install Dependencies
```bash
npm install
```

### Step 3 — Setup Environment Variables

Create a `.env` file in the root folder:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

> ⚠️ Never push your `.env` file to GitHub. It is already added in `.gitignore`.

### Step 4 — Run the Server
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Server will start at: `http://localhost:5000`

---

## 🔒 Security Practices Used

- ✅ Passwords hashed with **bcrypt** before saving to DB
- ✅ JWT tokens stored in **httpOnly cookies**
- ✅ Protected routes using custom **auth middleware**
- ✅ Sensitive config stored in **environment variables**
- ✅ `.env` file excluded via **`.gitignore`**
- ✅ Proper **error handling** on all routes

---

## 🧪 Test APIs with Postman

1. Download [Postman](https://www.postman.com/)
2. Import the endpoints listed above
3. First hit `/register` to create a user
4. Then `/login` — token will be set in cookies automatically
5. Use token in **Authorization header** or cookie for protected routes:
```
Authorization: Bearer your_jwt_token
```

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Developed by **Muhammad Zohaib**
[🌐 Portfolio](https://zohaibdev-official.vercel.app/) • [📧 Email](mailto:muhammadzohaibranjha42@gmail.com)
