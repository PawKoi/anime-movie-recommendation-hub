# PROOF OF FUNCTIONALITY 

**Project:** Anime and Movie Recommendation Hub  

**Framework:** React (Vite)  

**Backend:** Node.js, Express.js, MongoDB, Mongoose  


---
---

## 1. Project Overview

Anime and Movie Recommendation Hub is a full stack web application where users register, log in, browse anime and movies, filter by type and genre, read and write reviews, and receive mock AI based recommendations. The application implements a REST API with authentication and a React single page application that consumes the API.  

Key features:  

- User registration and login with hashed passwords and JWT based authentication  
- Titles collection with type, genres, synopsis and poster URL  
- Reviews collection linked to users and titles  
- Protected create, update and delete operations for titles and reviews  
- Browse page with search and server side filtering  
- Mock AI recommendation section on the home page that rotates suggestions on refresh  

---
---

## 2. Data Model and ERD

### 2.1 Collections

1. **User**  

- `email` (String, required, unique, indexed)  
- `passwordHash` (String, required)  
- `createdAt` (Date, default: now)

2. **Title**  

- `name` (String, required, indexed)  
- `type` (String, enum: `"Anime"`, `"Movie"`, required)  
- `genres` (Array of String, required, indexed for filtering)  
- `year` (Number, optional)  
- `synopsis` (String, required)  
- `poster` (String, optional, URL to online image)  
- `ownerId` (ObjectId, ref: `User`, required)  
- `createdAt` (Date, default: now)  
- `updatedAt` (Date)

3. **Review**  

- `userId` (ObjectId, ref: `User`, required)  
- `titleId` (ObjectId, ref: `Title`, required, indexed)  
- `rating` (Number, required, min 1, max 5)  
- `text` (String, optional, max length validation)  
- `createdAt` (Date, default: now)

### 2.2 Relationships

- One user can author many titles  
- One user can write many reviews  
- One title has many reviews  

**ERD sketch (described)**

- `User (1) ───< (N) Title` via `Title.ownerId`  
- `User (1) ───< (N) Review` via `Review.userId`  
- `Title (1) ───< (N) Review` via `Review.titleId`  

---
---

## 3. Backend Architecture and API

### 3.1 Technology Stack

- Node.js, Express.js  
- MongoDB and Mongoose  
- JSON Web Tokens for authentication  
- bcrypt for password hashing  
- helmet and cors for security and CORS configuration  
- dotenv for environment configuration  

### 3.2 Folder Structure (server)

- `server/app.js`  
- `server/config/` database connection and environment  
- `server/models/` Mongoose schemas (`User`, `Title`, `Review`)  
- `server/routes/` route modules (`auth`, `titles`, `reviews`, `ai`)  
- `server/middleware/` authentication, validation, error handler  
- `server/seed/` seed script and sample JSON  
- `.env.example` with `MONGODB_URI`, `JWT_SECRET`, `PORT`  

### 3.3 Authentication Flow

1. **Registration** (`POST /api/auth/register`)  

- Validates email and password length on client and server  
- Hashes password using bcrypt  
- Stores `email` and `passwordHash`  
- Returns success response without token  

2. **Login** (`POST /api/auth/login`)  

- Validates credentials  
- Compares password with bcrypt  
- Issues JWT containing user id and email  
- Client stores token securely (memory plus local storage)  

3. **Protected Routes**  

- Middleware checks `Authorization: Bearer <token>`  
- Verifies token and attaches user to request  
- Required for create, update and delete on titles and reviews  

### 3.4 Title Endpoints

Base: `/api/titles`  

- `GET /api/titles`  
  - Query parameters: `page`, `limit`, `type`, `genre`, `search`  
  - Returns paginated list of titles filtered by type and genre  

- `GET /api/titles/:id`  
  - Returns a single title with owner reference  
  - Used by details page and review flows  

- `POST /api/titles` (auth required)  
  - Validates body: `name`, `type`, `genres`, `synopsis` required  
  - Sets `ownerId` from authenticated user  
  - Stores poster URL to be used as image and background   

