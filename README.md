# OmniConnect — Cross-Platform Responsive Web Application

OmniConnect is a production-ready, security-hardened responsive web application accessible from **one single public URL** across **iPhone**, **iPad**, **Android phones/tablets**, and **Desktop** computers.

It dynamically detects the device, operating system, browser engine (Safari, Chrome, etc.), and screen capabilities, adapting its user interface into platform-tailored mobile and desktop experiences without requiring native app downloads or security bypasses.

---

## 1. URL Structure

```text
https://YOUR-DOMAIN.com/            -> Single URL Entry Flow (Auto-Detects iPhone/Android/Desktop)
https://YOUR-DOMAIN.com/login       -> Secure User Authentication (Email/Password & Official OAuth)
https://YOUR-DOMAIN.com/dashboard   -> Protected User Telemetry Dashboard & History
https://YOUR-DOMAIN.com/admin       -> Protected Admin Security & Metrics Dashboard
```

---

## 2. Device Flow & Architecture

```text
                           https://YOUR-DOMAIN.com
                                      |
                           [deviceDetection Utility]
                                      |
        +-----------------------------+-----------------------------+
        |                             |                             |
  iPhone / iPad                    Android                       Desktop
        |                             |                             |
  iOS Responsive               Android Material             Desktop Multi-Pane
    Experience                    Experience                    Experience
  (Safari WebKit)              (Chrome Mobile)              (Workstation Dashboard)
        |                             |                             |
        +-----------------------------+-----------------------------+
                                      |
                                  Submit Payload
                                      |
                         Express REST API + JWT Auth
                                      |
                          Encrypted Database Store
                                      |
                        Admin Dashboard (Role Restricted)
```

---

## 3. Key Features

- **Single URL Architecture**: One web domain serves iOS, Android, and Desktop experiences.
- **Robust Device Detection** (`src/utils/deviceDetection.js`):
  - Detects `isIOS`, `isAndroid`, `isMobile`, `isTablet`, `isDesktop`.
  - Accurately detects iPadOS 13+ identifying as `MacIntel` with multitouch.
  - Detects browser engines: Safari, Chrome, Firefox, Edge, Opera, Samsung Internet.
  - Extracts viewport resolution, device pixel ratio, orientation, and touch points.
- **iOS Safe Area Support**: Full support for Dynamic Island, notch, home indicator, and Safari address bars using `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
- **Security & Privacy First**:
  - Passwords salt-hashed with `bcrypt` (10 rounds).
  - Passwords are **NEVER** stored in plaintext, **NEVER** logged, and **NEVER** sent or displayed in the Admin Dashboard.
  - JWT Tokens with 7-day expiration.
  - Admin routes protected server-side with HTTP 403 Forbidden enforcement.
- **Official Social OAuth 2.0 Integration**:
  - Directs users to official authentication providers (Google, Meta/Instagram).
  - No fake login pages, no password harvesting.
- **Admin Dashboard**:
  - Live Overview Metrics: Total Users, Active Users (30d), Total Submissions, iOS count, Android count, Desktop count.
  - Filterable, searchable, sortable submission table with pagination and CSV export.

---

## 4. Pre-Configured Test Accounts

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Normal User** | `user@example.com` | `Password123!` | Submissions, Personal Dashboard |
| **Admin** | `admin@omniconnect.com` | `AdminPass123!` | Full Admin Dashboard, Metrics, Deletions |

---

## 5. Local Development Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development (Concurrent Frontend + Backend)
```bash
npm run dev
```
- Frontend Vite Dev Server: `http://localhost:5173`
- Backend Express API Server: `http://localhost:5000`

### 3. Run Backend Only
```bash
npm run server
```

### 4. Run Frontend Only
```bash
npm run client
```

---

## 6. Production Build & Execution

### 1. Build Production Frontend Bundle
```bash
npm run build
```

### 2. Launch Production Server
```bash
npm start
```
The Express server serves both the REST API on `/api/*` and the static single-page application from `dist/` on port `5000` (or `process.env.PORT`).

---

## 7. Environment Variables (`.env`)

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=production
JWT_SECRET=your_custom_production_jwt_secret_key_change_me
VITE_API_URL=/api
```

---

## 8. Deployment Instructions

### Deploy to Render / Railway / Heroku
1. Push repository to GitHub.
2. Create a Node.js Web Service.
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Set environment variable `JWT_SECRET`.

### Deploy to Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 5000
ENV PORT=5000
CMD ["node", "server/index.js"]
```

---

## 9. Comprehensive Testing Checklist

- [x] **iPhone Safari**: Open URL, verify `isIOS = true`, check safe-area inset padding, submit telemetry, verify response.
- [x] **Android Chrome**: Open URL, verify `isAndroid = true`, test Material 3 layout, submit telemetry.
- [x] **Desktop Browser**: Open URL, verify `isDesktop = true`, test multi-column layout.
- [x] **Admin Authorization**: Log in as `user@example.com`, attempt `/admin` access -> Confirm **403 Forbidden**.
- [x] **Admin Operations**: Log in as `admin@omniconnect.com`, access `/admin` -> Confirm stats, search, filter, and delete.
- [x] **Security Audit**: Verify passwords are salted/hashed with bcrypt and omitted from all submission payloads and admin tables.
