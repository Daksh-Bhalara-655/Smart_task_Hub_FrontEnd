# Smart Task Hub Frontend

A React + Vite frontend for the Smart Task Hub project. This app provides a role-aware task management interface with authentication, protected routes, task listing, task updates, and admin task creation.

The frontend is designed to work with an Express backend that exposes authentication, user, and task APIs under `/api`.

## Overview

This project includes:

- A public landing page
- Login and registration flow
- Persistent session storage using `localStorage`
- A protected task dashboard
- Admin-only task creation tools
- Task filtering, search, status updates, and deletion
- Axios-based API services
- A custom Vite dev proxy for local backend development

## Tech Stack

- React 19
- Vite 8
- React Router DOM
- Axios
- Bootstrap
- React Icons
- ESLint

## Application Flow

### Public Routes

- `/`  
  Home / marketing-style landing page for the frontend workspace

- `/login`  
  Login and registration page

### Protected Route

- `/tasks`  
  Main dashboard for authenticated users

### Session Behavior

- Authentication responses are stored in `localStorage`
- Sessions are restored automatically on refresh
- Users without a token are redirected from `/tasks` to `/login`

## Features

### Authentication

- Register a new user with `POST /auth/register`
- Login an existing user with `POST /auth/login`
- Save auth response locally for protected access

### Task Dashboard

- Fetch tasks from the backend
- Filter tasks by status
- Search tasks by title, description, or assignee
- Update task status inline
- Delete tasks
- Show task metrics such as completion and urgency

### Admin Capabilities

- Fetch users for assignment
- Create new tasks
- Assign tasks to team members

## Project Structure

```text
Smart_task_Hub_FrontEnd/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Button.jsx
│   │   ├── Navbar.jsx
│   │   └── TaskItem.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   └── TaskPage.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── taskService.js
│   │   └── userService.js
│   ├── styles/
│   │   └── main.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Requirements

Before running the project, make sure you have:

- Node.js installed
- npm available

On some Windows setups, PowerShell blocks `npm.ps1`. If that happens, use:

```powershell
npm.cmd install
npm.cmd run dev
```

## Installation

Install dependencies:

```bash
npm install
```

Or on Windows PowerShell if script execution is blocked:

```powershell
npm.cmd install
```

## Environment Variables

The frontend supports several API environment variable names, with this priority:

1. `NEXT_PUBLIC_API_URL`
2. `VITE_API_URL`
3. `API_URL`
4. `VITE_PUBLIC_API_URL`
5. Fallback: `/api`

### Current `.env` Example

```env
API_URL=https://smart-task-hub-iota.vercel.app/api
API_PROXY_TARGET=http://127.0.0.1:5000
```

### What They Mean

- `API_URL`  
  The base URL Axios uses for requests in the frontend

- `API_PROXY_TARGET`  
  The backend target used by Vite when requests go through `/api` during local development

## Running the App

### Development

```bash
npm run dev
```

Windows PowerShell fallback:

```powershell
npm.cmd run dev
```

Default frontend URL:

```text
http://localhost:3000
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Available Scripts

From `package.json`:

- `npm run dev`  
  Start the Vite development server

- `npm run start`  
  Alias for `vite`

- `npm run build`  
  Create a production build

- `npm run preview`  
  Preview the production build locally

- `npm run lint`  
  Run ESLint on the project

## Backend Integration

This frontend expects a backend that exposes routes similar to:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `GET /api/users`

### Local Development Setup

If you want to use the backend running on your machine:

1. Start the backend server
2. Make sure it listens on port `5000`
3. Use the Vite proxy target:

```env
API_PROXY_TARGET=http://127.0.0.1:5000
```

4. Restart the Vite dev server after any `.env` changes

### Remote / Deployed Backend Setup

If you want to use a deployed backend directly:

```env
API_URL=https://your-backend-domain.com/api
```

In this case, Axios will call the remote backend directly instead of depending on the local proxy.

## API Service Layer

The service layer is organized like this:

- `src/services/api.js`  
  Axios instance and shared error handling

- `src/services/authService.js`  
  Login, register, session storage helpers

- `src/services/taskService.js`  
  Fetch, create, update, and delete tasks

- `src/services/userService.js`  
  Fetch assignable users for admin task creation

## Authentication Storage

The app stores the signed-in session under:

```text
smart-task-hub-session
```

This key is used to:

- restore the session on refresh
- protect dashboard access
- clear the session on logout

## UI Notes

The interface currently includes:

- A public home page
- A redesigned login / register screen
- A protected task board
- Role-aware admin and standard-user views
- Custom styling in `src/styles/main.css`

## Troubleshooting

### Vite Proxy Error: `ECONNREFUSED ::1:5000`

This usually means one of these:

- The backend is not running
- The backend is not listening on port `5000`
- The proxy is trying `localhost`/IPv6 while the backend only responds on IPv4

Current proxy fallback uses:

```text
http://127.0.0.1:5000
```

### `.env` Changes Not Applying

Restart the Vite dev server after changing `.env`.

### PowerShell Blocks `npm`

Use:

```powershell
npm.cmd run dev
```

instead of:

```powershell
npm run dev
```

### Login Requests Fail

Check:

- the backend is running
- `API_URL` is correct
- the backend includes `/api/auth/login`
- CORS/backend deployment settings allow requests from the frontend

## Development Notes

- This is a Vite app, not a Next.js app
- The frontend supports `NEXT_PUBLIC_API_URL` for compatibility, but it is implemented through Vite config
- JSX component files use `.jsx`

## Recommended Next Improvements

- Add task detail view / modal
- Add loading skeletons
- Add toast notifications
- Add role badges and user avatars
- Add automated frontend tests
- Add `.env.example`

## License

This project currently has no explicit license file in this frontend directory.
