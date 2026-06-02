<div align="center">

# 🏦 Lendsqr Admin Dashboard

**A production-grade fintech admin portal built with React · TypeScript · Vite**

[![React](https://img.shields.io/badge/React-19.2.6-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tests](https://img.shields.io/badge/Tests-15%20Passed-00D97E?style=for-the-badge&logo=vitest&logoColor=white)](#-testing)
[![License](https://img.shields.io/badge/License-UNLICENSED-gray?style=for-the-badge)](#)

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Screenshots](#-screenshots) · [Testing](#-testing) · [Architecture](#-architecture)

</div>

---

## 📋 Overview

The **Lendsqr Admin Dashboard** is a comprehensive, production-ready user management system for the Lendsqr fintech platform. Built as a frontend engineering assessment, it demonstrates professional React development with strict TypeScript, offline-first IndexedDB caching, interactive UI widgets, and an extensive automated test suite.

**Key highlights:**
- 🔐 Dual-mode auth — Sign In with 2FA OTP overlay + Create Account with live password strength meter
- 👥 500 mock users — Paginated, searchable, filterable directory with column-level filters
- 🗂️ Rich user profiles — 7 fully interactive detail tabs (Documents, Bank Details, Loans, Savings, App & System)
- 📊 Premium UI — Glassmorphism profile dropdown, notifications centre, searchable docs modal, responsive sidebar
- ⚡ Offline-first — IndexedDB caching for user detail pages
- 🧪 15/15 tests passing — Vitest + React Testing Library + MSW

---

## ✨ Features

### 🔐 Authentication

| Feature | Description |
|---|---|
| Dual-tab form | Sign In / Create Account switcher |
| Email validation | Real-time regex validation |
| Password strength meter | Live Weak → Good → Strong indicator |
| 2FA OTP overlay | Passcode verification step after login |
| reCAPTCHA simulator | Animated verification checkbox on signup |
| Account caching | Newly registered users saved to `localStorage` |
| Demo quick-login cards | One-click Super Admin / Risk Manager credentials |

### 👥 User Management

| Feature | Description |
|---|---|
| User directory | 500 mock users with full pagination |
| Smart search | Name, email, phone number (case-insensitive) |
| Status filter | Active · Inactive · Pending · Blacklisted |
| Column filters | Organisation, date joined, username |
| Per-page selector | 7 / 10 / 20 / 50 / 100 rows |
| Status management | Blacklist / Activate users with real-time state updates |

### 🗂️ User Detail Tabs

| Tab | Interactive Features |
|---|---|
| **General** | Personal info, employment, bank & KYC summary |
| **Documents** | Drag-and-drop upload, progress bar, Approve / Reject actions |
| **Bank Details** | Linked accounts, BVN KYC lookup, reconciliation ledger |
| **Loans** | Outstanding balance counter, repayment modal (updates wallet + ledger) |
| **Savings** | Goal trackers, target builder form, compound interest sliders |
| **App & System** | Security toggles (MFA, webhooks), internal admin memo editor |

### 🧭 Navigation Widgets

- **Glassmorphic profile dropdown** — Dynamic avatar, name & email from session, quick links, click-outside dismissal, sign-out
- **Notifications centre** — Badge counter, mark-as-read, mark-all-read, clear-all with SVG empty state
- **Docs knowledge modal** — Full-screen searchable operational guide with category filtering
- **Collapsible sidebar** — 20+ navigation sections with active-state indicators

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **UI Framework** | React | 19.2.6 |
| **Language** | TypeScript (strict mode) | 6.0 |
| **Build Tool** | Vite | 8.0.14 |
| **Styling** | SCSS + CSS Modules | — |
| **Routing** | React Router | 7.16.0 |
| **HTTP Client** | Axios | 1.16.1 |
| **API Mocking** | Mock Service Worker (MSW) | 2.14.6 |
| **Storage** | IndexedDB (native) | — |
| **Testing** | Vitest + React Testing Library | 4.1.7 |
| **Code Quality** | ESLint + Prettier | Latest |

---

## 📁 Project Structure

```
lendsqr-fe-test/
├── public/
│   ├── favicon.svg
│   ├── login-illustration.png
│   └── mockServiceWorker.js         # MSW service worker
│
├── src/
│   ├── __tests__/                   # Unit & integration tests
│   │   ├── Login.test.tsx
│   │   ├── UsersList.test.tsx
│   │   ├── UserDetails.test.tsx
│   │   └── setup.ts
│   │
│   ├── components/
│   │   ├── Navbar.tsx               # Top nav + notifications + docs modal
│   │   ├── Navbar.module.scss
│   │   ├── Sidebar.tsx              # Collapsible left navigation
│   │   ├── SidebarViews.tsx         # All sidebar feature views
│   │   └── SidebarViews.module.scss
│   │
│   ├── mocks/
│   │   ├── handlers.ts              # MSW route handlers (login, users)
│   │   ├── mockData.ts              # 500-user data generator
│   │   ├── browser.ts               # MSW browser setup
│   │   └── server.ts                # MSW Node setup for tests
│   │
│   ├── pages/
│   │   ├── Login.tsx                # Auth page (sign-in + sign-up + 2FA)
│   │   ├── Dashboard.tsx            # Welcome dashboard
│   │   ├── UsersList.tsx            # Paginated users directory
│   │   └── UserDetails.tsx          # Full user profile (6 interactive tabs)
│   │
│   ├── services/
│   │   ├── api.ts                   # Axios client + auth + user services
│   │   └── storage.ts               # IndexedDB operations
│   │
│   ├── styles/
│   │   └── globals.scss             # Design tokens, resets, utilities
│   │
│   ├── types/
│   │   └── index.ts                 # User, Auth, API TypeScript interfaces
│   │
│   ├── App.tsx                      # Root routing + protected routes
│   └── main.tsx                     # React entry point
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18.16.0
- **npm** ≥ 9

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Shivakulakarni/lendsqr.git
cd lendsqr/lendsqr-fe-test

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Login Credentials

| Role | Email | Password |
|---|---|---|
| **Super Admin** | `admin@lendsqr.com` | `admin123` |
| **Risk Manager** | `risk@lendsqr.com` | `risk123` |
| **Custom** | Any valid email | Any 6+ characters |

> **Tip:** Click the **Quick Access Admin Demo** cards on the login page to auto-fill credentials instantly.

---

## 📸 Screenshots

> Screenshots taken from the live running application at 1440×900.

| Login Page | Users Directory |
|---|---|
| Authentication with 2FA & demo cards | 500 users with search, filter & pagination |

| User Profile | Notifications Centre |
|---|---|
| 6 interactive detail tabs | Real-time alert management |

---

## 📖 Available Scripts

```bash
npm run dev            # Start Vite dev server (HMR enabled)
npm run build          # TypeScript check + production bundle
npm run preview        # Serve the production build locally
npm run test           # Run all tests once
npm run test:watch     # Watch mode (re-runs on file change)
npm run test:ui        # Vitest interactive UI dashboard
npm run test:coverage  # Generate code coverage report
npm run lint           # ESLint check
npm run lint:fix       # ESLint auto-fix
npm run format         # Prettier code formatting
```

---

## 🧪 Testing

The project ships with a Vitest + React Testing Library suite covering auth, directory, and all six profile tabs.

```bash
npm run test
```

**Result:**
```
 RUN  v4.1.7  D:/Lendsqr Assignment/lendsqr-fe-test

 ✓  src/__tests__/Login.test.tsx         (4 tests)   576ms
 ✓  src/__tests__/UsersList.test.tsx     (4 tests)  1263ms
 ✓  src/__tests__/UserDetails.test.tsx   (7 tests)  3156ms

 Test Files  3 passed (3)
      Tests  15 passed (15)
   Duration  9.22s
```

### Coverage

| Test File | What's Tested |
|---|---|
| `Login.test.tsx` | Email validation, error messages, form submission |
| `UsersList.test.tsx` | Table render, column filter popover, profile dropdown |
| `UserDetails.test.tsx` | Tab navigation, Documents approve/reject, BVN KYC, Loans repayment, Savings goal creation |

---

## 🏗 Architecture

### Authentication Flow
```
Login Form → Validation → authService.login()
    → MSW /api/auth/login → JWT token → localStorage
    → Navigate to /users (protected route)
```

### Data Flow
```
UsersList → userService.getUsers(filters)
    → Axios → MSW intercepts → allUsers[500] filter/paginate
    → useState → Table render
```

### Offline Caching
```
UserDetails → userService.getUserById(id)
    → Success: render + storageService.saveUser(user) → IndexedDB
    → Failure: storageService.getUser(id) → cached fallback
```

### Design Tokens

| Token | Value | Usage |
|---|---|---|
| Primary Teal | `#39CDCC` | Brand colour, buttons |
| Brand Navy | `#213F7D` | Text, headers |
| Active green | `#00D97E` | Active status badge |
| Pending orange | `#FFA502` | Pending status badge |
| Blacklisted red | `#FF4757` | Blacklisted status badge |
| Inactive gray | `#9C9C9C` | Inactive status badge |

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
```
Set **Root Directory** → `lendsqr-fe-test` in the Vercel dashboard.

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`

---

## 🐛 Troubleshooting

**MSW not intercepting requests?**
```bash
# Verify the service worker file is in public/
ls public/mockServiceWorker.js
```

**Port conflict?**
```bash
# Vite auto-falls back to 5174, 5175...
# Or manually kill port 5173:
npx kill-port 5173
```

**TypeScript errors?**
```bash
npx tsc --noEmit
```

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide)
- [React Router v7](https://reactrouter.com)
- [Mock Service Worker](https://mswjs.io)
- [Vitest](https://vitest.dev)

---

## 👤 Author

**Shiva Kulakarni**

[![GitHub](https://img.shields.io/badge/GitHub-@Shivakulakarni-181717?style=for-the-badge&logo=github)](https://github.com/Shivakulakarni)

---

<div align="center">

**⭐ If you found this project helpful, please star the repository! ⭐**

*Made with ❤️ by Shiva Kulakarni*

</div>
