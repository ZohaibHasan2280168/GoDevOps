# Project Milestones & DevOps Task Board: GoDevOps

---

## Phase 1: Repository Sanitization & DevOps Pivot [COMPLETED ✅]
- [x] Cloned repository into clean workspace `/home/harry/Devops/Projects/go-devops`.
- [x] Removed old `.git` directory and wiped prior author history and commits.
- [x] Cleaned legacy build artifacts (`frontend/out`) and author personal documentation.
- [x] Created comprehensive DevSecOps root `.gitignore` (ignoring `.env`, secrets, `.tfstate`).
- [x] Installed Node.js 20 LTS via NVM on host machine.
- [x] Spun up isolated MongoDB 7.0 Docker container (`go-devops-mongo`) with persistent volume.
- [x] Configured backend `.env` and frontend `.env` for local communication.
- [x] Fixed double-hashing password bug in `server.js` and User schema.
- [x] Eliminated hardcoded fallback credentials (`|| 'Admin@Secure2026!'`) from codebase.
- [x] **DevOps Pivot**: Authored `backend/scripts/createDevOpsRooms.js` and seeded 5 comprehensive DevOps challenge rooms (Linux, Docker, Kubernetes, CI/CD, Terraform).
- [x] Tested end-to-end authentication: User registration, Student login, and Admin login.
- [x] Created standard enterprise documentation: `architecture.md`, `prd.md`, `rule.md`, `memory.md`, `task.md`.
- [x] Created Git-ignored `LOCAL_ACCESS_GUIDE.md` for local operational reference.

---

## Phase 2: Docker Containerization & Docker Compose [IN PROGRESS 🚀]
- [x] Create `.dockerignore` files for both backend and frontend.
- [x] Create Backend `Dockerfile`:
  - [x] Use minimal `node:20-alpine` base image.
  - [x] Implement non-root execution (`USER node`).
  - [x] Optimize Docker layer caching (`package*.json` copy first).
  - [x] Add container health check (`HEALTHCHECK`).
- [x] Create Frontend `Dockerfile`:
  - [x] Multi-stage build (Stage 1: Node builder, Stage 2: Nginx runtime).
  - [x] Add custom `nginx.conf` for Single Page Application routing (`try_files $uri /index.html`).
  - [x] Configure reverse proxy for `/api/` to eliminate CORS issues.
  - [x] Configure security headers and gzip compression.
- [x] Create `docker-compose.yml`:
  - [x] Define `frontend`, `backend`, and `mongodb` services.
  - [x] Configure isolated bridge network (`godevops-net`).
  - [x] Configure named volume for MongoDB persistence (`godevops-mongo-data`).
  - [x] Add resource memory limits and CPU throttling (`deploy.resources.limits`).
  - [x] Add health checks and dependency conditions (`depends_on: condition: service_healthy`).
- [ ] Test local multi-container stack (`docker compose up --build -d`).

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