- `PUT /api/titles/:id` (auth required, owner only)  
  - Allows editing of name, type, genres, year, synopsis, poster  
  - Checks `ownerId` against JWT user id   

- `DELETE /api/titles/:id` (auth required, owner only)  
  - Deletes the title and optionally associated reviews  

### 3.5 Review Endpoints

Base: `/api/reviews`  

- `GET /api/reviews/title/:titleId`  
  - Returns all reviews for a given title  
  - Used in Title detail page

- `POST /api/reviews/title/:titleId` (auth required)  
  - Validates rating and optional text  
  - Creates review linked to user and title  

- `DELETE /api/reviews/:id` (auth required, review owner only)  
  - Removes a review after confirmation  

### 3.6 AI Recommendation Endpoint

- `GET /api/titles/ai/recommendation`  
  - Returns a single randomly selected title from the database based on simple logic such as random sampling or genre weights  
  - Home page consumes this endpoint and displays a "best of the best" recommendation card  

---
---

## 4. Front End Architecture

### 4.1 Technology Stack

- React with Vite  
- React Router for SPA navigation  
- Axios or fetch for API integration  
- Context or custom hook for auth state  
- CSS with Flexbox and Grid for responsive layout  

Main pages:  

- Home / Landing  
- Browse Titles  
- Title Detail  
- Register  
- Login  
- Create Title  
- Edit Title  
- Profile  

### 4.2 Folder Structure (client)

- `client/src/main.jsx`, `App.jsx`  
- `client/src/pages/` `HomePage`, `TitlesListPage`, `TitleDetailPage`, `LoginPage`, `RegisterPage`, `TitleFormPage`, `ProfilePage`  
- `client/src/components/` shared UI pieces  
- `client/src/api/` API helpers for auth, titles and reviews  
- `client/src/context/AuthContext.jsx` for authentication state  
- `client/src/index.css` global styling  

### 4.3 Routing and Protected Views

React Router defines:  

- `/` Home  
- `/titles` Browse  
- `/titles/new` Create Title (protected)  
- `/titles/:id` Title Detail  
- `/titles/:id/edit` Edit Title (protected, owner only)  
- `/login` Login  
- `/register` Register  
- `/profile` Profile (protected)

Protected routes check the auth context token and redirect unauthenticated users to login.   

### 4.4 Forms and Client Validation

Forms:  

- Register  
- Login  
- Add/Edit Title  
- Add Review  

Client side checks:  

- Registration password length and confirm password match  
- Required fields for title and review  
- Helpful error message near inputs  

### 4.5 Responsive and Accessible UI

- Flexbox and Grid used for layout of nav bar, cards and forms  
- Media queries for smaller screens  
- Semantic HTML elements for headings, sections, lists and buttons  
- All interactive controls accessible via labels and clear focus states  
- Poster images include `alt` attributes  
- Empty states such as "No reviews yet" and "No titles found" provide helpful feedback  


---
---

## 5. Integration and Environment

### 5.1 Environment Variables

Two `.env.example` files are provided:  

- **Server** `.env.example`  
  - `MONGODB_URI=` connection string for MongoDB  
  - `JWT_SECRET=` secret key for JWT signing  
  - `PORT=` port for Express server

- **Client** `.env.example`  
  - `VITE_API_BASE_URL=` base URL of the backend (for example `http://localhost:4000/api`)

These files allow configuration without committing secrets to the repository.  

### 5.2 CORS and Security

- CORS configured to allow the client origin (`http://localhost:5173`) during development  
- helmet applied to set secure HTTP headers  
- Input validation added in the routes for registration, login, titles and reviews  


---
---

## 6. Feature Walkthrough with Figures

### 6.1 Project Setup and Seed Data

![Seed](./proof_with_screenshots/01_npm_run_seed.png)
**Figure 6.1 shows** the seed script running successfully and inserting initial users, titles, and reviews into MongoDB.

---

![Servers](./proof_with_screenshots/02_client_server_dev_running.png)
**Figure 6.2 shows** both the backend server and frontend development server running simultaneously.

