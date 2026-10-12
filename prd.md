# Product Requirements Document (PRD): Go-Cyber Platform

---

## 1. Product Overview

**Go-Cyber (CyberVerse)** is a cloud-native, hands-on **Cybersecurity Training & CTF (Capture The Flag) Learning Platform** designed to train developers and security engineers in offensive security, defensive engineering, and DevSecOps best practices.

The platform combines modular challenge rooms, interactive quizzes, gamified progression systems, and enterprise-grade security mechanisms (2FA TOTP).

---

## 2. Target Personas

| Persona | Role | Primary Goals & Jobs To Be Done |
| :--- | :--- | :--- |
| **Cadet / Security Student** | End User | Learn practical cybersecurity concepts, solve rooms, take quizzes, earn points, track weekly rank. |
| **Platform Administrator** | Security Admin | Author rooms, upload exercises, manage users, review submissions, monitor system health. |
| **DevOps / Cloud Engineer** | Infrastructure Operator | Deploy, scale, monitor, and automate the platform on AWS using Docker, Terraform, and Kubernetes. |

---

## 3. Functional Requirements

### 3.1. Authentication & Identity Management
* **JWT-Based Authentication:** Secure, stateless token issuance on user login with 7-day expiration.
* **Two-Factor Authentication (2FA TOTP):** Integration with Google Authenticator, Microsoft Authenticator, and Authy via Speakeasy (RFC 6238 TOTP standard) and QR code generation.
* **Role-Based Access Control (RBAC):** Strict separation between `user` and `admin` roles across all backend API routes.
* **Password Hashing:** Passwords securely hashed with bcrypt (salt rounds: 12) with zero plaintext exposure.

### 3.2. Hands-on Challenge Rooms & Labs
* **Categorized Tracks:** Rooms categorized into `Development`, `Networking`, `Web`, `DevOps`, and `Misc`.
* **Multi-Format Content:** Each room contains markdown lectures, practical tutorials, and prerequisite roadmaps.
* **Interactive Quizzes:** Single-choice and multiple-choice questions with time limits and pass percentage criteria.
* **Practical Exercises:** Hands-on challenge tasks with points rewarded upon completion.

### 3.3. Gamification & Analytics
* **Points System:** Real-time point accumulation for quizzes and room completions.
* **Leaderboard:** Dynamic ranking showing top cybersecurity learners.
* **Weekly Performance Stats:** Tracks hours spent, rooms completed, and rank progression.

### 3.4. Secure Administration Portal
* **Dedicated Admin Route:** Protected `/secure-admin-portal` requiring admin JWT cookies.
* **Room Management:** CRUD operations for rooms, topics, questions, and answers.
* **User Management:** Inspection of enrolled students, role promotion, and access controls.

---

## 4. Non-Functional Requirements (NFR)

### 4.1. Security & Compliance (Shift-Left)
* **Zero Hardcoded Secrets:** Strict ban on hardcoded passwords, tokens, or fallback credentials in source code.
* **OWASP Top 10 Compliance:** Defense against SQL/NoSQL injection, Broken Object-Level Authorization, and Default Credential vulnerabilities.
* **HTTP Hardening:** Helmet security headers, rate limiting (1000 requests per 15 minutes window), and HTTP-only cookies.

### 4.2. Performance & Reliability
* **Fast Page Loads:** Vite-optimized bundle chunks with lazy-loading for heavy routes.
* **High Availability Database:** Persistent containerized storage with zero data loss on service restarts.
* **Sub-200ms API Latency:** Optimized Mongoose queries with proper indexing on slugs and user IDs.

---

## 5. DevOps & Infrastructure Requirements

* **Containerization:** Production Dockerfiles for Backend (Node 20-Alpine, non-root) and Frontend (Multi-stage Nginx).
* **Local Orchestration:** Docker Compose stack for multi-service verification.
* **Continuous Integration / Continuous Deployment:** GitHub Actions pipeline with automated linting, container builds, and security scans (Trivy).
* **Infrastructure as Code (IaC):** Modular Terraform code managing AWS VPC, Subnets, EKS Cluster, ECR, and IAM roles.
* **Container Orchestration:** Kubernetes manifests and Helm charts for autoscaling, self-healing, and ingress routing.
