# Movie Recommendation App - Client Frontend

This is the frontend client for the **Movie Recommendation System**, built with **React 19**, **Vite**, **Tailwind CSS**, **Framer Motion**, and **TanStack React Query**.

## 🚀 Features

- Modern, responsive Dark Theme UI
- Dynamic homepage featuring trending movies, top-rated movies, and category sliders
- Full search page with genre filtering and real-time query results
- Detailed movie view with synopsis, cast, runtime, user ratings, and trailer video modal
- User authentication views (Login, Signup, Forgot Password, Reset Password)
- Protected pages for User Profile & Favorites
- Fast data caching and asynchronous state management powered by TanStack Query

## 🛠️ Tech Stack

- **React 19** & **Vite**
- **Tailwind CSS** + **PostCSS**
- **Framer Motion** for animations
- **React Router v7** for page navigation
- **TanStack React Query v5** for server-state caching
- **Axios** for API integration
- **React Icons**

## 🏃 Setup & Local Running

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure `.env`**:
   Create a `.env` file in `client/`:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```
