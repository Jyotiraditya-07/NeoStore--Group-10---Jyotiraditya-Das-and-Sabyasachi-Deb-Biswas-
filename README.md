# 🛒 NeoStore – Modern E-Commerce with MERN Stack

NeoStore is a full-stack modern e-commerce web application developed using the **MERN stack** (MongoDB, Express.js, React.js, and Node.js). This platform offers both customer-facing and admin-facing features, including secure user authentication, product browsing, cart and order management, analytics, and more.

> Developed by: [Jyotiraditya Das](https://github.com/Jyotiraditya-07) and Sabyasachi Deb Biswas  
> Submitted to: Academy of Skill Development, KIIT  
> Duration: May 2, 2025 – June 20, 2025

---

## 📌 Table of Contents

- [🎯 Objective](#-objective)
- [🧠 Features](#-features)
- [⚙️ Tech Stack](#️-tech-stack)
- [📸 UI Snapshots](#-ui-snapshots)
- [🗂️ System Architecture](#️-system-architecture)
- [🚀 Future Scope](#-future-scope)
- [📥 Installation](#-installation)
- [📄 License](#-license)

---

## 🎯 Objective

To build a responsive, secure, and scalable e-commerce web application that allows users to shop online while providing administrators the tools to manage inventory, users, and orders efficiently.

---

## 🧠 Features

### 👥 Customer

- Register/Login with JWT-based auth
- Browse & search products by category and price
- Add/remove items in cart
- Place orders with secure payment
- View order history and profile

### 🛠️ Admin

- Secure admin login
- Product management (Add/Edit/Delete)
- Order management with status tracking
- View all users and control access
- Analytics Dashboard

### 🔒 Technical

- RESTful API with Express.js
- MongoDB schemas with Mongoose
- Responsive UI with React & Bootstrap
- Payment Gateway Integration (Stripe/Razorpay)
- Cloud-hosted (Heroku/Vercel/Netlify)

---

## ⚙️ Tech Stack

| Category         | Tech                          |
|------------------|-------------------------------|
| Frontend         | React.js, Tailwind CSS        |
| Backend          | Node.js, Express.js           |
| Database         | MongoDB Atlas                 |
| Authentication   | JWT, bcrypt                   |
| Tools            | Git, Postman, VS Code         |
| Deployment       | Vercel / Heroku               |
| Payment Gateway  | Stripe / Razorpay             |

---

## 📸 UI Snapshots

| Page             | Description                   |
|------------------|-------------------------------|
| Login/Register   | Secure authentication system  |
| Home             | Browse products with filters  |
| Product Details  | View details and related items|
| Cart             | Manage items in shopping cart |
| Orders           | Track and manage past orders  |
| Admin Dashboard  | Manage products, users, sales |

---

## 🗂️ System Architecture

- **Frontend**: React components using Axios for API requests
- **Backend**: Express.js REST API with authentication, authorization, and validation middleware
- **Database**: MongoDB models for Users, Products, and Orders
- **Diagrams**: Includes DFD (Level 0, Level 1), Sequence & Use Case diagrams, Schema Designs

---

## 🚀 Future Scope

- 📱 Mobile App with React Native
- 🧠 AI-powered product recommendations
- 🌐 Multi-language support
- 🤖 Chatbot integration
- 📧 SMS & Email Notifications
- 📄 Auto-invoice generation

---

## 📥 Installation

### Prerequisites

- Node.js, npm
- MongoDB Atlas account
- Stripe/Razorpay account for payment

### Steps

1. Clone the repo:
    ```bash
    git clone https://github.com/YourUsername/NeoStore.git
    ```
2. Set up the environment files:
    - Create `.env` in root and add MongoDB URI, JWT secret, etc.
3. Install dependencies:
    ```bash
    cd backend
    npm install
    cd ../frontend
    npm install
    ```
4. Run the application:
    - Backend: `npm run dev`
    - Frontend: `npm start`

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📚 References

- [ReactJS](https://reactjs.org)
- [Node.js](https://nodejs.org)
- [Express.js](https://expressjs.com)
- [Mongoose](https://mongoosejs.com)
- [Stripe API](https://stripe.com/docs)

---

> _“Building NeoStore taught us real-world full-stack development, system design, and the practical application of engineering principles.”_

