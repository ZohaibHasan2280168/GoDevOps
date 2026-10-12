# Project Milestones & DevOps Task Board: Go-Cyber

---

## Phase 1: Repository Sanitization & Local Verification [COMPLETED ✅]
- [x] Clone repository into clean workspace `/home/harry/Devops/Projects/go-cyber`.
- [x] Remove old `.git` directory and wipe prior author history and commits.
- [x] Clean legacy build artifacts (`frontend/out`) and author documentation.
- [x] Create comprehensive DevSecOps root `.gitignore` (ignoring `.env`, secrets, `.tfstate`).
- [x] Install Node.js 20 LTS via NVM on host machine.
- [x] Spin up isolated MongoDB 7.0 Docker container (`go-cyber-mongo`) with persistent volume.
- [x] Configure backend `.env` and frontend `.env` for local communication.
- [x] Fix double-hashing password bug in `server.js` and User schema.
- [x] Eliminate hardcoded fallback credentials (`|| 'Admin@Secure2026!'`) from codebase.
- [x] Seed initial CTF challenge rooms and verify MongoDB persistence.
- [x] Test end-to-end authentication: User registration, Student login, and Admin login.
- [x] Make clean baseline Git commit on `main` branch.
- [x] Create project documentation: `architecture.md`, `prd.md`, `rule.md`, `memory.md`, `task.md`.
- [x] Create Git-ignored `LOCAL_ACCESS_GUIDE.md` for local operational reference.

---

## Phase 2: Docker Containerization & Docker Compose [UP NEXT 🚀]
- [ ] Create Backend `Dockerfile`:
  - [ ] Use minimal `node:20-alpine` base image.
  - [ ] Implement non-root execution (`USER node`).
  - [ ] Optimize Docker layer caching (`package*.json` copy first).
  - [ ] Add container health check (`HEALTHCHECK`).
- [ ] Create Frontend `Dockerfile`:
  - [ ] Multi-stage build (Stage 1: Node builder, Stage 2: Nginx runtime).
  - [ ] Add custom `nginx.conf` for Single Page Application routing (`try_files $uri /index.html`).
  - [ ] Configure security headers and gzip compression.
- [ ] Create `docker-compose.yml`:
  - [ ] Define `frontend`, `backend`, and `mongodb` services.
  - [ ] Configure isolated bridge network (`cyber-net`).
  - [ ] Configure named volume for MongoDB persistence.
  - [ ] Add health checks and dependency conditions (`depends_on: condition: service_healthy`).
- [ ] Test local multi-container stack (`docker compose up --build`).

---

## Phase 3: CI/CD Pipeline with GitHub Actions [PLANNED ⏳]
- [ ] Configure GitHub Actions workflow (`.github/workflows/ci.yml`).
- [ ] Add automated linting and code quality checks.
- [ ] Integrate **Gitleaks** secret scanning step.
- [ ] Integrate **Trivy** vulnerability scanner for Docker images.
- [ ] Build and publish Docker images to container registry (AWS ECR / Docker Hub).

---

## Phase 4: Infrastructure as Code with Terraform (AWS) [PLANNED ⏳]
- [ ] Setup Terraform structure (`vpc/`, `eks/`, `security/`, `iam/`).
- [ ] Provision AWS VPC with public and private subnets across multiple AZs.
- [ ] Provision Internet Gateway, NAT Gateway, and Route Tables.
- [ ] Provision Amazon EKS Cluster with managed node groups.
- [ ] Provision AWS ECR repository for container images.
- [ ] Configure S3 backend and DynamoDB table for Terraform state locking.

---

## Phase 5: Kubernetes Manifests & Cluster Deployment [PLANNED ⏳]
- [ ] Author Kubernetes Deployments for Frontend and Backend.
- [ ] Author Kubernetes Services (`ClusterIP` for internal, `LoadBalancer`/Ingress for external).
- [ ] Author ConfigMaps and Secrets for environment injection.
- [ ] Setup Horizontal Pod Autoscaler (HPA) based on CPU/Memory metrics.
- [ ] Setup Ingress Controller (AWS ALB / Nginx Ingress).

---

## Phase 6: Observability, Monitoring & DevSecOps Hardening [PLANNED ⏳]
- [ ] Setup Prometheus for metric scraping.
- [ ] Configure Grafana dashboards for cluster and application monitoring.
- [ ] Audit cluster with kube-bench / CIS Kubernetes benchmarks.
