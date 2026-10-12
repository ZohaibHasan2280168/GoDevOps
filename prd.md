# Product Requirements Document (PRD): GoDevOps Platform

---

## 1. Product Overview

**GoDevOps** is an enterprise-grade, hands-on **DevOps, Cloud Native & Infrastructure Engineering Learning Platform** designed to train developers, systems engineers, and cloud architects in real-world DevOps practices: Linux administration, containerization, orchestration, automation, and Infrastructure as Code.

The platform combines interactive challenge rooms, real-time command exercises, knowledge quizzes, gamified progression systems, and enterprise security mechanisms (2FA TOTP).

---

## 2. Target Personas

| Persona | Role | Primary Goals & Jobs To Be Done |
| :--- | :--- | :--- |
| **DevOps Apprentice / Student** | End User | Master practical Linux commands, Dockerfile creation, K8s deployments, GitHub Actions pipelines, and Terraform IaC; solve rooms, pass quizzes, earn points, track leaderboard rank. |
| **Platform Administrator** | DevOps Lead | Author and publish new DevOps challenge rooms, manage curricula, inspect enrolled engineers, monitor system metrics. |
| **DevOps / Cloud Architect** | Platform Maintainer | Automate, containerize, orchestrate, and deploy the GoDevOps stack across AWS using Docker, Terraform, GitHub Actions, and Kubernetes. |

---

## 3. Functional Requirements

### 3.1. Authentication & Identity Management
* **JWT-Based Authentication:** Stateless token issuance on user login with 7-day expiration.
* **Two-Factor Authentication (2FA TOTP):** RFC 6238 TOTP standard via Google Authenticator, Microsoft Authenticator, and Authy with QR code scanning.
* **Role-Based Access Control (RBAC):** Strict separation between `user` and `admin` roles across all backend API routes.
* **Password Hashing:** Passwords securely hashed with bcrypt (salt rounds: 12) with zero plaintext exposure.

### 3.2. Hands-on DevOps Challenge Rooms & Labs
* **Curated Learning Tracks:**
  1. **Linux & Bash Essentials:** Directory hierarchy, file permissions, log streaming (`tail`, `grep`, `awk`), defensive scripting.
  2. **Docker Containerization:** Image layering, multi-stage builds, non-root security, volumes, and bridge networks.
  3. **Kubernetes Orchestration:** Control plane vs worker nodes, Pods, Deployments, ClusterIP/NodePort Services, health probes.
  4. **CI/CD Automation:** GitHub Actions workflows, triggers, parallel jobs, dependencies (`needs`), secret injection.
  5. **Infrastructure as Code (IaC):** HashiCorp Terraform HCL, state management, remote backends, state locking.
* **Multi-Format Content:** Each room includes comprehensive architectural breakdowns, command cheatsheets, and real-world scenarios.
* **Interactive Quizzes:** Timed single-choice and multiple-choice questions with pass criteria and detailed explanations.
* **Practical Command Exercises:** Hands-on challenge tasks with instant flag verification and score tracking.

### 3.3. Gamification & Analytics
* **Points System:** Real-time point accumulation for quizzes and room completions.
* **Leaderboard:** Dynamic ranking showing top engineers.
* **Weekly Performance Stats:** Tracks hours spent, rooms completed, and rank progression.

### 3.4. Secure Administration Portal
* **Dedicated Admin Route:** Protected `/secure-admin-portal` requiring admin JWT cookies.
* **Room Management:** CRUD operations for rooms, topics, questions, and answers.
* **User Management:** Inspection of enrolled students, role promotion, and access controls.

---

## 4. Non-Functional Requirements (NFR)

### 4.1. Security & Compliance (Shift-Left DevSecOps)
* **Zero Hardcoded Secrets:** Strict ban on hardcoded passwords, tokens, or fallback credentials in source code.
* **OWASP Top 10 Compliance:** Defense against NoSQL injection, Broken Object-Level Authorization, and Default Credential vulnerabilities.
* **HTTP Hardening:** Helmet security headers, rate limiting (1000 requests per 15 minutes window), and HTTP-only cookies.

### 4.2. Performance & Reliability
* **Fast Page Loads:** Vite-optimized bundle chunks with code splitting.
* **High Availability Database:** Persistent containerized storage with zero data loss on service restarts.
* **Sub-200ms API Latency:** Optimized Mongoose queries with proper indexing on slugs and categories.

---

## 5. DevOps & Infrastructure Requirements

* **Phase 1 (Completed):** Sanitization, double-hashing bug resolution, zero secrets in git, containerized MongoDB 7.0, seeded DevOps curriculum.
* **Phase 2 (Current Focus):** Production Dockerfiles for Backend (Node 20-Alpine, non-root) and Frontend (Multi-stage Nginx), orchestrated via Docker Compose.
* **Phase 3:** Automated CI/CD pipelines with GitHub Actions (Lint, Test, Trivy Container Security Scan, Docker Hub push).
* **Phase 4:** Modular Terraform code managing AWS VPC, Subnets, EKS Cluster, ECR, and IAM roles.
* **Phase 5:** Production Kubernetes manifests and Helm charts for autoscaling, self-healing, and ingress routing.
