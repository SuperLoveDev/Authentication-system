# Authentication-system

A full stack Secure user authentication platform featuring registration, login, password reset,logout, and OTP verification.”

# Endpoint Description

POST /api/user-registration Register new user with OTP Verification
POST /api/verify-user Verify user OTP
POST /api/login-user User login
POST /api/logout-user User logout
POST /api/user-forgot-password Password reset request with OTP rate limit
POST /api/verify-user-forgot-password Verify reset OTP
POST /api/reset-user-password complete password reset

### **Frontend**

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **React Hook Form** for form management
- **TanStack Query** for server state
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for HTTP requests

### **Backend**

- **Node.js** with Express.js
- **TypeScript** development
- **Prisma ORM** with MongoDB
- **Redis** for OTP storage and rate limiting
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Nodemailer** for email services
- **EJS** for email templates

# Utilities

https://img.shields.io/badge/JWT-Auth-purple?style=for-the-badge&logo=jsonwebtokens

https://img.shields.io/badge/Bcrypt-5.0-yellow?style=for-the-badge

https://img.shields.io/badge/Nodemailer-6.0-blue?style=for-the-badge

https://img.shields.io/badge/EJS-Templates-orange?style=for-the-badge

https://img.shields.io/badge/Rate_Limiting-Enabled-red?style=for-the-badge

# clone my repo

git clone https://github.com/SuperLoveDev/Authentication-System.git