---

![Home](./proof_with_screenshots/03_localhost_5173_accessed.png)
**Figure 6.3 shows** the application home page loading correctly on localhost.

---

![AI recommendation](./proof_with_screenshots/04_mock_AI_Recommendations_shown.png)
**Figure 6.4 shows** the AI recommendation card displayed on the home page.

---

![AI detail navigation](./proof_with_screenshots/05_click_on_mock_AI_recommendations_returns_the_review_page.png)
**Figure 6.5 shows** navigation from the recommendation card to the title detail page.

---

### 6.2 Browsing and Filtering Titles

![Browse no auth](./proof_with_screenshots/06_browse_titles_without_login.png)
**Figure 6.6 shows** browsing titles without authentication.

---

![Register](./proof_with_screenshots/07_registration_page_with_email_registration.png)
**Figure 6.7 shows** the user registration page.

---

![Password error](./proof_with_screenshots/08_password_6_characters_requirement_error.png)
**Figure 6.8 shows** client-side validation for password length.

---

![Login](./proof_with_screenshots/09_login_page_after_successfully_registered_after_proper_password.png)
**Figure 6.9 shows** the login page after registration.

---

![Logged in](./proof_with_screenshots/10_logged_in_successfully_as_pawankoirala.png)
**Figure 6.10 shows** successful login with user information displayed.

---

![Profile](./proof_with_screenshots/11_profile_page_shows_personal_info_and_reviews_added.png)
**Figure 6.11 shows** the profile page with user data and reviews.

---

![Filter Anime](./proof_with_screenshots/12_filter_by_type_ANIME.png)
**Figure 6.12 shows** filtering titles by Anime type.

---

![Anime detail](./proof_with_screenshots/13_accessing_the_anime_returned_after_applying_the_filter_drama.png)
**Figure 6.13 shows** an anime detail page after filtering.

---

![Write anime review](./proof_with_screenshots/14_writing_a_review_to_that_specific_anime.png)
**Figure 6.14 shows** entering a review for an anime.

---

![Submit anime review](./proof_with_screenshots/15_submitting_the_review_to_that_specific_anime.png)
**Figure 6.15 shows** the review successfully submitted.

---

![Filter Movies](./proof_with_screenshots/16_filter_by_type_MOVIES.png)
**Figure 6.16 shows** filtering titles by Movie type.

---

![Movie detail](./proof_with_screenshots/17_accessing_the_movie_returned_after_applying_the_filter_crime.png)
**Figure 6.17 shows** a movie detail page after applying filters.

---

### 6.3 Reviews Functionality

![Write movie review](./proof_with_screenshots/18_writing_a_review_to_that_specific_movie.png)
**Figure 6.18 shows** writing a review for a movie.

---

![Submit movie review](./proof_with_screenshots/19_submitting_the_review_to_that_specific_movie.png)
**Figure 6.19 shows** the submitted movie review.

---

![Profile reviews](./proof_with_screenshots/20_profile_section_shows_all_our_reviews.png)
**Figure 6.20 shows** all user reviews displayed in profile.

---

### 6.4 Titles CRUD (Create & Read)

![Add Title](./proof_with_screenshots/21_add_title_at_the_top_lets_us_add_a_new_movie_or_anime.png)
**Figure 6.21 shows** the create title page.

---

![Add Title filled](./proof_with_screenshots/22_adding_a_new_movie_recommendation_with_a_poster_link_as_a_display_picture.png)
**Figure 6.22 shows** a new movie being added.

---

![New movie list](./proof_with_screenshots/23_applying_appropriate_filter_returns_our_newly_added_movie.png)
**Figure 6.23 shows** the new movie appearing in filtered results.

---

![Owner controls](./proof_with_screenshots/24_selecting_our_newly_added_movie_lets_us_delete_it_as_a_user_who_created_it.png)
**Figure 6.24 shows** edit and delete options for the owner.

---

### 6.5 Titles CRUD (Update & Delete)

![Edit form](./proof_with_screenshots/25_edit_title_lets_us_edit_our_suggestions.png)
**Figure 6.25 shows** editing a title.

