# School Management App Backend Architecture Plan

This document outlines the detailed plan for developing the backend of the school management application, based on the agreed-upon tech stack and architectural preferences.

## Backend Tech Stack Summary

*   **Language:** TypeScript
*   **Runtime:** Node.js
*   **Web Framework:** Express.js
*   **ORM:** Prisma
*   **Database:** PostgreSQL
*   **Authentication:** JWT (with `jsonwebtoken`, `bcrypt` for password hashing, and a refresh token mechanism)
*   **Authorization:** Role-Based Access Control (RBAC)
*   **Validation:** Joi
*   **Logging:** Winston
*   **Environment Management:** `dotenv`
*   **Error Handling:** Centralized error middleware with custom error classes
*   **Testing:** Jest (for both unit and integration tests)

## Detailed Plan for Backend Development

### 1. Project Setup (Completed)

*   Initialized a new Node.js project with TypeScript.
    *   `package.json` created and configured (Note: Contains a known syntax error that prevents the application from starting).
    *   `tsconfig.json` configured to include custom type declarations.
*   Installed core dependencies: `express`, `prisma`, `pg`, `dotenv`, `jsonwebtoken`, `bcrypt`, `joi`, `winston`, `cors`.
*   Installed development dependencies: `typescript`, `ts-node`, `nodemon`, `@types/node`, `@types/express`, `@types/jsonwebtoken`, `@types/bcrypt`, `@types/joi`, `@types/cors`, `jest`, `@types/jest`, `supertest`, `@types/supertest`.
*   Set up `package.json` scripts for development, build, and testing.

### 2. Database and ORM Setup (Prisma) (Completed)

*   Initialized Prisma in the project.
*   Configured `src/prisma/schema.prisma` with PostgreSQL as the data source and defined the connection string in `.env`.
*   Translated the refined database schema into Prisma schema models in `src/prisma/schema.prisma`.
*   Generated Prisma client.
*   Set up database migrations and applied the initial migration.
*   Created `src/prisma/seed.ts` for seeding initial data (e.g., default school, roles).

### 3. Application Structure (Initial Setup Completed)

Organized the project into logical modules within the `src` directory. The following core files and directories have been created:

```
src/
├── config/             # Environment variables and application settings
│   └── index.ts        # Created
├── utils/              # Common utility functions (e.g., password hashing, JWT)
│   ├── auth.ts         # Created
│   └── logger.ts       # Created
├── middlewares/        # Express middleware (auth, error, validation)
│   ├── auth.ts         # Created (Authentication & Authorization middleware - Known type error: Property 'user' does not exist on type 'Request')
│   ├── error.ts        # Created
│   └── validation.ts   # Created
├── controllers/        # Request handlers for API endpoints
│   ├── auth.controller.ts # Created
│   └── user.controller.ts # Created (Skeleton)
├── services/           # Business logic and data manipulation
│   ├── auth.service.ts # Created
│   └── user.service.ts # Created (Skeleton)
├── routes/             # API route definitions
│   ├── auth.routes.ts  # Created
│   └── user.routes.ts  # Created (Skeleton)
├── types/              # Custom TypeScript types/interfaces
│   └── express.d.ts    # Created (Extended Express Request type)
├── app.ts              # Express application setup (Created)
└── index.ts            # Entry point (Created)
```

### 4. Core Backend Components (Next Implementation Phase)

This section details the implementation of key backend functionalities. We will start with a skeleton and then add details.

#### Express App Setup (`src/app.ts`) (Completed)
*   Initialized the Express application.
*   Implemented basic middleware:
    *   `express.json()` for parsing JSON request bodies.
    *   `cors` for handling Cross-Origin Resource Sharing.
    *   Basic request logging (e.g., using Winston).

#### Authentication Module (`src/auth`) (Completed)
*   **Objective:** Implemented user registration, login, JWT generation/verification, and refresh token mechanism.
*   **Files created:**
    *   `src/utils/auth.ts`: For password hashing (`bcrypt`) and JWT token generation/verification (`jsonwebtoken`).
    *   `src/services/auth.service.ts`: Contains business logic for user authentication (e.g., `registerUser`, `loginUser`, `refreshTokens`).
    *   `src/controllers/auth.controller.ts`: Handles incoming requests for authentication (e.g., `register`, `login`, `refreshToken`).
    *   `src/routes/auth.routes.ts`: Defines API routes for authentication (e.g., `POST /api/v1/auth/register`, `POST /api/v1/auth/login`).
