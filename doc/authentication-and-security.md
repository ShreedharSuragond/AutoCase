# Authentication & Security Architecture

AutoCase AI employs an enterprise authentication and access control architecture combining **Spring Security 6**, **JJWT**, and **HttpOnly Cookies** with Role-Based Access Control (RBAC).

---

## 1. Authentication Strategy: HttpOnly JWT Cookie

Rather than storing tokens in browser `localStorage` or `sessionStorage` (which are vulnerable to Cross-Site Scripting / XSS attacks), AutoCase AI stores the session token in an `HttpOnly` cookie:

* **Cookie Name**: `autocase_jwt`
* **HttpOnly**: `true` (inaccessible to JavaScript)
* **SameSite**: `Lax` (protects against CSRF during cross-origin navigations)
* **Path**: `/`
* **Lifecycle**: 24 hours (`86400000 ms`)
* **Logout Mechanism**: Server issues a clearing cookie with `Max-Age=0`.

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Browser
    participant Auth as AuthController
    participant Sec as JwtTokenProvider
    participant Filter as JwtCookieAuthenticationFilter
    participant API as Protected APIs (/api/**)

    User->>Auth: POST /api/auth/login (email, password)
    Auth->>Auth: BCrypt verify password
    Auth->>Sec: generateToken(UserPrincipal)
    Sec-->>Auth: JWT signed token string
    Auth-->>User: 200 OK + Set-Cookie: autocase_jwt=...; HttpOnly; SameSite=Lax

    Note over User,API: Subsequent requests automatically include cookie
    User->>API: GET /api/dashboard/stats
    API->>Filter: Intercept request & read autocase_jwt
    Filter->>Sec: Validate signature and expiration
    Filter->>Filter: Set SecurityContextHolder(UserPrincipal)
    Filter->>API: Proceed to controller
    API-->>User: 200 OK with DB data
```

---

## 2. Role-Based Access Control (RBAC) Matrix

AutoCase AI enforces fine-grained permissions stored in the `permissions` table and mapped through `roles`:

| Role | Dashboard | Project Management | Generate Scenarios & Code | Validate & Execute | Review & Approve | Git Delivery | User Management |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **ROLE_SUPER_ADMIN** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **ROLE_ADMIN** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **ROLE_PROJECT_MANAGER** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **ROLE_DEVELOPER_QA** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **ROLE_REVIEWER** | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| **ROLE_VIEWER** | ✅ (Read) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 3. Seeded Demo Accounts (in PostgreSQL)

| Email | Password | Role | Description |
| :--- | :--- | :--- | :--- |
| `automation.user@autocase.ai` | `AutoCase@123` | `ROLE_DEVELOPER_QA` | Core QA automation engineer |
| `admin@autocase.ai` | `Admin@123` | `ROLE_SUPER_ADMIN` | Platform administrator |
