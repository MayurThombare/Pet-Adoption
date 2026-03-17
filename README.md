# 🐾 PawsHome — Pet Adoption Management System

A full-stack MERN-style application (React + Node.js + Express + PostgreSQL) for browsing pets available for adoption, submitting adoption applications, and managing the entire adoption workflow.

---

## 📋 Features

### Visitor (Public)
- Browse all available pets with beautiful card layout
- Search pets by **name or breed**
- Filter by **species**, **breed**, and **age range**
- Sort by newest, name, or age
- Paginated pet listing (12 per page)
- View detailed pet profiles

### User (Registered)
- Register / Login with JWT authentication
- Apply to adopt available pets (detailed application form)
- View own applications and statuses (pending / approved / rejected)
- Update profile (name, phone, address)

### Admin
- Full CRUD for pets (Add / Edit / Delete)
- Upload pet photos (file or URL)
- View **all** adoption applications
- Approve or reject applications with notes
- Update pet status manually (available / pending / adopted)
- Status auto-updates when application approved/rejected
- Dashboard with live stats

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express 4 |
| Database | PostgreSQL |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | express-validator |
| File Upload | Multer |
| API Docs | Swagger (swagger-ui-express) |
| Notifications | react-hot-toast |

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- PostgreSQL ≥ 14

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd pet-adoption
```

### 2. Set up the backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

**.env** (backend):
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pet_adoption_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### 3. Create the database
```bash
# In psql:
CREATE DATABASE pet_adoption_db;
```

### 4. Seed the database (optional but recommended)
```bash
cd backend
node seed.js
```
This creates:
- **Admin**: `admin@petadopt.com` / `admin123`
- **User**: `user@petadopt.com` / `user123`
- 12 sample pets

### 5. Start the backend
```bash
npm run dev    # development (nodemon)
# or
npm start      # production
```
Backend runs on **http://localhost:5000**
API Docs at **http://localhost:5000/api/docs**

### 6. Set up the frontend
```bash
cd frontend
npm install
cp .env.example .env
# .env content: REACT_APP_API_URL=http://localhost:5000/api
```

### 7. Start the frontend
```bash
npm start
```
Frontend runs on **http://localhost:3000**

---

## 📁 Project Structure

```
pet-adoption/
├── backend/
│   ├── config/
│   │   ├── database.js         # Sequelize connection
│   │   └── swagger.js          # OpenAPI spec
│   ├── controllers/
│   │   ├── authController.js   # Register, Login, Profile
│   │   ├── petController.js    # CRUD + status
│   │   └── applicationController.js  # Apply, Review
│   ├── middleware/
│   │   ├── auth.js             # JWT authenticate + authorize
│   │   ├── errorHandler.js     # Global error handling
│   │   └── upload.js           # Multer config
│   ├── models/
│   │   ├── User.js
│   │   ├── Pet.js
│   │   ├── Application.js
│   │   └── index.js            # Associations
│   ├── routes/
│   │   ├── auth.js
│   │   ├── pets.js
│   │   └── applications.js
│   ├── validators/
│   │   └── index.js
│   ├── server.js
│   ├── seed.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── admin/
    │   │   │   ├── PetFormModal.js
    │   │   │   └── ApplicationReviewModal.js
    │   │   ├── common/
    │   │   │   ├── Navbar.js
    │   │   │   ├── Pagination.js
    │   │   │   └── ProtectedRoute.js
    │   │   └── pets/
    │   │       ├── PetCard.js
    │   │       └── PetFilters.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── PetsPage.js
    │   │   ├── PetDetail.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   └── AdminDashboard.js
    │   ├── styles/
    │   │   └── global.css
    │   ├── utils/
    │   │   └── api.js           # Axios instance + interceptors
    │   ├── App.js
    │   └── index.js
    ├── .env.example
    └── package.json
```

---

## 🔌 API Reference

Base URL: `http://localhost:5000/api`
Full interactive docs: `http://localhost:5000/api/docs`

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login |
| GET | `/auth/me` | User | Get own profile |
| PUT | `/auth/profile` | User | Update profile |

### Pets
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/pets` | Public | List pets (search, filter, paginate) |
| GET | `/pets/:id` | Public | Get single pet |
| POST | `/pets` | Admin | Create pet |
| PUT | `/pets/:id` | Admin | Update pet |
| DELETE | `/pets/:id` | Admin | Delete pet |
| PATCH | `/pets/:id/status` | Admin | Update pet status |

### Applications
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/applications` | User | Submit adoption application |
| GET | `/applications/my` | User | Get own applications |
| GET | `/applications/:id` | User/Admin | Get single application |
| GET | `/applications` | Admin | Get all applications |
| PATCH | `/applications/:id/review` | Admin | Approve/reject |

### Query Parameters for `GET /pets`
| Param | Type | Example | Description |
|-------|------|---------|-------------|
| `search` | string | `Buddy` | Search name or breed |
| `species` | string | `dog` | Filter by species |
| `breed` | string | `Retriever` | Filter by breed |
| `age` | string | `1-3` | Age range (years) |
| `status` | string | `available` | Pet status |
| `sort` | string | `name` | Sort field |
| `order` | string | `ASC` | Sort order |
| `page` | number | `2` | Page number |
| `limit` | number | `12` | Items per page |

---

## 🛡️ Role-Based Access

| Feature | Visitor | User | Admin |
|---------|---------|------|-------|
| Browse pets | ✅ | ✅ | ✅ |
| View pet details | ✅ | ✅ | ✅ |
| Register/Login | ✅ | — | — |
| Apply to adopt | ❌ | ✅ | ✅ |
| View own applications | ❌ | ✅ | ✅ |
| Add/Edit/Delete pets | ❌ | ❌ | ✅ |
| View all applications | ❌ | ❌ | ✅ |
| Approve/Reject | ❌ | ❌ | ✅ |
| Update pet status | ❌ | ❌ | ✅ |

---

## 🌱 Business Logic

- A pet becomes **pending** when a user applies
- When an admin **approves** an application, the pet becomes **adopted** and all other pending applications for that pet are **auto-rejected**
- When an admin **rejects** an application and no other pending applications exist, the pet returns to **available**
- Users **cannot** apply for a pet they've already applied for (pending or approved)
- Only **available** pets can receive new applications

---

## 🎨 Design

- Warm, earthy color palette (cream, bark brown, forest green, amber)
- Playfair Display (serif) + DM Sans (body)
- Fully responsive (mobile-first)
- Smooth hover animations on pet cards
- Toast notifications for all actions
- Sticky navbar with role-based links

---

## ✅ Deliverables Checklist

- [x] GitHub-ready repo with README
- [x] `.env.example` files (frontend & backend)
- [x] Swagger API documentation (`/api/docs`)
- [x] Responsive frontend UI
- [x] JWT authentication with role-based authorization
- [x] REST APIs for all CRUD and adoption workflow
- [x] Validation to prevent invalid applications
- [x] Pet photo upload (file upload + URL support)
- [x] Public pet listing with search, filters, and pagination
- [x] User dashboard for applications
- [x] Admin dashboard for full management
- [x] PostgreSQL with Sequelize ORM
- [x] Database seeder with sample data
