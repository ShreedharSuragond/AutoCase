# AutoCase AI — Enterprise Documentation

Welcome to the technical documentation for **AutoCase AI**, an enterprise AI-powered test automation generation and governance platform.

AutoCase AI bridges the gap between software requirements and production-ready automated tests. It ingests requirements from multiple sources (Jira, GitLab, manual specifications, screenshots, recordings, existing test cases, and API specs), analyzes target repository conventions, generates BDD test scenarios for human approval, produces framework-native automation code, validates syntax and locators deterministically, and delivers changes safely via isolated Git branches and Merge Requests.

---

## 📚 Documentation Index

| Document | Description |
| :--- | :--- |
| **[Architecture Guide](architecture.md)** | System overview, Spring Boot modular monolith, and package-by-feature layout |
| **[Authentication & Security](authentication-and-security.md)** | JWT HttpOnly Cookie authentication, session lifecycle, and RBAC matrix |
| **[Database Schema](database-schema.md)** | PostgreSQL relational entity models, table definitions, and relationships |
| **[API Reference](api-reference.md)** | Full REST API catalog, endpoints, schemas, and payload examples |
| **[Frontend Design System](frontend-design.md)** | React 19 + TypeScript UI architecture, component tree, and theme styling |
| **[Automation Pipeline](generation-pipeline.md)** | Requirements intake, AI scenario generator, code generation, and validation |
| **[Demo Walkthrough Guide](demo-guide.md)** | Step-by-step SPARKathon presentation story: Provider Search (`JIRA-1234`) |
| **[Setup & Deployment](setup-and-deployment.md)** | Local development environment, Docker Compose, Taskfile, and build commands |

---

## ⚡ Quick Start

```powershell
# 1. Start the PostgreSQL 18 container
task db:up

# 2. Run the Spring Boot backend (port 8080)
task backend

# 3. Run the React frontend (port 5173)
task frontend

# Or run all services simultaneously:
task dev
```

* **Frontend UI**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [http://localhost:8080](http://localhost:8080)
* **PostgreSQL DB**: `localhost:5433` (`autocase` / `autocase_app`)
