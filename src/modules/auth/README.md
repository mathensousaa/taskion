# Authentication Module

This module provides a complete authentication system for the Taskion application, including login, signup, and route protection.

## Components

### AuthContainer
The main container component that manages switching between login and signup forms. It provides a clean, Notion-like interface with proper branding and visual hierarchy.

### LoginForm
A client component that handles user login with the following features:
- Single email input field
- Real-time validation using Zod
- API integration with `/api/login`
- Loading states and error handling
- Automatic redirection after successful login

### SignupForm
A client component that handles user registration with the following features:
- Name and email input fields
- Validation (name: min 6 chars, email: valid format)
- User creation via `/api/users`
- Automatic login after successful signup
- Comprehensive error handling

## Services

### authService
Located in `/src/modules/auth/services/auth.service.ts`, this service provides:
- `login(data: LoginInput)` - Authenticates users
- `logout()` - Logs out users
- `me()` - Gets current user information

## Hooks

### useAuth
A custom hook that manages authentication state across the application:
- User information
- Authentication status
- Loading states
- Login/logout functions
- Automatic session checking

## Route Protection

### ProtectedRoute Component
A wrapper component that:
- Checks authentication status
- Shows loading states
- Redirects unauthenticated users to login
- Protects dashboard routes

### Middleware
Next.js middleware that:
- Intercepts requests to protected routes
- Checks for session cookies
- Redirects unauthenticated users
- Handles public route access

## Usage

### Protecting Routes
```tsx
import { ProtectedRoute } from '@/components/protected-route'

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  )
}
```

### Using Authentication State
```tsx
import { useAuth } from '@/hooks/use-auth'

export function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth()
  
  if (!isAuthenticated) return null
  
  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

## API Endpoints

- `POST /api/login` - User authentication
- `POST /api/logout` - User logout
- `GET /api/me` - Get current user
- `POST /api/users` - User registration

## Styling

The authentication interface follows Notion's design principles:
- Clean, minimal forms
- Subtle shadows and borders
- Consistent spacing and typography
- Loading states and feedback
- Error handling with clear messaging

## Security Features

- HTTP-only cookies for session management
- Server-side authentication validation
- Protected route middleware
- Automatic session checking
- Secure logout functionality
