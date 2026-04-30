# AnimeHub - Anime & Movie Recommendation Hub

## Overview

AnimeHub is a full-stack web application that allows users to browse, create, and manage anime and movie titles. Users can register, log in, add titles, write reviews, and receive dynamic recommendations. The application demonstrates complete CRUD functionality along with authentication and filtering features.

---

## Features

* User authentication (Register & Login)
* Create, edit, and delete titles (Anime/Movie)
* Browse and search titles
* Filter by type and genre
* Add and delete reviews
* View personal reviews in profile
* AI-based recommendation system
* Protected routes for authenticated users

---

## Technologies Used

### Frontend

* React (Vite)
* React Router DOM
* Axios
* CSS

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* bcrypt
* express-validator

---

## Project Structure

```
WSA500-AnimeHub/
│
├── client/        # React frontend
├── server/        # Express backend
├── README.md
└── .gitignore
```

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/PawKoi/anime-movie-recommendation-hub
cd WSA500-AnimeHub
```

---

### 2. Install dependencies

#### Server

```bash
cd server
npm install
```

#### Client

```bash
cd ../client
npm install
```

---

### 3. Environment Variables

Create `.env` file in **server**:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/animehub
JWT_SECRET=your_secret_key
PORT=4000
```

Create `.env` file in **client**:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

---

### 4. Run the application

#### Start backend

```bash
cd server
npm run dev
```

#### Start frontend

```bash
cd client
npm run dev
```

---

### 5. Open in browser

```
http://localhost:5173
```

---

## API Endpoints (Summary)

### Auth

* POST `/api/auth/register`
* POST `/api/auth/login`

### Titles

* GET `/api/titles`
* GET `/api/titles/:id`
* POST `/api/titles`
* PUT `/api/titles/:id`
* DELETE `/api/titles/:id`

### Reviews

* GET `/api/reviews/title/:id`
* POST `/api/reviews/title/:id`
* DELETE `/api/reviews/:id`
* GET `/api/reviews/me`

### AI Recommendation

* GET `/api/titles/ai/recommendation`

---

## Key Functionality

* Full CRUD operations for titles and reviews
* Authentication using JWT stored in localStorage
* Protected routes using custom `ProtectedRoute`
* Dynamic filtering using query parameters
* Recommendation system fetched from backend
* State synchronization between frontend and backend

---

## Notes

* `.env` files are not included for security reasons
* `node_modules` and build files are ignored using `.gitignore`
* Project is designed for academic purposes

---

## Author

Pawan Koirala

---
