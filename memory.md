# Project Memory & Architectural State: Go-Cyber

---

## 1. Project Snapshot

* **Project Name:** Go-Cyber
* **Workspace Path:** `/home/harry/Devops/Projects/go-cyber`
* **Current Phase:** Phase 1 (Completed) ➔ Transitioning to Phase 2 (Dockerization)
* **Active Environment:** Hybrid Local Setup (Node 20 LTS on host + MongoDB 7.0 in Docker container)
* **Git Branch:** `main` (Initial clean commit `feat(init)` + Security hardening commit)

---

## 2. Architectural Decision Records (ADRs)

### ADR-001: Project Renaming & Kebab-Case Standard
* **Context:** Original repository was named `CyberVerseWeb` with author history.
* **Decision:** Renamed workspace to `go-cyber`. Adopted strict kebab-case for Docker containers, Kubernetes manifests, and cloud resources.
* **Consequence:** Full privacy from original repository and compliance with RFC 1123 naming rules for Kubernetes and Docker tags.

### ADR-002: Shift-Left Repository Sanitization
* **Context:** Previous `.git` directory contained author personal commit logs, email references, and local Windows filepaths.
* **Decision:** Wiped old `.git` directory completely, deleted stale `frontend/out` build artifacts, and initialized a fresh Git repository.
* **Consequence:** 100% clean, production-ready Git history.

### ADR-003: Hybrid Local Development Strategy
* **Context:** Host OS lacked Node.js and MongoDB.
* **Decision:** Installed Node 20 LTS via NVM on the host for rapid code editing, while spinning up MongoDB 7.0 inside a Docker container with port mapping `-p 27017:27017` and a named persistent volume (`go-cyber-mongo-data`).
* **Consequence:** Host remains clean with zero database bloat; data persists across container restarts; sub-second hot reload enabled.

### ADR-004: Resolution of Double-Hashing Bug
* **Context:** First admin creation in `server.js` was failing authentication with "Invalid credentials".
* **Root Cause:** Developer manually hashed password with `bcrypt.hash()` in `server.js`, and Mongoose's `pre('save')` hook in `User.js` hashed the string a second time.
* **Resolution:** Removed manual hashing in `server.js`, allowing Mongoose `pre('save')` to handle single, proper hashing. Verified successful admin login via API.

### ADR-005: Elimination of Fallback Credential Leaks
* **Context:** Code contained fallback strings (`process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@Secure2026!'`).
* **Decision:** Removed all fallback strings from `server.js`. Required explicit presence of environment variables; otherwise, admin seeding is skipped safely with a warning.
* **Consequence:** Zero hardcoded passwords exist in any Git-tracked source file.

### ADR-006: Local Operational Cheatsheet Git-Exclusion
* **Context:** User requested a guide file with exact URLs, operational commands, and credentials for personal reference.
* **Decision:** Created `LOCAL_ACCESS_GUIDE.md` and added it to `.gitignore`.
* **Consequence:** User has complete operational documentation locally while preventing credential leaks to GitHub.

---

## 3. Resolved Issues & Troubleshooting Log

| Issue | Root Cause | Solution Applied |
| :--- | :--- | :--- |
| `node: command not found` | Host machine did not have Node.js installed | Installed NVM v0.40.1 and Node 20.20.2 LTS with default alias. |
| `User validation failed: email` | In `models/User.js`, regex required standard TLD (`.com`, `.net`) | Changed seed email domain from `.local` to `admin@cyberverse.com`. |
| `Invalid credentials` on admin login | Double-hashing in `server.js` + `User.js` pre-save hook | Removed manual bcrypt call in `server.js`; allowed Mongoose pre-save to hash once. |
| `Port 3001 in use` on Vite start | Hardcoded HMR WebSocket port in `vite.config.js` | Removed hardcoded HMR port 3001, allowing Vite to use standard dynamic WebSocket. |
