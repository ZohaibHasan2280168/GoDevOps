# GoDevOps: Comprehensive Testing & Verification Cheatsheet 🚀

This document contains all operational, diagnostic, and demonstration commands used across the GoDevOps platform. Keep this file handy for day-to-day operations, interviews, and live demos.

---

## 📑 Table of Contents
1. [Kubernetes Cluster & Workload Inspection](#1-kubernetes-cluster--workload-inspection)
2. [ArgoCD Health & GitOps Status Commands](#2-argocd-health--gitops-status-commands)
3. [API Smoke Testing & Authentication (cURL)](#3-api-smoke-testing--authentication-curl)
4. [GitOps Live Demos (Scaling & Self-Healing)](#4-gitops-live-demos-scaling--self-healing)
5. [Docker Compose & Local Smoke Tests](#5-docker-compose--local-smoke-tests)
6. [CI Testing & Code Quality (Jest & SonarCloud)](#6-ci-testing--code-quality-jest--sonarcloud)
7. [Disaster Recovery & Clean Restart](#7-disaster-recovery--clean-restart)

---

## 1. Kubernetes Cluster & Workload Inspection

### Check All Resources in `godevops` Namespace:
```bash
kubectl get all -n godevops
```

### Check Pod Status & Node Placement:
```bash
kubectl get pods -n godevops -o wide
```

### Check Services & Port Mappings:
```bash
kubectl get svc -n godevops
```

### Check Persistent Volumes & Storage Claims:
```bash
kubectl get pvc,pv -n godevops
```

### Stream Live Logs from Pods:
```bash
# Backend REST API logs (last 30 lines + streaming)
kubectl logs -l app=backend -n godevops -f --tail=30

# Frontend Nginx logs
kubectl logs -l app=frontend -n godevops -f --tail=30

# MongoDB Database logs
kubectl logs -l app=mongodb -n godevops -f --tail=30
```

### Restart a Specific Workload (Rolling Restart):
```bash
# Restart Backend deployment
kubectl rollout restart deployment backend -n godevops

# Restart Frontend deployment
kubectl rollout restart deployment frontend -n godevops
```

---

## 2. ArgoCD Health & GitOps Status Commands

### Check Overall Application Sync & Health:
```bash
kubectl get applications -n argocd
```

### Inspect Detailed Health of Every Managed Resource:
```bash
kubectl get application godevops-application -n argocd \
  -o jsonpath='{range .status.resources[*]}{.kind}{"/"}{.name}{" -> Status: "}{.health.status}{" ("}{.health.message}{")\n"}{end}'
```

### Retrieve ArgoCD Admin Initial Password:
```bash
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d; echo
```

### Find ArgoCD Web UI URL / NodePort:
```bash
minikube service argocd-server -n argocd --url
```

---

## 3. API Smoke Testing & Authentication (cURL)

> Note: Replace `192.168.49.2:31886` with your Minikube IP / NodePort if different.

### 1. Test Backend Health Check (200 OK):
```bash
curl -i http://192.168.49.2:31886/api/health
```

### 2. Fetch All Seeded DevOps Rooms:
```bash
curl -s http://192.168.49.2:31886/api/rooms | jq .
```

### 3. Test Student Login (Returns JWT Token):
```bash
curl -s -X POST http://192.168.49.2:31886/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@godevops.com","password":"Password@123"}' | jq .
```

### 4. Test Platform Admin Login:
```bash
curl -s -X POST http://192.168.49.2:31886/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@godevops.com","password":"Admin@DevOps2026!"}' | jq .
```

---

## 4. GitOps Live Demos (Scaling & Self-Healing)

### Demo A: Zero-Downtime Scaling via Git
1. Edit `k8s/frontend.yaml` to change `replicas: 2` to `replicas: 4`.
2. Commit and push:
   ```bash
   git add k8s/frontend.yaml
   git commit -m "feat(k8s): scale frontend replicas to 4 via GitOps"
   git push origin main
   ```
3. Watch new pods spin up live in Kubernetes:
   ```bash
   kubectl get pods -n godevops -l app=frontend -w
   ```
   *(Or observe the visual tree expand live in ArgoCD UI).*

---

### Demo B: Self-Healing Pod Recovery
Simulate a pod crash or accidental deletion:
```bash
# Delete one frontend pod
kubectl delete pod -l app=frontend -n godevops --field-selector=status.phase=Running | head -n 1

# Check immediate recovery
kubectl get pods -n godevops -l app=frontend
```
*Kubernetes ReplicaSet recreates the missing pod in under 2 seconds!*

---

### Demo C: Anti-Drift Enforcement (Drift Protection)
Simulate an unauthorized manual change made directly via CLI:
```bash
# Manually downscale deployment to 1 replica
kubectl scale deployment frontend --replicas=1 -n godevops

# Wait 5-10 seconds
sleep 7

# Inspect deployment
kubectl get deployment frontend -n godevops
```
*ArgoCD detects Configuration Drift and automatically reconciles back to 4 replicas defined in Git!*

---

## 5. Docker Compose & Local Smoke Tests

### Start Local Multi-Container Stack:
```bash
docker compose up --build -d
```

### Inspect Container Health & Resource Usage:
```bash
docker compose ps
docker stats --no-stream
```

### Stop Local Multi-Container Stack:
```bash
docker compose down
```

---

## 6. CI Testing & Code Quality (Jest & SonarCloud)

### Run Automated Backend Unit & Integration Tests:
```bash
cd backend
npm test
```

### Run Tests with Code Coverage Report:
```bash
cd backend
npx jest --coverage
```

---

## 7. Disaster Recovery & Clean Restart

### If Minikube Stopped After Reboot:
```bash
# 1. Start Minikube
minikube start --driver=docker

# 2. Load custom images into Minikube cache (if needed)
minikube image load go-devops-backend:latest
minikube image load go-devops-frontend:latest

# 3. Check all pods
kubectl get pods -n godevops
```
