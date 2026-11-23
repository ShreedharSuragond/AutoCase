# REST API Reference

All protected endpoints require an active `autocase_jwt` cookie issued upon successful login or registration. Unauthenticated requests receive `401 Unauthorized`.

---

## 1. Standard Response Envelope

All API responses follow the consistent `ApiResponse<T>` wrapper:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2026-11-23T18:30:00"
}
```

---

## 2. Authentication Endpoints

### 2.1 Register New Account
* **Endpoint**: `POST /api/auth/register`
* **Access**: Public
* **Request Body**:
  ```json
  {
    "fullName": "Sarah Connor",
    "email": "sarah.connor@healthtech.com",
    "password": "SecurePassword@123",
    "team": "Core Healthcare QA",
    "role": "ROLE_DEVELOPER_QA"
  }
  ```
* **Response Headers**: `Set-Cookie: autocase_jwt=...; HttpOnly; SameSite=Lax; Path=/; Max-Age=86400`
* **Response Body** (`201 Created`):
  ```json
  {
    "success": true,
    "message": "Account successfully registered",
    "data": {
      "id": "c1f7a0b2-...",
      "email": "sarah.connor@healthtech.com",
      "fullName": "Sarah Connor",
      "team": "Core Healthcare QA",
      "status": "ACTIVE",
      "roles": ["ROLE_DEVELOPER_QA"],
      "permissions": ["DASHBOARD_VIEW", "SCENARIO_GENERATE", "CODE_GENERATE", "GIT_DELIVER"]
    }
  }
  ```

### 2.2 Sign In (Login)
* **Endpoint**: `POST /api/auth/login`
* **Access**: Public
* **Request Body**:
  ```json
  {
    "email": "automation.user@autocase.ai",
    "password": "AutoCase@123"
  }
  ```
* **Response**: `200 OK` + `Set-Cookie: autocase_jwt=...`

### 2.3 Sign Out (Logout)
* **Endpoint**: `POST /api/auth/logout`
* **Access**: Authenticated
* **Response**: `200 OK` + `Set-Cookie: autocase_jwt=; Max-Age=0`

### 2.4 Get Current User Profile
* **Endpoint**: `GET /api/me`
* **Access**: Authenticated
* **Response Body**:
  ```json
  {
    "success": true,
    "data": {
      "id": "f8a1...",
      "email": "automation.user@autocase.ai",
      "fullName": "Automation User",
      "team": "QA Automation Core",
      "status": "ACTIVE",
      "roles": ["ROLE_DEVELOPER_QA"],
      "permissions": ["DASHBOARD_VIEW", "SCENARIO_GENERATE", "CODE_GENERATE", "VALIDATE_EXECUTE", "GIT_DELIVER"]
    }
  }
  ```

---

## 3. Dashboard Analytics Endpoints

### 3.1 Get Workspace Statistics
* **Endpoint**: `GET /api/dashboard/stats`
* **Access**: Authenticated
* **Response Body** (Aggregated live from PostgreSQL):
  ```json
  {
    "success": true,
    "data": {
      "totalProjects": 3,
      "testsGenerated": 3,
      "successfulRuns": 1,
      "pendingReviews": 0,
      "recentProjects": [
        {
          "name": "Provider Search Automation",
          "ticketKey": "JIRA-1234",
          "timeAgo": "10 min ago",
          "status": "Completed",
          "framework": "Java + Selenium + Cucumber + POM"
        }
      ],
      "recentActivities": [
        {
          "title": "Automation pushed to GitLab JIRA-1234",
          "ticketKey": "JIRA-1234",
          "timeAgo": "10 min ago",
          "iconType": "git",
          "status": "Completed"
        }
      ]
    }
  }
  ```

---

## 4. Automation Workflow Endpoints

### 4.1 Seed / Trigger Provider Search Demo
* **Endpoint**: `POST /api/generations/demo-seed`
* **Access**: Authenticated
* **Response Body**: Returns the newly saved `GenerationRequest` record complete with linked test scenarios, generated artifacts, validation run, and GitLab delivery records.

### 4.2 Get In-App Notifications
* **Endpoint**: `GET /api/notifications`
* **Access**: Authenticated

### 4.3 Mark Notification as Read
* **Endpoint**: `PATCH /api/notifications/{id}/read`
* **Access**: Authenticated

### 4.4 Get Audit Logs
* **Endpoint**: `GET /api/admin/audit-logs`
* **Access**: Authenticated (`AUDIT_VIEW` permission)
