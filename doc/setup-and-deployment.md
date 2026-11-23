# Setup & Deployment Guide

This guide covers setup prerequisites, container configuration, and running AutoCase AI locally.

---

## 1. Prerequisites

* **Operating System**: Windows 10/11, macOS, or Linux
* **Java SDK**: Java 21 or 25 LTS
* **Node.js**: Node 20+ with npm
* **Docker & Docker Compose**: For containerized PostgreSQL
* **Task**: Task runner ([taskfile.dev](https://taskfile.dev))

---

## 2. Environment Configuration

### Database Settings
Defined in [compose.yaml](file:///C:/Users/shree/Desktop/AutoCase/compose.yaml):
* **Image**: `postgres:18-alpine`
* **Port**: `5433:5432`
* **Database Name**: `autocase`
* **User**: `autocase_app`
* **Password**: `autocase`

### Backend Settings
Defined in [application.properties](file:///C:/Users/shree/Desktop/AutoCase/backend/src/main/resources/application.properties):
```properties
server.port=8080
spring.datasource.url=jdbc:postgresql://localhost:5433/autocase
spring.datasource.username=autocase_app
spring.datasource.password=autocase

autocase.jwt.secret=9a3f2b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2
autocase.jwt.expiration-ms=86400000
autocase.jwt.cookie-name=autocase_jwt
autocase.jwt.cookie-same-site=Lax
```

---

## 3. Running with Taskfile

Use the included [Taskfile.yml](file:///C:/Users/shree/Desktop/AutoCase/Taskfile.yml) for rapid operations:

```powershell
# Start PostgreSQL database container
task db:up

# Start Spring Boot backend (in ./backend)
task backend

# Start React frontend development server (in ./frontend)
task frontend

# Start all three services together
task dev

# Stop PostgreSQL database container
task db:down
```

---

## 4. Manual Execution

### Backend
```powershell
cd backend
.\gradlew bootRun
```
* Backend starts at `http://localhost:8080`

### Frontend
```powershell
cd frontend
npm install
npm run dev
```
* Frontend starts at `http://localhost:5173`
* Proxy configuration in `vite.config.ts` automatically forwards `/api/**` to `http://localhost:8080`.