*   **Key considerations:** Password hashing, JWT signing/verification, refresh token storage and invalidation.

#### Authorization (RBAC) (`src/middlewares/auth.ts`) (Implemented - Known Issue)
*   **Objective:** Developed middleware to enforce Role-Based Access Control (RBAC).
*   **File created:**
    *   `src/middlewares/auth.ts`: Contains middleware functions to verify JWTs and check user roles against required permissions.
*   **Known Issue:** TypeScript error `Property 'user' does not exist on type 'Request'` persists, preventing compilation. This needs further investigation for a proper type-safe solution.
*   **Key considerations:** How to fetch user roles from the database (via Prisma), how to define and check permissions.

#### Validation (`src/middlewares/validation.ts`) (Implemented)
*   **Objective:** Implemented data validation for incoming API requests using Joi.
*   **File created:**
    *   `src/middlewares/validation.ts`: Contains middleware functions that use Joi schemas to validate request bodies, query parameters, and path parameters.
*   **Key considerations:** Defining Joi schemas for different request types, integrating with error handling.

#### Error Handling (`src/middlewares/error.ts`) (Completed)
*   Implemented custom error classes (e.g., `ApiError`, `NotFoundError`, `BadRequestError`, `UnauthorizedError`, `ForbiddenError`) extending `Error`.
*   Created a centralized error handling middleware at the end of the Express middleware chain to catch all errors and send consistent, formatted JSON error responses.

#### Logging (`src/utils/logger.ts`) (Completed)
*   Configured Winston for structured logging.
*   Set up different log levels (e.g., `info`, `warn`, `error`).
*   Output logs to console, file, or integrate with external logging services.

### 5. API Endpoints (CRUD Operations) (Next Implementation Phase)

*   **Objective:** Created skeleton API endpoints for a primary entity (e.g., `users`) to demonstrate the full flow.
*   **Files created (skeleton for `users`):**
    *   `src/controllers/user.controller.ts`: Basic CRUD handlers for user-related operations.
    *   `src/services/user.service.ts`: Business logic for user data manipulation (e.g., `createUser`, `getUserById`, `updateUser`, `deleteUser`).
    *   `src/routes/user.routes.ts`: Defines API routes for user management (e.g., `GET /api/v1/users`, `POST /api/v1/users`).
*   **Key considerations:** How to integrate Prisma Client, apply authentication/authorization/validation middleware.

### 6. Testing (To be implemented)

*   **Unit Tests:**
    *   Use Jest to test individual functions, services, and utility modules in isolation.
    *   Mock external dependencies (e.g., Prisma client, external APIs).
*   **Integration Tests:**
    *   Use Jest and `supertest` to test API endpoints.
    *   Simulate HTTP requests to your Express application.
    *   Verify responses and database interactions (e.g., creating test data, asserting changes).
    *   Set up a separate test database for integration tests.

### 7. Documentation (Ongoing)

*   This `backend_architecture.md` file is being updated to document the chosen tech stack, architectural decisions, and project structure.
*   Consider using OpenAPI/Swagger for API documentation.

## High-Level Backend Architecture Diagram

```mermaid
graph TD
    A[Client Application] --> B(API Gateway / Load Balancer)
    B --> C[Express.js Backend]

    subgraph Express.js Backend
        C --> D[Routes]
        D --> E[Controllers]
        E --> F[Services]
        F --> G[Prisma ORM]
        G --> H[PostgreSQL Database]

        C -- Middleware --> I[Authentication (JWT)]
        C -- Middleware --> J[Authorization (RBAC)]
        C -- Middleware --> K[Validation (Joi)]
        C -- Middleware --> L[Error Handling]
        C -- Logging --> M[Winston Logger]
    end

    I -- Uses --> N[Bcrypt (Password Hashing)]
    I -- Uses --> O[Jsonwebtoken (JWT)]
    F -- Uses --> P[Environment Variables (.env / dotenv)]