---

![Updated title](./proof_with_screenshots/26_accessing_the_newly_added_movie_after_changing_the_genre_synopis_and_poster.png)
**Figure 6.26 shows** updated title details.

---

![Select anime for review](./proof_with_screenshots/27_lets_add_a_new_review_to_full_metal_alchemist.png)
**Figure 6.27 shows** selecting a title for review.

---

![Write review](./proof_with_screenshots/28_review_written_to_full_metal_alchemist.png)
**Figure 6.28 shows** writing a review.

---

![Review added](./proof_with_screenshots/29_review_submitted_to_fullmetal_alchemist.png)
**Figure 6.29 shows** the review added.

---

![Delete review prompt](./proof_with_screenshots/30_review_delete_message_in_fullmetal_alchemis.png)
**Figure 6.30 shows** review delete confirmation.

---

![Logs confirm delete](./proof_with_screenshots/31_review_deleted_and_server_logs_confirm_the_GET_POST_DELETE.png)
**Figure 6.31 shows** backend logs confirming review operations.

---

![Edit again](./proof_with_screenshots/32_lets_update_the_movie_title_again.png)
**Figure 6.32 shows** editing the title again.

---

![PUT logs](./proof_with_screenshots/33_PUT_in_server_logs_proves_edit.png)
**Figure 6.33 shows** backend PUT request logs.

---

![Delete title prompt](./proof_with_screenshots/34_delete_our_recommended_movie.png)
**Figure 6.34 shows** delete confirmation for a title.

---

![No titles](./proof_with_screenshots/35_no_titles_found_after_deletion.png)
**Figure 6.35 shows** empty results after deletion.

---

### 6.6 AI Recommendation Behaviour

![Recommendation 1](./proof_with_screenshots/36_refreshing_the_page_returns_a_new_recommendation_everytime_part1.png)
**Figure 6.36 shows** the first recommendation result.

---

![Recommendation 2](./proof_with_screenshots/37_refreshing_the_page_returns_a_new_recommendation_everytime_part2.png.png)
**Figure 6.37 shows** a different recommendation after refresh.

---

![Recommendation 3](./proof_with_screenshots/38_refreshing_the_page_returns_a_new_recommendation_everytime_part3.png.png)
**Figure 6.38 shows** another recommendation variation.

---
---

## 7. Reflection

The most challenging aspect of this assignment involved maintaining consistent data shape between backend and frontend, especially for fields such as `ownerId` and `userId` for reviews. The problem surfaced when newly created reviews behaved differently from reviews fetched from the database and was resolved by normalizing id values on the client and adding clear ownership checks in the UI.  

Another important learning area was integrating authentication across both sides. Handling JWTs, protecting routes, and surfacing meaningful auth errors required careful coordination between Express middleware and React routing, which improved understanding of stateless authentication in a SPA.  

Designing a cohesive, responsive UI also required iteration. Adjusting card layouts, poster image handling and background effects for detail pages helped reinforce knowledge of Flexbox, Grid and media queries, while the mock AI recommendation feature added experience with encapsulating server-side business logic behind a simple endpoint.  

Future improvements for this project could include a real recommendation algorithm based on user ratings, watchlist functionality, pagination controls on the browse page and deployment to a public environment using a managed MongoDB instance, along with additional accessibility testing and keyboard navigation polish.  


---
---

## 8. Use of Generative AI

Perplexity for Students was used as a learning aid throughout development of this assignment. The tool supported understanding of concepts such as JWT based authentication, React component patterns, Express routing practices, and CSS layout techniques without directly copying code or configuration.  

All final implementation decisions, debugging steps, and design choices were made after validating ideas against course material, official documentation, and personal testing. The generative AI support served in a similar role to technical documentation or forum answers, helping clarify approaches and best practices while preserving originality of the final work.  

Generative AI does not provide a working script, only required ideas were taken and everything in the "Assignment02" directory is tested, updated and edited again and again by Pawan Koirala to make the Website Professional and Playful.




