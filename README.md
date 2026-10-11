# FoodSafe — Food Adulteration Awareness & Detection System

A full-stack web application designed to empower consumers, students, and health inspectors with food safety awareness, detection tests for common food adulterants, interactive quizzes, and verified commodity safety guidelines.

---

## 🚀 System Architecture

- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS (SPA)
- **Backend**: Python 3.11/3.13 + FastAPI + SQLAlchemy 2.0
- **Database**: PostgreSQL (production) / SQLite (local testing & development)
- **Containerization & Proxy**: Docker Compose & Nginx Reverse Proxy
- **Authentication**: JWT (JSON Web Tokens) with PBKDF2/Bcrypt password hashing & role-based access control (User / Admin)

---

## 🌟 Key Features

1. **Food Commodity Safety Directory**:
   - Detailed inspection tests, symptoms, health hazards, and precautions for dairy, oils, spices, grains, fruits, and beverages.
   - Live search, filtering by category, view counts, and favorites bookmarking.
2. **Interactive Consumer Quiz**:
   - Timed knowledge assessment on detecting food adulteration.
   - Instant scoring, answer explanations, performance analytics, and history tracking.
3. **User Portal**:
   - Authentication (Registration / Login), personalized profile, favorite food items, and quiz achievements.
4. **Admin Dashboard & Analytics**:
   - CRUD management for food items and quiz question banks.
   - Real-time system analytics (most viewed items, quiz pass rates, user registration trends).
5. **Contact & Incident Reporting**:
   - Direct communication channel for reporting suspected adulteration.

---

## 🛠️ Project Structure

```text
FoodSafe/
├── backend/
│   ├── app/
│   │   ├── core/         # Settings, JWT security, auth dependencies
│   │   ├── database/     # SQLAlchemy engine, session factory, auto-seeder
│   │   ├── models/       # Database ORM models (User, Food, Category, Quiz, etc.)
│   │   ├── routers/      # FastAPI API routers
│   │   ├── schemas/      # Pydantic validation schemas
│   │   └── main.py       # FastAPI application entry point & lifespan
│   ├── tests/            # Pytest automated test suite (34 test cases)
│   ├── Dockerfile        # Backend container image
│   └── requirements.txt  # Python backend dependencies
├── src/                  # React + TypeScript frontend codebase
│   ├── components/       # UI components (Layout, Cards, Forms, Modals)
│   ├── context/          # Authentication & Theme state providers
│   ├── pages/            # Page views (Home, Directory, Details, Quiz, Admin)
│   ├── services/         # Axios API client & endpoints
│   └── types/            # TypeScript interfaces
├── public/               # Static assets & SVG icons
├── nginx.conf            # Reverse proxy configuration for Docker
├── docker-compose.yml    # Multi-container orchestration
└── .env.example          # Environment variables template
```

---

## ⚙️ Environment Variables

Create a `.env` file based on `.env.example`:

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `ENVIRONMENT` | `production` or `development` | `production` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql+psycopg://user:pass@host:5432/dbname` |
| `SECRET_KEY` | Secret key for signing JWT tokens | Strong 32+ character random string |
| `CORS_ORIGINS` | Allowed origins (comma-separated or JSON list) | `https://your-frontend.onrender.com` |
| `VITE_API_URL` | Backend API base URL for frontend build | `https://your-backend.onrender.com/api` |

---

## 🧪 Testing

### Backend Unit & Integration Tests (34 Passed)
```bash
cd backend
python -m pytest
```

### Frontend Production Build & TypeScript Verification
```bash
npm run build
```

---

## 🐳 Running Locally with Docker Compose

```bash
docker compose up --build
```
- Frontend & Reverse Proxy: `http://localhost`
- Backend API Docs (Swagger): `http://localhost:8000/docs`
- Health Endpoint: `http://localhost:8000/api/health`

