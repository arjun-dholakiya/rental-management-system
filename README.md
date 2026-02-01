# Rental Management System

A full-stack **Rental Management System** built for hackathon use cases, enabling vendors to manage rentable products and customers to book, rent, pay, and return products through a complete rental lifecycle.

---

## 🚀 Tech Stack

### Backend
- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JWT Authentication
- bcrypt
- Joi validation

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router

---

## 🏗️ System Architecture

The system follows a **modular, API-driven architecture**:


Each module is isolated with its own:
- Routes
- Controllers
- Services
- Models

---

## 👥 User Roles

### Vendor
- Create and manage products
- Set rental pricing

### Customer
- Browse products
- Reserve products
- Create quotations (cart)
- Confirm rental orders
- Pay invoices
- Return products

---

## 📦 Core Modules & Functionality

---

### 1️⃣ Authentication Module
Handles user identity and access control.

**Features**
- User registration
- User login
- JWT-based authentication
- Profile fetch
- Password change

---

### 2️⃣ Product Module
Manages rentable inventory.

**Backend Logic**
- Vendors create products
- Vendors set rental pricing
- Customers can only see:
  - `status = available`
  - `rentable = true`
- Vendors only see their own products

**Key Concept**
> Product availability is controlled by status and rentable flag, not by frontend logic.

---

### 3️⃣ Reservation Module
Blocks products for specific date ranges.

**Backend Logic**
- Prevents double booking
- Checks overlapping date ranges
- Does **not** reduce product quantity
- Only blocks time slots

**Key Concept**
> Reservation blocks time, not stock.

---

### 4️⃣ Quotation Module (Cart System)
Acts as a draft rental cart.

**Backend Logic**
- Customer creates a quotation
- Products added as quotation items
- Same product added again → quantity increases
- Price recalculated automatically
- No inventory change at this stage

**Key Concept**
> Quotation is a draft intent, not a confirmed booking.

---

### 5️⃣ Rental Order Module
Finalizes the rental.

**Backend Logic**
- Created after confirming a quotation
- Reduces product quantity
- Locks reservations
- Represents a confirmed rental

**Key Concept**
> Rental Order separates draft intent from confirmed action.

---

### 6️⃣ Invoice Module
Handles billing.

**Backend Logic**
- Generated from rental order
- Stores total amount, paid amount, and status
- Does not process payments directly

---

### 7️⃣ Payment Module
Handles transactions.

**Backend Logic**
- Linked to invoices
- Supports multiple payments per invoice
- Updates invoice payment status

**Key Concept**
> Payments are separated from invoices for clean accounting.

---

### 8️⃣ Return Module
Closes the rental lifecycle.

**Backend Logic**
- Customer returns rented product
- Calculates late fees if applicable
- Marks rental order as completed

---

## 🔁 Complete Rental Flow


---

## 🔐 Security & Validation

- JWT authentication for protected routes
- Role-based access control (vendor/customer)
- Joi schema validation
- Secure password hashing

---

## 🎯 Hackathon Highlights

- Clean modular backend
- Real-world rental lifecycle
- Role-based system design
- No fake APIs or mock logic
- Frontend strictly consumes backend APIs
- Easy to explain to judges

---

## 🧠 One-Line Pitch

> A complete rental management platform where vendors manage inventory and customers rent products through a real-world, end-to-end rental flow.

---

## 🏁 Status

✅ Backend completed  
✅ Frontend 80% done
✅ Ready for demo & evaluation  

---

## 📌 Note

This project focuses on **clarity, correctness, and explainability**, making it suitable for hackathons, demos, and academic evaluation.



