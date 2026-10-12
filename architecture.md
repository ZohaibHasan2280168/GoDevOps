# System Architecture: GoDevOps

---

## 1. High-Level Architecture Overview

GoDevOps implements an enterprise **3-Tier Cloud-Native Architecture** designed for high security, horizontal scalability, and full containerization across local and cloud environments.

```mermaid
flowchart TB
    subgraph Client_Layer ["Client & Ingress Layer"]
        USER["Browser Client / Student / Admin"] -->|HTTP / 5173 (Dev) or 80/443 (Prod)| INGRESS["Nginx Ingress / Reverse Proxy"]
        INGRESS --> FE["Tier 1: Frontend (React 18 + Vite 6 + Tailwind)"]
    end

    subgraph Application_Tier ["Application & Authentication Layer"]
        FE -->|REST API :5000 /api| BE["Tier 2: Backend (Node.js 20 + Express)"]
        BE --> AUTH["Auth Engine (JWT + Bcrypt)"]
        BE --> TOTP["2FA TOTP Engine (Speakeasy + QR)"]
        BE --> CURRICULUM["DevOps Learning Engine (Linux, Docker, K8s, CI/CD, IaC)"]
    end

    subgraph Storage_Tier ["State & Database Layer"]
        BE -->|Mongoose TCP :27017| MONGO[("Tier 3: MongoDB 7.0 (Named Volume)")]
        MONGO --> VOL["Persistent Volume: go-cyber-mongo-data"]
    end

    subgraph DevOps_Lifecycle ["DevOps & Cloud Delivery Pipeline"]
        DEV["Local Dev (Node + Docker)"] -->|Git Push| CI["GitHub Actions (Lint, Test, Trivy Scan)"]
        CI -->|Build & Push| ECR["AWS ECR (Container Registry)"]
        TF["Terraform (IaC)"] -->|Provisions| VPC["AWS VPC (Public/Private Subnets + NAT)"]
        TF -->|Provisions| EKS["AWS EKS (Kubernetes Cluster)"]
        ECR -->|Deploy| PODS["EKS Pods (Frontend + Backend Deployments)"]
    end
```

---

## 2. Component Breakdown

### 2.1. Tier 1: Frontend Presentation Layer
* **Technology:** React 18, Vite 6, Tailwind CSS, Radix UI Primitives, Lucide Icons, Recharts.
* **Responsibilities:**
  * Interactive DevOps Engineer Dashboard.
  * Hands-on Rooms and Challenge Explorer (Linux, Docker, Kubernetes, CI/CD, Terraform).
  * Quiz taking, command validation, progress tracking, and leaderboard visualization.
  * Secure Admin Management Portal (`/secure-admin-portal`).
  * 2FA QR code display and TOTP setup wizard.
* **Development Port:** `5173` (Vite dev server).
* **Production Runtime:** Multi-stage Docker build served via `nginx:alpine` on port `80`/`443`.

### 2.2. Tier 2: Backend API & Logic Layer
* **Technology:** Node.js 20 LTS, Express.js 4.
* **Responsibilities:**
  * REST API routing (`/api/auth`, `/api/admin`, `/api/rooms`, `/api/progress`, `/api/2fa`).
  * JWT Token signing and verification (`JWT_SECRET`).
  * Two-Factor Authentication via Speakeasy (TOTP RFC 6238 standards).
  * Rate limiting, helmet security headers, and cookie parsing.
* **Development Port:** `5000`.
* **Security Hardening:** Runs strictly as non-root user (`USER node` in Docker), zero hardcoded secrets.

### 2.3. Tier 3: Database & Persistence Layer
* **Technology:** MongoDB 7.0 Community Edition.
* **Responsibilities:**
  * User profiles, role-based access control (Admin vs User), and password hashes (bcrypt salt rounds 12).
  * DevOps room definitions, topics, quiz questions, flags, and practical exercises.
  * User progress records and weekly learning stats.
* **Connection String:** `mongodb://localhost:27017/godevops` (Local) / `mongodb://go-devops-mongo:27017/godevops` (Docker Compose).
* **Data Persistence:** Persistent Docker Volume (`go-cyber-mongo-data:/data/db`).

---

## 3. Network Flow & Port Matrix

| Service | Protocol | Dev Port | Docker / Prod Port | Allowed Ingress | Purpose |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Frontend** | HTTP | `5173` | `80` / `3000` | Public / Internet | User Interface |
| **Backend** | HTTP | `5000` | `5000` | Frontend / Reverse Proxy | Core REST API |
| **MongoDB** | TCP Wire | `27017` | `27017` (Internal) | Backend Container Only | Database Storage |

---

## 4. Repository Folder Layout

```text
go-devops/
├── .gitignore                        # Strict DevSecOps exclusion rules
├── architecture.md                   # Full system architecture and component topology
├── prd.md                            # Product Requirements Document
├── rule.md                           # AI engineering and pair-programming rulebook
├── memory.md                         # Project state, decisions, and problem logs
├── task.md                           # Phase-by-phase DevOps milestones & checklists
├── LOCAL_ACCESS_GUIDE.md             # (Git-Ignored) Local access cheat sheet & URLs
│
├── backend/                          # Express.js REST API Tier
│   ├── .env                          # Local secrets (strictly Git-ignored)
│   ├── .env.example                  # Documentation template (no real passwords)
│   ├── middleware/                   # Auth, cookie, and validation middlewares
│   ├── models/                       # Mongoose Schemas (User, Room, Lab, WeeklyStats)
│   ├── routes/                       # REST routes (auth, rooms, admin, 2fa, etc.)
│   ├── scripts/                      # Seed scripts (createDevOpsRooms.js)
│   ├── services/                     # 2FA and email services
│   └── server.js                     # Express bootstrap & MongoDB connection
│
└── frontend/                         # React 18 + Vite Frontend Tier
    ├── src/
    │   ├── api/                      # Axios HTTP client instance
    │   ├── components/               # Navbar, Footer, ProtectedRoute, UI primitives
    │   ├── contexts/                 # React Context (Auth & App state)
    │   ├── pages/                    # Home, Rooms, RoomDetail, Dashboard, AdminPortal
    │   └── services/                 # Frontend API integration services
    ├── index.html                    # Single-Page Application entrypoint
    ├── vite.config.js                # Vite build and proxy configuration
    └── package.json                  # Frontend dependencies
```
