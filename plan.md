Single admin interface, The admin page will be accessed via /admin.

Anyone can take quizzes from the public pages.

Each quiz contains a title, optional description, an array of questions.

Questions support types: mcq (multiple choice, single correct), tf (true/false), text (open answer). You can extend easily.

Scoring: mcq and tf are auto-graded. text is not auto-graded it's marked incorrect unless exact match is configured.

MongoDB connection string is provided via MONGO_URI environment variable.


CRUD operations for quizzes (create, read, update, delete) via REST API.

/admin page to add/update/delete quizzes and questions.

Public pages to list quizzes and take a quiz with prev and next pagination; show score/result at the end.

Define Schema and routes for backend.

Frontend: Next.js (app router), Tailwind CSS for styling. Fetches backend API hosted on http://localhost:4000 (via env).

/admin: add new quiz, edit existing quiz, delete quiz, manage questions.

/ (Public) page: list quizzes.

/quiz/[id] (Public): take quiz and view results.

Backend: Express server with Mongoose models and REST routes.

models/Quiz.js - Mongoose schema

routes/quizzes.js - CRUD endpoints

index.js - server bootstrap