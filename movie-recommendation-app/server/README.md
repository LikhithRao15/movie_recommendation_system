# Movie Recommendation App - Server Backend

This is the backend REST API server for the **Movie Recommendation System**, built with **Node.js**, **Express.js**, and **MongoDB**.

## 🚀 Features

- **JWT Authentication**: Secure user registration, login, and session validation
- **Password Reset**: OTP / token-based email password recovery via Nodemailer
- **MongoDB Mongoose**: Models for User, Movie Ratings, and Favorite collections
- **TMDB API Integration**: Server-side proxy for fetching live movie metadata and details
- **ML Recommendation Integration**: Communicates with the ML recommendation model microservice
- **Security Middleware**: Express Rate Limiting, Helmet headers, CORS policies, and Morgan HTTP logging

## 🛠️ Tech Stack

- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose ODM**
- **JWT** (`jsonwebtoken`) & `bcryptjs`
- **Nodemailer**
- **Axios**, **Helmet**, **Cors**, **Express-rate-limit**, **Morgan**

## 🔑 Environment Setup (`.env`)

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
TMDB_BEARER_TOKEN=your_tmdb_bearer_token
TMDB_BASE_URL=https://api.themoviedb.org/3
RECOMMENDATION_API_URL=https://ml-movie-recomedetion-model.onrender.com/rec
NODE_ENV=development
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

## 🏃 Running Server

```bash
# Development mode with Nodemon
npm run dev

# Production mode
npm start
```
