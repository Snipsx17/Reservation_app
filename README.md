# Restaurant Reservation System

A restaurant reservation management system built with modern technologies for efficient booking and administration.

## 📋 Project Overview

This system enables restaurants to manage reservations online while providing customers an easy booking experience. The project consists of a NestJS backend API and an Astro frontend with React islands for interactive components.

**Key Features:**
- Multi-restaurant support
- User role management (SuperAdmin/Admin)
- Online reservation system
- Admin dashboard for reservation management
- Email notifications
- Restaurant configuration (schedules, capacity)

## 🛠️ Tech Stack

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + Passport with refresh tokens
- **Validation**: class-validator, class-transformer
- **Logging**: Winston with daily rotation
- **Email Service**: Resend (planned)
- **Development**: Docker Compose for local database

### Frontend (Planned)
- **Framework**: Astro 
- **Interactive Components**: React 
- **Admin Dashboard**: Astro + React

## 🏗️ Current Development Status

### ✅ Completed Features

#### Backend Setup
- [x] **Project Initialization**
  - NestJS project setup with TypeScript
  - Basic folder structure following NestJS conventions
  - Dependencies installed (Prisma, PostgreSQL, Config)

- [x] **Configuration Management**
  - Environment variables setup with `@nestjs/config`
  - Configuration validation with Joi
  - Database configuration extracted to separate file
  - Clean separation between development and production configs

- [x] **Database Setup**
  - PostgreSQL integration with Prisma ORM
  - Docker Compose for local development database
  - Prisma configured with custom client generation
  - Database connection using PrismaService

- [x] **Authentication System**
  - JWT authentication with Passport strategies
  - Refresh token system with database storage
  - Role-based authorization (SUPER_ADMIN, ADMIN)
  - Password hashing with bcrypt

- [x] **Logging System**
  - Winston logger with daily file rotation
  - Configurable log levels and formats
  - Separate error and application logs

- [x] **Project Structure**
  ```
  backend/
  ├── src/
  │   ├── auth/             # Authentication module
  │   │   ├── guards/       # Auth guards (Local, JWT)
  │   │   ├── strategies/   # Passport strategies
  │   │   └── types.d.ts    # Type definitions
  │   ├── common/           # Shared utilities
  │   │   ├── helpers/      # Crypto and UUID helpers
  │   │   └── logger/       # Winston logger configuration
  │   ├── config/           # App configuration
  │   ├── users/            # User management module
  │   │   └── dto/          # Data transfer objects
  │   ├── prisma/           # Prisma service
  │   ├── tasks/            # Background tasks (token cleanup)
  │   ├── generated/        # Prisma generated client
  │   ├── app.module.ts     # Root module
  │   └── main.ts          # Application entry point
  ├── prisma/
  │   └── schema.prisma     # Database schema
  ├── docker-compose.yml    # Local database setup
  └── package.json         # Dependencies and scripts
  ```

#### Database Schema (Current)
- [x] **User Model**
  - Unified user table with role-based access (SUPER_ADMIN/ADMIN)
  - Email verification system
  - Secure password storage with bcrypt
  - Refresh token management

- [x] **Restaurant Model**  
  - Restaurant information and configuration
  - Admin assignment (one-to-many relationship)
  - Capacity and operational settings

- [x] **Schedule Model**
  - Flexible scheduling system per restaurant
  - Multiple shifts per day support
  - Configurable reservation blocks and capacity

- [x] **Reservation System Models**
  - Reservation with status tracking
  - Customer information storage
  - Notes and dietary restrictions support

- [x] **Refresh Token System**
  - Secure token storage with device tracking
  - IP and user agent logging for security
  - Automatic cleanup of expired tokens

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Yarn package manager
- Docker (optional, for local database)
- Prisma CLI (installed with dev dependencies)

### Backend Development

1. **Clone and install dependencies**
   ```bash
   cd backend
   yarn install
   ```

2. **Set up environment variables**
   ```bash
   # Copy and configure environment file
   cp .env.example .env
   # Edit .env with your database and JWT configurations
   ```

3. **Start local database (Docker)**
   ```bash
   docker-compose up -d
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations (when available)
   npx prisma migrate deploy
   ```

5. **Run the application**
   ```bash
   # Development mode
   yarn start:dev
   
   # Production build
   yarn build
   yarn start:prod
   ```

### Available Scripts

```bash
# Development
yarn start:dev          # Start with hot reload
yarn start:debug        # Start with debug mode

# Building
yarn build              # Build for production
yarn start:prod         # Run production build

# Code quality
yarn lint               # Run ESLint
yarn format             # Format code with Prettier

# Database management
npx prisma generate     # Generate Prisma client
npx prisma migrate dev  # Create and apply migration
npx prisma studio       # Database browser UI

# Testing (when implemented)
yarn test               # Run unit tests
yarn test:e2e           # Run e2e tests
yarn test:cov           # Test coverage
```

## 🔧 Configuration

### Environment Variables
```bash
# Database (Prisma uses DATABASE_URL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/restaurant_reservation"

# Alternative individual variables (for configuration)
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=restaurant_reservation

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_REFRESH_EXPIRES_IN=7d

# Application
PORT=3000
NODE_ENV=development

# Email Service (when implemented)
RESEND_API_KEY=your-resend-api-key
```

## 🤝 Contributing

### Commit Convention
Following conventional commits:
- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation updates
- `refactor:` code refactoring
- `chore:` maintenance tasks

## 📚 Documentation References

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Astro Documentation](https://docs.astro.build)

---

