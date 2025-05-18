#  Social Network API – NestJS Backend

This is a full-featured **Social Network API** built with **NestJS**, featuring authentication, user management, and ready-to-deploy CI/CD configuration.

---

##  Architecture

The project follows **modular architecture**, organized around core domains such as `auth` and `users`. It uses **Dependency Injection**, **DTO validation**, and **interface-based contracts**.


---

##  Technologies Used

- **[NestJS](https://nestjs.com/)** – Progressive Node.js framework
- **TypeScript** – Static typing for scalability
- **PostgreSQL** – Relational database (via `pg` package)
- **JWT (jsonwebtoken)** – Secure user authentication
- **bcrypt** – Password hashing
- **Swagger** – API documentation
- **ESLint + Prettier** – Linting and formatting
- **Jest** – Unit & e2e testing
- **GitHub Actions** – CI/CD
- **Railway** – Cloud deployment

---

##  Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL
- Railway CLI (for deployment)

### Installation

```bash
# Install dependencies
npm install

# Create a .env file
cp .env.example .env

# Build project
npm run build

# Run in development mode
npm run start:dev

```

# Run unit tests
npm run test

# Run test with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e

## .env

DATABASE_URL=postgresql://user:password@localhost:5432/social_network
JWT_SECRET=your_secret_key
PORT=3000


## DOCS
local: http://localhost:3000/api
main: https://social-network-api-production-d6ad.up.railway.app/api