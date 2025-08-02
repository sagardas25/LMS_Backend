# Learning Management System (LMS) – Backend

A scalable and feature-rich **Learning Management System (LMS)** backend built with **Node.js**, **Express**, and **MongoDB**, enabling seamless management of users, courses, sections, lectures, ratings, and payments.

---

## 📁 Project Structure

```
├── controllers/         # Route logic
├── routes/              # Express route handlers
├── models/              # Mongoose schemas
├── middlewares/         # Auth, error handling, etc.
├── utils/               # Utility functions
├── db/                  # Database  configs
├── public/              # Lecture/media storage
├── .env                 # Environment variables
├── app.js               # Express app
└── index.js             # Entry point
└── logger.js            # logger configuration

```

---

## 🚀 Tech Stack

- **Node.js** + **Express.js** – Backend Framework
- **MongoDB** + **Mongoose** – Database & ODM
- **Cloudinary** – Media Storage (configurable)
- **Razorpay** – Payment Gateway
- **JWT** – Authentication
- **Nodemailer** – Email for password reset
- **Multer** – File uploads

---

## ⚙️ Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/sagardas25/LMS_Backend
   cd LMS_Backend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the root and add the following:

   ```env
    PORT =
    NODE_ENV =
    CLIENT_URL =
    MONGO_URL = your_mongodb_url
    MONGOOSE_DEBUG =
    CLOUDINARY_CLOUD_NAME = your_cloudinary_name
    CLOUDINARY_CLOUD_SECRET = your_cloudinary_secret
    CLOUDINARY_CLOUD_API = your_cloudinary_key
    ACCESS_TOKEN_EXPIRY =
    ACCESS_TOKEN_SECRET = your_access_token
    REFRESH_TOKEN_EXPIRY = your_refresh_token
    REFRESH_TOKEN_SECRET = your_refresh_token_secret
    DEFAULT_AVATAR_URL = your_default_url
    RAZORPAY_KEY_ID = your_key
    RAZORPAY_KEY_SECRET = your_secret
   ```

4. **Run the Server**
   ```bash
   npm run dev
   ```



## 📚 API Route Overview

### 1. **Auth Routes** `/api/v1/auth`

- `POST /register` — Register a new user (with avatar upload)
- `POST /login` — Authenticate user and issue tokens
- `POST /refresh-token` — Refresh access token using refresh token
- `POST /logout` — Invalidate session and clear cookies
- `POST /forgot-password` — Send password reset link to email
- `POST /reset-password` — Reset user password using token
- `POST /update-password` — Authenticated user updates current password

---

### 2. **Admin Dashboard Routes** `/api/v1/admin`

- `GET /all-students` — View all registered students (Admin only)
- `GET /all-instructor` — View all instructors (Admin only)
- `POST /promote-to-instructor/:userId` — Promote a user to instructor role

---

### 3. **Course Routes** `/api/v1/course`

- `POST /create-new-course` — Create a new course (thumbnail required)
- `GET /get-my-created-courses` — View all courses created by instructor
- `GET /get-my-published-courses` — View only published instructor courses
- `GET /get-my-unpublished-courses` — View draft/unpublished courses
- `POST /publish-course/:courseId` — Publish a draft course
- `PATCH /c/:courseId` — Update course details (thumbnail optional)
- `GET /c/:courseId` — Get detailed course data (for enrolled students)
- `GET /search` — Search courses by keyword
- `GET /course-by-category` — Filter courses by category
- `POST /:courseId/student/:studentId/enroll-student` — Enroll student to course (admin/instructor)

---
### 4. **Section Routes** `/api/sections`

- `POST /add` – Add section to course
- `PUT /:id` – Rename/update section
- `DELETE /:id` – Delete section
- `PUT /reorder` – Reorder sections in course

### 5. **Lecture Routes** `/api/lectures`

- `POST /add` – Add/upload lecture to section
- `DELETE /:id` – Delete lecture + video
- `PUT /:id` – Update lecture metadata
- `GET /section/:sectionId` – Get lectures in section
- `GET /:id` – Get single lecture
- `PUT /move` – Move lecture to another section
- `PUT /reorder` – Reorder lectures within section
- `PUT /:id/toggle-preview` – Enable/disable preview
- `POST /bulk-delete` – Background job for deletion

### 6. **Rating Routes** `/api/ratings`

- `POST /:courseId/submit`
- `PUT /:courseId/update`

### 7. **Payment (Razorpay) Routes** `/api/payments`

- `POST /checkout`
- `POST /verify`
- `POST /refund`
- `GET /my-purchases`

### 8. **User Routes** `/api/users`

- `GET /me`
- `PUT /update`
- `PUT /update-avatar`
- `GET /enrolled-courses`
- `GET /created-courses`

### 9. **Health Check** `/api/health`

- `GET /` – Status: `OK`

---

## 🔐 Authentication & Roles

- Role-based access:
  - `admin`
  - `instructor`
  - `student`
- JWT used for protected routes
- Middleware handles token validation and role checks

---

## ☁️ Media Upload

- Handled via `Multer` + `Cloudinary`
- Uploads include course thumbnails, lecture videos, and user avatars

---

## 🧪 Testing

> To be added (Postman Collection & Unit Tests)

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the [MIT License](./LICENSE)

---

## 🌐 Frontend

Frontend built with **Next.js + Tailwind + ShadCN UI**

> 📂 [Frontend Repo (Link)](https://github.com/your-username/lms-frontend) – Work in progress.

---

## 📩 Contact

For queries or suggestions:  
**Sagar Das**  
📧 `your-email@example.com`  
🔗 [LinkedIn](https://www.linkedin.com/in/your-profile)
