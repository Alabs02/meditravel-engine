# 🚀 MediTravel Engine – Core API

> **The journey to your beauty – Top-Rated Clinics, Affordable Prices**  
> Built with NestJS, Firebase, MongoDB, and Swagger. Production-grade, secure,
> and scalable.

---

## 🧠 Overview

MediTravel Engine is the backend core powering the MediTravel platform — a
medical tourism service connecting users with verified clinics worldwide.

It provides:

- 🔐 Secure Firebase Authentication
- 🏥 Clinic Listings + Verification Workflow
- 👤 User & Role Management (with Admin Controls)
- 📊 Analytics Dashboard API
- ✉️ Audit Logging (coming soon)
- 🧪 Fully Typed & Validated DTOs with `class-validator`
- 🔁 Soft Delete Support with Mongoose
- 📦 Swagger API Docs + Versioning

---

## ⚙️ Tech Stack

- **Framework**: [NestJS 11](https://docs.nestjs.com/)
- **Database**: MongoDB + Mongoose 8
- **Authentication**: Firebase Admin SDK
- **API Docs**: Swagger + Header-based versioning
- **Utilities**: `mongoose-delete`, `@faker-js/faker`, `class-validator`,
  `Passport`, `multer`

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone git@github.com:Alabs02/meditravel-engine.git
cd meditravel-engine
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Setup `.env`

Copy `.env.example` to `.env` and fill in Firebase + MongoDB credentials.

```bash
cp .env.example .env
```

Ensure you set:

```
MONGO_URI=your_connection_string
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
PORT=4200
```

### 4. Start the app

```bash
pnpm dev
```

This runs both NestJS server and public asset injector in parallel.

---

## 📦 Running in Production

```bash
pnpm build
pnpm start:prod
```

---

## 🔐 Seeding Initial Data

Seed system roles:

```bash
pnpm tsx src/seed/role.seed.ts
```

Seed super admin:

```bash
pnpm tsx src/seed/super-admin.seed.ts
```

Seed demo clinics:

```bash
pnpm tsx src/seed/clinic.seed.ts
```

---

## 🧪 Swagger Docs

Docs available at:

```
http://127.0.0.1:4200/api-docs
```

Use:

- Header: `X-API-Version: 1`
- Auth: Bearer token from Firebase login

---

## 🧠 Developer Notes

- Role-based access is enforced using a custom `@Roles()` decorator +
  `RolesGuard`
- All endpoints return a **standardized response format** using
  `@shared/response/response.service.ts`
- Clinic slugs are auto-generated and enforced to be unique
- DTOs are lean and well-validated
- Firebase UID is the single source of truth for user identity

---

## 📁 Notable Scripts

```bash
pnpm dev        # Start dev server with auto-inject
pnpm lint       # Lint codebase
pnpm test       # Run tests
pnpm build      # Build for prod
```

---

## 👨‍💻 Author

**Usman Alabura**  
`usmanunfolds@alabura.com`  
https://alabura.com

---

## 🛡 License

Unlicensed – Proprietary. Intended for MediTravel internal use.
