# Authentication Setup Guide

This guide explains how to integrate the Next.js frontend with the existing FastAPI authentication system using Clerk for JWT token generation.

## 🔧 Setup Instructions

### 1. Environment Configuration

1. Copy the environment example file:

   ```bash
   cp .env.example .env.local
   ```

2. Get your Clerk keys from [Clerk Dashboard](https://dashboard.clerk.com/):

   - Sign up for a free Clerk account
   - Create a new application
   - Copy the publishable key and secret key

3. Update `.env.local` with your actual keys:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
   CLERK_SECRET_KEY=sk_test_your_actual_secret_here
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

### 2. Backend Integration

The frontend integrates with the existing FastAPI authentication system:

- **Authentication Logic**: All handled by FastAPI backend (not frontend)
- **JWT Tokens**: Frontend gets tokens from Clerk, sends to FastAPI backend
- **User Management**: Backend handles user creation, credit management, etc.
- **API Communication**: Frontend uses custom API client to communicate with backend
- **CORS**: Backend already includes `http://localhost:3000` in allowed origins

### 3. Authentication Flow

#### **For Unauthenticated Users:**

1. **Landing Page**: Users click "Get Started" or "Try for Free"
2. **Auth Page**: Navigates to `/auth?redirect_mode=new_tab`
3. **Clerk Authentication**: User completes sign-in/sign-up
4. **Auth Success**: Redirects to `/auth-success?open_app=true`
5. **New Tab**: Opens `/app` in new tab and closes auth tab
6. **JWT Token**: Clerk provides JWT token to frontend
7. **API Integration**: Frontend sends JWT token to FastAPI backend

#### **For Authenticated Users:**

1. **Landing Page**: Users click "Get Started" or "Try for Free"
2. **Direct Redirect**: Immediately opens `/app` in new tab
3. **No Auth Required**: User is already authenticated

## 🎯 Features Implemented

### ✅ Component Organization

- Landing page components moved to `src/components/landing/`
- Clean separation between public and authenticated areas

### ✅ Navigation Updates

- Removed "Sign In" button from header
- "Get Started" and "Try for Free" open auth in new tab
- Proper redirect flow after authentication

### ✅ Clerk Integration

- ClerkProvider configured in root layout
- Custom styled auth components matching design
- Automatic redirects after sign-in/sign-up

### ✅ Protected Routes

- Middleware protects `/app` routes
- Automatic redirect to auth for unauthenticated users
- User button with profile management

### ✅ Backend Integration

- Custom API client (`src/lib/api.ts`) for FastAPI communication
- JWT tokens automatically sent with all API requests
- Real-time user data fetching from backend
- Error handling and loading states
- Compatible with existing user_profiles table and credit system

### ✅ API Endpoints Used

- `GET /api/v1/users/profile` - Fetch user profile and credits
- `GET /api/v1/users/health` - Check authentication status
- `GET /api/v1/credits/balance` - Get current credit balance
- `GET /api/v1/credits/packages` - Available credit packages
- `POST /api/v1/images/generate` - Generate images (ready for implementation)

## 🚀 Running the Application

1. **Start the backend** (in `backend-fastapi/`):

   ```bash
   python start_server.py
   ```

2. **Start the frontend** (in `frontend-next/`):

   ```bash
   npm run dev
   ```

3. **Test the flow**:
   - Visit `http://localhost:3000`
   - Click "Get Started" or "Try for Free"
   - Complete authentication in the new tab
   - Verify redirect to `/app` page

## 🔍 Troubleshooting

### Common Issues

1. **Clerk keys not working**: Make sure you're using the correct environment (test vs production)
2. **CORS errors**: Ensure backend is running and includes `http://localhost:3000` in allowed origins
3. **Redirect issues**: Check that `afterSignInUrl` and `afterSignUpUrl` are set to `/app`

### Environment Variables

Make sure these are set in `.env.local`:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_` or `pk_live_`)
- `CLERK_SECRET_KEY` (starts with `sk_test_` or `sk_live_`)
- `NEXT_PUBLIC_API_URL` (backend URL, default: `http://localhost:8000`)

## 📝 Next Steps

The authentication system is now ready! The next phase would be to implement:

1. **Image Generation Interface**: Connect to the FastAPI backend
2. **Credit Management**: Display and manage user credits
3. **Gallery**: Show user's generated images
4. **Settings**: User preferences and account management

The foundation is solid and ready for these features to be built on top of it.
