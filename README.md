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
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT + Passport
- **Validation**: class-validator, class-transformer
- **Email Service**: Resend
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
  - Dependencies installed (TypeORM, PostgreSQL, Config)

- [x] **Configuration Management**
  - Environment variables setup with `@nestjs/config`
  - Configuration validation with Joi
  - Database configuration extracted to separate file
  - Clean separation between development and production configs

- [x] **Database Setup**
  - PostgreSQL integration with TypeORM
  - Docker Compose for local development database
  - TypeORM configured with async factory pattern
  - Database connection using ConfigService instead of process.env

- [x] **Project Structure**
  ```
  backend/
  ├── src/
  │   ├── app/              # Main app controller
  │   ├── config/           # Configuration files
  │   │   ├── configuration.ts
  │   │   ├── config.interface.ts
  │   │   └── database.config.ts
  │   ├── app.module.ts     # Root module
  │   └── main.ts          # Application entry point
  ├── docker-compose.yml    # Local database setup
  └── package.json         # Dependencies and scripts
  ```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Yarn package manager
- Docker (optional, for local database)

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

4. **Run the application**
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

# Testing (when implemented)
yarn test               # Run unit tests
yarn test:e2e           # Run e2e tests
yarn test:cov           # Test coverage
```

## 🔧 Configuration

### Environment Variables
```bash
# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=restaurant_reservation

# Application
PORT=3000
NODE_ENV=development
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
- [TypeORM Documentation](https://typeorm.io)
- [Astro Documentation](https://docs.astro.build)

---

