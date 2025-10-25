# Authentication-system

A full stack Secure user authentication platform featuring registration, login, password reset, and OTP verification.”

# Features

User registration (/register)
Login (/login) with JWT
Logout (/logout)
Forgot password (/forgot-password)
Password reset (/reset-password)
OTP verification for email or phone
Temporary OTP storage with Redis
Token refresh (/refresh-token)
User profile retrieval (/me)
Secure password hashing with bcrypt
Middleware for authentication & request validation
Rate limiting for endpoint protection
Centralized error handling with AppError

Endpoint Description

/register POST Create a newuser  
/login POST Login with email/password
/logout POST Logout
/forgot-password POST Request password reset  
/reset-password POST Reset password using token
/verify-otp POST OTP verification  
/refresh-token POST Refresh JWT token

# Tech Stack

Backend: Node.js, TypeScript, Express
Database: Mongodb via Prisma ORM
Auth: JWT & bcrypt
Caching: Redis (OTP/session)
Frontend: React / Next.js
Architecture: Monorepo

# clone my repo

git clone https://github.com/SuperLoveDev/Authentication-System.git
