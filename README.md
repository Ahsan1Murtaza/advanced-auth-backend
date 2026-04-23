# 🔐 Advanced Authentication System (Backend)

A full-featured authentication backend built with Node.js, Express, and MongoDB.

This system implements secure authentication flows including email verification, password reset, and token-based authorization using JWT.

---

## 🚀 Features

### 🔑 Authentication
- User registration and login
- JWT-based authentication system
- Secure password hashing using bcrypt

### 📧 Email Verification
- Email verification on signup
- Token-based verification links
- Integrated email service (Mailtrap)

### 🔁 Password Recovery
- Forgot password functionality
- Secure reset password flow via email token

### 🛡️ Security Features
- Protected routes using middleware
- Token expiration handling
- Secure credential storage
- Input validation (if implemented)

---

## 🧱 Architecture

- MVC pattern (Models, Controllers, Routes)
- Middleware-based request protection
- Utility-based token and email handling

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT (jsonwebtoken)
- bcrypt.js
- Mailtrap service
