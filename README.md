# Taskion Backend Documentation

## 1. Introduction
**Taskion** is a **Todo List system powered by AI**.  
It goes beyond a regular task manager by providing:  
- AI-generated task descriptions and suggestions.  
- A chatbot assistant for creating tasks, planning, and guidance.  
- Trash management for restoring or permanently deleting tasks.  

The system is designed for **individual users** (not collaborative/multi-team).  

---

## 2. Tech Stack
- **Backend Framework**: Next.js (App Router)  
- **Database**: PostgreSQL (Supabase)  
- **AI Enhancer**: n8n (self-hosted)  
- **Chatbot**: Typebot (embedded in frontend) + WhatsApp integration via Evolution API (self-hosted)  
- **Deployment**:  
  - API on **Vercel**  
  - n8n, Evolution API, and Typebot on **VPS**  

---

## 3. Architecture Overview
- **Frontend** → calls API routes in Next.js.  
- **Backend (Next.js API)** → manages users, tasks, task statuses, and trash.  
- **AI Integration (n8n)** → triggered to enhance tasks (generate descriptions, priorities, planning).  
- **Chatbot (Typebot + WhatsApp)** → interacts with users, forwards task actions to API.  
- **Database (Supabase PostgreSQL)** → persistent storage.  

---

## 4. Authentication & Authorization
- **Authentication Method**:  
  - Email-only login (no password).  
  - Stored in **HTTP-only cookies**.  
  - Users are persisted in the database.  

- **Authorization**:  
  - No roles or permission system.  
  - All users have the same access level.  

- **Security**:  
  - No advanced rate-limiting yet (see section *Security Recommendations*).  

---

## 5. API Endpoints

### Base URL
/api

### Auth
- `POST /auth/login` – Log in with email (no password).  
- `POST /auth/logout` – Logout and clear cookie.  
- `GET /auth/me` – Get current logged user.  

### Users
- `GET /users` – List all users.  
- `GET /users/:id` – Get user by ID.  
- `POST /users` – Create new user.  

### Tasks
- `GET /tasks` – List tasks (paginated).  
- `GET /tasks/:id` – Get task by ID.  
- `POST /tasks` – Create new task (AI-enhanced).  
- `PATCH /tasks/:id` – Update task details.  
- `DELETE /tasks/:id` – Soft-delete a task (moves to Trash).  

### Task Status
- `GET /task-status` – List all available statuses.  
- `PATCH /tasks/:id/status` – Update task status (`not started`, `in progress`, `done`).  

### Trash
- `GET /trash` – List all deleted tasks.  
- `PATCH /trash/:id/restore` – Restore deleted task.  
- `DELETE /trash/:id` – Permanently delete task.  

---

## 6. Standardized Responses

### Success Response
```ts
export interface ApiResponse<TData> {
  success: boolean
  message: string
  data: TData
}
```

### Paginated Response
```ts
export interface PaginatedApiResponse<TData> {
  success: boolean
  message: string
  data: TData[]
  nextCursor?: Cursor
  hasMore: boolean
}
```

### Error Response
```ts
export interface ErrorResponse {
  message: string
  errors?: FieldError[]
}
```

- Standard HTTP status codes used: 200, 400, 401, 404, 500.
- Global ErrorHandler ensures consistent error output.

## 7. Database Models

```sql
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.task_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  color text NOT NULL,
  icon text NOT NULL,
  order bigint NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status_id uuid NOT NULL REFERENCES public.task_status(id),
  user_id uuid NOT NULL REFERENCES public.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  deleted_at timestamptz,
  order bigint NOT NULL DEFAULT 0
);

```

## 8. AI Integration

- **n8n**:
    - Enhances tasks by generating descriptions and suggesting priorities.
    - Triggered automatically when a task is created.
- **Typebot**:
    - Embedded in frontend UI.
    - Also available via WhatsApp (Evolution API).
    - Provides conversational task creation and planning assistance.

---

## 9. Middleware & Utilities

- **Validation**: Zod schema validation.
- **Error Handling**: Centralized `ErrorHandler` with custom error classes.
- **Cache**: No backend cache; handled by frontend request caching.

---

## 10. Deployment

- **Backend API** deployed on **Vercel**.
- **n8n, Typebot, Evolution API** self-hosted on a VPS.
- **Database** hosted on Supabase (PostgreSQL).

---

## 11. Testing

- Currently **no automated tests**.
- Future plan: unit tests with Jest + integration tests with Supertest.

---

## 12. Security Recommendations

Although not fully implemented, recommended best practices:

- Add **rate limiting** (e.g., 100 requests/minute per user).
- Implement **JWT-based authentication** with refresh tokens.
- Add **role-based access control (RBAC)** for future multi-user/team scenarios.
- Enable **logging & monitoring** for debugging and performance analysis.

---

## 13. Changelog / Versioning

- API currently has **no versioning** (endpoints under `/api`).
- Suggested future approach: `/api/v1/...` for better maintainability.

---

## 14. Example Usage

### Create Task Request

```
POST /api/tasks
Content-Type: application/json

{
  "title": "Study for upcoming test"
}

```

### Create Task Response

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "uuid",
    "title": "Study for upcoming test",
    "description": "Prepare study plan with notes and review previous exercises",
    "status_id": "uuid",
    "user_id": "uuid",
    "created_at": "2025-09-03T02:00:00Z"
  }
}

```