# 🎬 Movie Recommendation System

A full-stack **MERN (MongoDB, Express, React, Node.js)** Movie Recommendation Application integrated with a **Machine Learning Recommendation Engine** and the **TMDB (The Movie Database) API**. 

This application offers personalized movie recommendations, user authentication with password reset, detailed movie info with trailers, real-time search, movie rating capabilities, and customizable user favorites.

---

## 🚀 Features

- **🧠 Machine Learning Recommendations**: Personalized movie suggestions powered by an integrated ML recommendation microservice.
- **🎬 TMDB Integration**: Live movie metadata including trending titles, top-rated movies, cast details, release dates, genres, and trailers.
- **🔐 Secure Authentication**: Full user authentication using **JSON Web Tokens (JWT)** and **Bcrypt** password hashing.
- **📧 Password Reset Flow**: Secure OTP / email link reset system via **Nodemailer**.
- **⭐ Ratings & Reviews**: User movie rating system saved directly to MongoDB.
- **❤️ Favorites Management**: Save and organize favorite movies with instant sync.
- **🔍 Advanced Search & Filter**: Real-time search with genre filters and pagination.
- **⚡ Modern UI/UX**: Built with **React 19**, **Vite**, **Tailwind CSS**, **Framer Motion**, and **TanStack React Query**.
- **🛡️ Security & Scalability**: Includes **Helmet** security headers, **CORS** origin locking, rate limiting with **express-rate-limit**, and request logging with **Morgan**.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State & Data Fetching**: [TanStack React Query v5](https://tanstack.com/query) & [Axios](https://axios-http.com/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)

### **Backend**
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose ODM](https://mongoosejs.com/)
- **Authentication**: JWT (`jsonwebtoken`) & `bcryptjs`
- **Email Service**: `nodemailer`
- **Security & Utilities**: `helmet`, `cors`, `express-rate-limit`, `morgan`, `dotenv`

### **External Integrations**
- **TMDB API v3**: Movie data & poster images
- **ML Microservice API**: Recommendations engine model

---

## 📂 Project Structure

```text
movie_recommendation_system/
└── movie-recommendation-app/
    ├── package.json               # Root scripts & concurrently launcher
    ├── client/                    # React + Vite Frontend
    │   ├── public/                # Static assets
    │   ├── src/
    │   │   ├── assets/            # CSS & image resources
    │   │   ├── components/        # Reusable UI components (Navbar, MovieCard, etc.)
    │   │   ├── contexts/          # React contexts (AuthContext, etc.)
    │   │   ├── hooks/             # Custom React hooks
    │   │   ├── pages/             # Page views (Home, MovieDetail, Favorites, etc.)
    │   │   ├── services/          # API services & Axios instances
    │   │   ├── App.jsx            # App component & Router
    │   │   └── main.jsx           # Entry point
    │   ├── tailwind.config.js     # Tailwind CSS configuration
    │   ├── vite.config.js         # Vite configuration
    │   └── package.json
    └── server/                    # Express + Node.js Backend
        ├── config/                # Database connection & configurations
        ├── controllers/           # API request logic handlers
        ├── data/                  # Local datasets / fallback data
        ├── middleware/            # Auth & error handling middlewares
        ├── models/                # Mongoose schema definitions (User, Rating, etc.)
        ├── routes/                # Express API routes
        ├── utils/                 # Dataset loader & helpers
        ├── server.js              # Server entry point
        └── package.json
```

---

## ⚙️ Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (v9 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or a local MongoDB instance

---

### Installation Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/LikhithRao15/movie_recommendation_system.git
   cd movie_recommendation_system/movie-recommendation-app
   ```

2. **Install all dependencies** (installs root, client, and server dependencies):
   ```bash
   npm run install-all
   ```

---

## 🔑 Environment Variables

### Backend Configuration (`movie-recommendation-app/server/.env`)

Create a `.env` file in the `movie-recommendation-app/server` directory with the following variables:

```env
# Server Port
PORT=5001

# MongoDB Connection String
MONGODB_URI=your_mongodb_connection_string

# JWT Secret Key
JWT_SECRET=your_jwt_secret_key

# TMDB API Credentials
TMDB_BEARER_TOKEN=your_tmdb_bearer_token
TMDB_BASE_URL=https://api.themoviedb.org/3

# ML Recommendation Model API Endpoint
RECOMMENDATION_API_URL=https://ml-movie-recomedetion-model.onrender.com/rec

# Environment & Client URL
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Email Credentials for Password Reset
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### Frontend Configuration (`movie-recommendation-app/client/.env`)

Create a `.env` file in the `movie-recommendation-app/client` directory:

```env
VITE_API_URL=http://localhost:5001/api
```

---

## 🏃 Running the Application

From the `movie-recommendation-app` directory:

### Run Both Frontend & Backend Concurrently (Recommended)

```bash
npm run dev
```

- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5001`

### Run Services Separately

- **Backend Server Only**:
  ```bash
  npm run server
  ```

- **Frontend Client Only**:
  ```bash
  npm run client
  ```

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Server status check | Public |
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Login user & get JWT token | Public |
| `POST` | `/api/auth/forgot-password` | Request password reset email | Public |
| `POST` | `/api/auth/reset-password` | Reset password with token | Public |
| `GET` | `/api/movies/trending` | Fetch trending movies | Public |
| `GET` | `/api/movies/search` | Search movies by query/genre | Public |
| `GET` | `/api/movies/:id` | Fetch single movie details | Public |
| `GET` | `/api/recommendations` | Get personalized movie recommendations | Private |
| `GET` | `/api/favorites` | Get user favorites list | Private |
| `POST` | `/api/favorites` | Add/remove movie to/from favorites | Private |
| `GET` | `/api/ratings/:movieId` | Get user rating for a movie | Private |
| `POST` | `/api/ratings` | Submit/update movie rating | Private |

---

## 📝 Available Scripts

Inside `movie-recommendation-app/package.json`:

- `npm run dev`: Concurrently runs client and server development servers.
- `npm run server`: Launches the Express backend server with `nodemon`.
- `npm run client`: Starts the React frontend development server with `vite`.
- `npm run install-all`: Installs node modules for both server and client folders.
- `npm run build`: Compiles the React frontend for production distribution.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
