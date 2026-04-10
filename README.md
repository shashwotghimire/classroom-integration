# classroom-integration

A REST API backend that integrates with the **Google Classroom API**, enabling teachers to manage their courses programmatically. Users authenticate via Google OAuth 2.0, and their credentials are stored to make authorized API calls on their behalf.

## Features

- **Google OAuth 2.0** – Authenticate with Google and receive a JWT for subsequent requests
- **Course Management** – List, create, update, and delete Google Classroom courses
- **JWT-protected routes** – All course endpoints require a valid bearer token
- **PostgreSQL + Prisma ORM** – Persistent storage for users, tokens, synced classes, students, assignments, and grade syncs

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | Express 5 |
| ORM | Prisma 7 |
| Database | PostgreSQL |
| Auth | Google OAuth 2.0, JWT |
| Validation | Zod |

## Prerequisites

- Node.js ≥ 18
- PostgreSQL database
- A Google Cloud project with the **Google Classroom API** enabled and OAuth 2.0 credentials configured

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/classroom_integration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
JWT_SECRET=your_jwt_secret
PORT=8000
```

### 3. Run database migrations

```bash
npx prisma migrate deploy
```

### 4. Start the development server

```bash
npm run dev
```

The server starts on `http://localhost:8000` by default.

## API Endpoints

### Authentication

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/auth/google` | Returns the Google OAuth authorization URL |
| `GET` | `/api/auth/google/callback` | Handles the OAuth callback; returns a JWT |

**OAuth flow:**
1. Call `GET /api/auth/google` to get the authorization URL.
2. Open the URL in a browser and authorize with your Google account.
3. Google redirects to the callback, which returns a `accessToken` (JWT).
4. Pass the JWT as a `Bearer` token in the `Authorization` header for all protected requests.

### Courses *(require `Authorization: Bearer <token>`)*

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/classroom/courses` | List active courses (up to 20) |
| `GET` | `/api/classroom/courses/:courseId` | Get a course by ID |
| `POST` | `/api/classroom/courses` | Create a new course |
| `PUT` | `/api/classroom/courses/:courseId` | Update a course |
| `DELETE` | `/api/classroom/courses/:courseId` | Delete a course |

**Create/Update course body:**

```json
{
  "name": "Math 101",
  "section": "Period 1",
  "room": "Room 12",
  "description": "Introduction to Algebra"
}
```

## Project Structure

```
src/
├── app.ts                  # Express app setup
├── server.ts               # Entry point
├── controllers/            # Request handlers
├── integrations/           # Google OAuth & Classroom API clients
├── middleware/             # Auth, error handling, validation
├── routes/                 # Route definitions
├── utils/                  # Prisma client, JWT helpers
└── validation/             # Zod schemas
prisma/
├── schema.prisma           # Database schema
└── migrations/             # Migration files
```

## Database Schema (Prisma)

- **User** – Registered users (teachers/students/admins)
- **GoogleToken** – Stored OAuth tokens per user
- **GoogleWorkspaceConnection** – Google Workspace domain connections
- **SyncedGoogleClass** – Classes synced from Google Classroom
- **SyncedGoogleStudent** – Students synced per class
- **GoogleClassroomAssignment** – Assignments mapped to Google Classroom
- **GoogleGradeSync** – Grade sync records per student/assignment
