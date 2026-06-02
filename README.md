<div align="center">
  <h1>🏢 Lendsqr Admin Dashboard</h1>
  <p><strong>A production-grade fintech admin dashboard built with React 19, TypeScript, and Vite</strong></p>

  [![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)](https://www.typescriptlang.org)
  [![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite)](https://vitejs.dev)
  [![Tests](https://img.shields.io/badge/Tests-15/15-success)](#-testing)
  [![License](https://img.shields.io/badge/License-MIT-green)](#license)

  [Features](#features) • [Tech Stack](#tech-stack) • [Quick Start](#quick-start) • [Scripts](#scripts) • [Testing](#testing) • [Project Structure](#project-structure)
</div>

---

## Features

- **Authentication** — Login with validation, session management, protected routes
- **User Management** — Paginated table of 500+ users with search, filter, and sort
- **User Profiles** — 6 interactive tabs: General, Documents, Bank, Loans, Savings, System
- **Sidebar Views** — 21 admin panels (Guarantors, Loans, Karma, Reports, Transactions, etc.)
- **Offline-First** — IndexedDB caching for user details when API is unavailable
- **Document Management** — Drag-and-drop upload, approval/rejection workflow
- **Financial Tools** — BVN KYC lookup, loan repayment modal, savings goal planner, compound interest calculator
- **Responsive** — Mobile (375px), Tablet (768px), Desktop (1440px)
- **Mock API** — MSW-powered realistic API with 500 generated users

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 19.2 • TypeScript 5.3 |
| **Build** | Vite 8.0 • SWC |
| **Routing** | React Router 7 |
| **HTTP** | Axios |
| **Storage** | IndexedDB |
| **Styling** | SCSS Modules |
| **Testing** | Vitest • React Testing Library |
| **API Mock** | MSW 2.14 |

---

## Quick Start

```bash
# Clone
git clone https://github.com/Shivakulakarni/lendsqr.git
cd lendsqr

# Install & start
npm install
npm run dev        # → http://localhost:5173

# Build & test
npm run build      # Production build
npm test           # 15 integration tests
```

**Demo credentials:** `admin@lendsqr.com` / `admin123` (any 6+ char password works)

---

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | TypeScript check + production build |
| `npm test` | Run tests (single run) |
| `npm run test:watch` | Watch mode |
| `npm run test:coverage` | Coverage report |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier formatting |

---

## Testing

15 tests covering 3 test suites:

| Suite | Tests | Scope |
|-------|-------|-------|
| `Login.test.tsx` | 3 | Form validation, error states |
| `UsersList.test.tsx` | 4 | Page render, table data, filters, pagination |
| `UserDetails.test.tsx` | 8 | Tabs, document approval, KYC lookup, loan repay, savings, system memo |

```bash
npm test                     # All tests
npm run test:coverage        # With coverage
npm run test:ui              # Vitest UI dashboard
```

---

## Project Structure

```
src/
├── __tests__/          # Vitest integration tests
│   ├── Login.test.tsx
│   ├── UsersList.test.tsx
│   ├── UserDetails.test.tsx
│   └── setup.ts
├── components/         # Reusable UI
│   ├── Navbar.tsx          # Search, notifications, profile
│   ├── Sidebar.tsx         # 21 nav links, org switcher, logout
│   └── SidebarViews.tsx    # View panels for each nav item
├── mocks/              # MSW mock service worker
│   ├── handlers.ts         # API route handlers
│   ├── mockData.ts         # 500 generated users
│   ├── browser.ts          # Browser worker
│   └── server.ts           # Node worker (tests)
├── pages/              # Route pages
│   ├── Login.tsx           # Multi-step auth (login/signup/2FA)
│   ├── Dashboard.tsx       # Welcome + stats + quick nav
│   ├── UsersList.tsx       # User table with filters, pagination
│   └── UserDetails.tsx     # Full user profile with 6 tabs
├── services/           # Business logic
│   ├── api.ts              # Axios client + auth interceptor
│   └── storage.ts          # IndexedDB wrapper
├── styles/             # Global SCSS
│   └── globals.scss        # Design tokens, utilities
├── types/              # TypeScript definitions
│   └── index.ts            # User, Auth, Filter types
├── App.tsx             # Route configuration
└── main.tsx            # Entry point + MSW init
```

---

## Design Tokens

| Token | Value |
|-------|-------|
| Primary | `#39CDCC` |
| Text | `#213F7D` |
| Active | `#39CD62` |
| Inactive | `#545F7D` |
| Pending | `#E9B200` |
| Blacklisted | `#E4033B` |
| Font | Work Sans |

---

## License

MIT
