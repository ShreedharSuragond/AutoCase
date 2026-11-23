# Frontend Architecture & Design System

The frontend is built using **React 19**, **TypeScript**, and **Vite**, styled with modern CSS variables, and uses **Lucide React** for enterprise iconography.

---

## 1. Visual Theme & Color Palette

The interface adheres to an enterprise SaaS design language:

| Design Token | Hex Code | Usage |
| :--- | :--- | :--- |
| `--bg-sidebar` | `#0f172a` | Deep navy sidebar background |
| `--bg-app` | `#f8fafc` | Clean canvas background |
| `--primary` | `#4f46e5` | Primary buttons, active tabs, and badges |
| `--primary-hover` | `#4338ca` | Button hover state |
| `--accent` | `#8b5cf6` | Wizard highlights and AI tags |
| `--success` | `#10b981` | Validation passed, completed status pill |
| `--warning` | `#f59e0b` | Review needed chip |
| `--danger` | `#ef4444` | Validation error, unread badge |

---

## 2. Component Hierarchy

```
App.tsx
├── AuthProvider (AuthContext.tsx)
│   ├── [Unauthenticated State]
│   │   └── AuthPage.tsx (Full screen sign-in & registration)
│   │
│   └── [Authenticated State]
│       ├── Sidebar.tsx (Navy navigation & brand)
│       └── app-main-canvas
│           ├── TopNav.tsx (Global search, notification bell, user avatar menu)
│           └── app-body-container
│               ├── HeroBanner.tsx (AI platform summary banner)
│               ├── InstructionSourceSelector.tsx (7 multi-source intake cards)
│               ├── HowItWorksFlow.tsx (5-stage horizontal pipeline)
│               └── DashboardBottomCards.tsx
│                   ├── Quick Stats (2x2 grid)
│                   ├── Recent Projects (with status pills)
│                   └── Recent Activity (timeline feed)
│
├── AutomationWizardModal.tsx (5-stage interactive automation creator)
└── NotificationDrawer.tsx (Slide-out alerts drawer)
```

---

## 3. Security Boundary & Protected Views

When the application loads:
1. `AuthContext` makes an asynchronous request to `/api/me`.
2. While awaiting response, `auth-loading-screen` is rendered.
3. If `/api/me` returns `401 Unauthorized`, `AuthPage` is displayed. No protected components, dashboard metrics, or sidebar items are mounted.
4. Once authenticated, `ProtectedDashboard` mounts and queries `/api/dashboard/stats`.
