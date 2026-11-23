# Database Schema & Data Model

AutoCase AI uses **PostgreSQL 18** running in Docker on port `5433`. All entities are managed via **Spring Data JPA / Hibernate** with automatic DDL updates.

---

## 1. Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ USER_ROLES : has
    ROLES ||--o{ USER_ROLES : assigned_to
    ROLES ||--o{ ROLE_PERMISSIONS : contains
    PERMISSIONS ||--o{ ROLE_PERMISSIONS : mapped_to
    USERS ||--o{ PROJECTS : owns
    PROJECTS ||--o{ GENERATION_REQUESTS : contains
    GENERATION_REQUESTS ||--o{ TEST_SCENARIOS : generates
    GENERATION_REQUESTS ||--o{ GENERATED_ARTIFACTS : produces
    GENERATION_REQUESTS ||--o{ VALIDATION_RUNS : verifies
    GENERATION_REQUESTS ||--o{ GIT_DELIVERIES : delivers
    USERS ||--o{ NOTIFICATIONS : receives
    USERS ||--o{ AUDIT_EVENTS : triggers

    USERS {
        uuid id PK
        string email UK
        string password
        string full_name
        string team
        string status
        timestamp last_login_at
        timestamp created_at
        timestamp updated_at
    }

    PROJECTS {
        uuid id PK
        string name
        string project_key UK
        string description
        string default_repo_url
        string default_branch
        string framework
        uuid owner_id FK
        timestamp created_at
    }

    GENERATION_REQUESTS {
        uuid id PK
        uuid project_id FK
        uuid user_id FK
        string jira_ticket_id
        string gitlab_issue_id
        string instruction_type
        string title
        string status
        string target_repo
        string target_branch
        string target_folder
        text requirement_summary
        text observations
        text assumptions
        timestamp created_at
        timestamp updated_at
    }

    TEST_SCENARIOS {
        uuid id PK
        uuid generation_request_id FK
        string title
        string scenario_type
        text description
        text bdd_gherkin
        string status
        integer order_index
    }

    GENERATED_ARTIFACTS {
        uuid id PK
        uuid generation_request_id FK
        string file_path
        string file_type
        text content
        string language
    }

    VALIDATION_RUNS {
        uuid id PK
        uuid generation_request_id FK
        string status
        boolean syntax_passed
        boolean structure_passed
        boolean locator_checks_passed
        boolean step_binding_passed
        text compiler_logs
        bigint execution_time_ms
        timestamp completed_at
    }

    GIT_DELIVERIES {
        uuid id PK
        uuid generation_request_id FK
        string branch_name
        string commit_sha
        string commit_message
        string merge_request_url
        string status
        timestamp delivered_at
    }

    AUDIT_EVENTS {
        uuid id PK
        string actor_email
        string action
        string entity_type
        string entity_id
        text details
        string outcome
        timestamp created_at
    }

    NOTIFICATIONS {
        uuid id PK
        string user_email
        string title
        text message
        string type
        boolean is_read
        string link
        timestamp created_at
    }
```

---

## 2. Table Descriptions

| Table Name | Entity Class | Purpose |
| :--- | :--- | :--- |
| `users` | `User.java` | User accounts, credentials, team affiliation, and account status |
| `roles` | `Role.java` | RBAC roles (`ROLE_ADMIN`, `ROLE_DEVELOPER_QA`, etc.) |
| `permissions` | `Permission.java` | Granular security privileges |
| `projects` | `Project.java` | Target automation repositories and framework configurations |
| `generation_requests` | `GenerationRequest.java` | Automation request lifecycle (Draft &rarr; Scenarios &rarr; Code &rarr; Delivered) |
| `test_scenarios` | `TestScenario.java` | Individual BDD/Gherkin test scenarios with human approval state |
| `generated_artifacts` | `GeneratedArtifact.java` | Feature files, Page Objects, and Step Definition code |
| `validation_runs` | `ValidationRun.java` | Compiler and locator validation outputs and logs |
| `git_deliveries` | `GitDelivery.java` | Git branch, commit SHA, and GitLab Merge Request metadata |
| `audit_events` | `AuditEvent.java` | Append-only governance and compliance audit trail |
| `notifications` | `Notification.java` | In-app user notifications and alerts |
