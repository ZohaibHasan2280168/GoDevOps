const mongoose = require('mongoose');
const Room = require('../models/Room');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const devopsRooms = [
  {
    slug: 'linux-bash-essentials',
    title: 'Linux & Bash Essentials for DevOps',
    short_description: 'Master core Linux commands, bash shell scripting, file permissions, and system process inspection.',
    long_description_markdown: `# Linux & Bash Essentials for DevOps

Linux is the foundational operating system of the modern cloud, container runtimes, and distributed infrastructure. As a DevOps engineer, navigating the command line, parsing logs with text processing utilities, configuring permissions, and automating repetitive tasks via Bash scripting are core daily requirements.

### What You'll Learn:
- Navigation, file manipulation, and user/group permission models (\`chmod\`, \`chown\`).
- Stream filtering and search using \`grep\`, \`find\`, \`awk\`, and \`sed\`.
- Process inspection, memory analysis, and systemd service management (\`top\`, \`htop\`, \`systemctl\`).
- Bash scripting structures: variables, conditionals, loops, functions, and exit status codes.`,
    difficulty: 'Beginner',
    category: 'Linux',
    tags: ['Linux', 'Bash', 'CLI', 'Permissions', 'SysAdmin'],
    creator: 'GoDevOps Team',
    estimated_time_minutes: 25,
    prerequisites: ['Basic computer literacy', 'Familiarity with opening a terminal'],
    learning_objectives: [
      'Understand the Linux filesystem hierarchy (FHS)',
      'Manage POSIX file permissions in octal and symbolic modes',
      'Diagnose running processes and inspect system logs',
      'Author resilient Bash scripts with error-handling flags (`set -euo pipefail`)'
    ],
    topics: [
      {
        id: 1,
        title: 'Linux Filesystem & Permissions',
        order: 1,
        estimated_time_minutes: 6,
        content_markdown: `### The Linux Directory Hierarchy & Permissions

Every Linux directory branches from the root (\`/\`). Key directories include:
- \`/etc\`: System configuration files
- \`/var/log\`: Application and service log outputs
- \`/proc\` & \`/sys\`: Virtual filesystems reflecting kernel and process state

#### Permissions (rwx):
Permissions apply to three entities: **User (u)**, **Group (g)**, and **Others (o)**.
- **Read (r)** = 4
- **Write (w)** = 2
- **Execute (x)** = 1

Example: \`chmod 755 script.sh\` grants:
- User: \`4+2+1 = 7\` (Read, Write, Execute)
- Group: \`4+1 = 5\` (Read, Execute)
- Others: \`4+1 = 5\` (Read, Execute)`
      },
      {
        id: 2,
        title: 'Log Parsing & Text Manipulation',
        order: 2,
        estimated_time_minutes: 7,
        content_markdown: `### Parsing Logs & Streams

DevOps engineers frequently diagnose production issues by tailing and filtering logs:

- \`tail -f -n 100 /var/log/syslog\`: Follow live logs with initial 100 lines.
- \`grep -rnI "ERROR" /var/log/app/\`: Recursively find matches with line numbers, ignoring binary files.
- \`awk '{print $1, $7}' access.log\`: Extract specific columns (e.g. client IP and requested URL).
- Piping (\`|\`): Chain standard output into standard input, e.g.:
  \`cat /var/log/nginx/access.log | grep "500" | wc -l\``
      },
      {
        id: 3,
        title: 'Process Management & System Services',
        order: 3,
        estimated_time_minutes: 6,
        content_markdown: `### Managing Services with systemd

Most Linux distributions use \`systemd\` as the init system:

- \`systemctl status nginx\`: Check operational health of a service.
- \`systemctl restart docker\`: Restart the container daemon.
- \`journalctl -u nginx -f\`: Stream systemd journal logs specifically for the nginx unit.

#### Signals & Killing Processes:
- \`kill -15 <PID>\` sends **SIGTERM** (graceful termination).
- \`kill -9 <PID>\` sends **SIGKILL** (immediate termination by kernel).`
      },
      {
        id: 4,
        title: 'Bash Automation Best Practices',
        order: 4,
        estimated_time_minutes: 6,
        content_markdown: `### Defensive Bash Scripting

Always begin production automation scripts with strict error flags:

\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail
\`\`\`

- \`-e\`: Exit immediately if any command returns a non-zero exit code.
- \`-u\`: Treat unset variables as errors and exit.
- \`-o pipefail\`: Ensure pipelines fail if any sub-command fails (not just the last one).

Check exit codes using \`$?\` where \`0\` signifies success and non-zero signifies failure.`
      }
    ],
    exercises: [
      {
        id: 1,
        title: 'File Permissions Configuration',
        order: 1,
        type: 'flag-based',
        description_markdown: 'What octal permission number grants the Owner Read/Write/Execute (7), Group Read/Execute (5), and Others No Permissions (0)?',
        hint: 'Sum the values: Owner (4+2+1), Group (4+1), Others (0)',
        points: 40,
        expected_flag: '750'
      },
      {
        id: 2,
        title: 'Live Log Following Command',
        order: 2,
        type: 'flag-based',
        description_markdown: 'Which command and flag streams new lines appended to a file in real-time? (e.g. tail -f)',
        hint: 'Think of the tail command with the follow flag.',
        points: 30,
        expected_flag: 'tail -f'
      }
    ],
    quizzes: [
      {
        id: 1,
        title: 'Linux Fundamentals Knowledge Check',
        pass_percentage: 75,
        time_limit_seconds: 300,
        questions: [
          {
            id: 1,
            type: 'single',
            question_text: 'What exit code indicates that a Linux command completed successfully?',
            options: ['0', '1', '127', '-1'],
            correct_answer: '0',
            points: 10,
            explanation: 'In UNIX-like systems, an exit status code of 0 denotes clean success, whereas any non-zero integer indicates an error.'
          },
          {
            id: 2,
            type: 'single',
            question_text: 'Which signal cannot be caught or ignored and immediately terminates a process?',
            options: ['SIGTERM (15)', 'SIGKILL (9)', 'SIGHUP (1)', 'SIGINT (2)'],
            correct_answer: 'SIGKILL (9)',
            points: 10,
            explanation: 'SIGKILL (signal 9) is handled directly by the kernel and cannot be intercepted, blocked, or ignored by the target process.'
          },
          {
            id: 3,
            type: 'multi',
            question_text: 'Which of the following are defensive bash scripting flags set via set -euo pipefail? (Select all that apply)',
            options: [
              'Exit immediately if a command fails (-e)',
              'Treat unset variables as errors (-u)',
              'Pipeline fails if any intermediate command fails (pipefail)',
              'Run all scripts with root privileges automatically'
            ],
            correct_answer: [
              'Exit immediately if a command fails (-e)',
              'Treat unset variables as errors (-u)',
              'Pipeline fails if any intermediate command fails (pipefail)'
            ],
            points: 15,
            explanation: 'The standard strict prelude set -euo pipefail prevents silent script failures across unexpected variable absences and pipeline errors.'
          }
        ]
      }
    ],
    isActive: true
  },
  {
    slug: 'docker-containers-101',
    title: 'Docker Containerization 101',
    short_description: 'Build, optimize, and run production-grade Docker containers with non-root security and multi-stage builds.',
    long_description_markdown: `# Docker Containerization 101

Containers package application code, system libraries, and runtime dependencies together into an immutable, portable artifact. In this room, you will learn the mechanics of container runtimes, explore Linux namespaces and cgroups, build layered container images, and write secure, production-ready multi-stage Dockerfiles.

### What You'll Learn:
- The distinction between Virtual Machines (Hypervisors) and Containers (Kernel isolation).
- Docker Engine architecture: Daemon, containerd, runc, and CLI.
- Writing production Dockerfiles: Layer caching optimization and multi-stage builds.
- Running containers as non-root users (\`USER node\` / \`USER nonroot\`).
- Managing container volumes, bind mounts, and isolated bridge networks.`,
    difficulty: 'Beginner',
    category: 'Docker',
    tags: ['Docker', 'Containers', 'Dockerfile', 'Images', 'Volumes'],
    creator: 'GoDevOps Team',
    estimated_time_minutes: 30,
    prerequisites: ['Basic Linux terminal familiarity'],
    learning_objectives: [
      'Differentiate between container images and running containers',
      'Construct lean, secure multi-stage Dockerfiles',
      'Optimize build cache hits by ordering Dockerfile instructions correctly',
      'Isolate container communication using custom Docker bridge networks'
    ],
    topics: [
      {
        id: 1,
        title: 'Containers vs Virtual Machines',
        order: 1,
        estimated_time_minutes: 6,
        content_markdown: `### How Containers Work Under the Hood

Unlike Virtual Machines which emulate hardware and run independent guest operating system kernels on top of a hypervisor, **containers share the host operating system kernel**.

Isolation is achieved through two fundamental Linux kernel primitives:
1. **Namespaces**: Provide process isolation (PID, Network, Mount, IPC, UTS, User).
2. **Control Groups (cgroups)**: Enforce resource limits (CPU quotas, memory caps, I/O bandwidth).`
      },
      {
        id: 2,
        title: 'Anatomy of an Optimized Dockerfile',
        order: 2,
        estimated_time_minutes: 8,
        content_markdown: `### Layer Caching & Multi-Stage Builds

Each instruction in a Dockerfile (\`RUN\`, \`COPY\`, \`ADD\`) creates a read-only filesystem layer. Docker caches layers; if a layer's contents have not changed, Docker skips execution.

#### Layer Optimization Rule:
Always copy dependency files (e.g. \`package.json\`) and install dependencies *before* copying the source code:

\`\`\`dockerfile
# 1. Base stage
FROM node:20-alpine AS builder
WORKDIR /app

# Cache dependency layer
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# 2. Production runtime stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
\`\`\`

Multi-stage builds eliminate heavy build tools (compilers, npm cache, source code) from the final deployed image.`
      },
      {
        id: 3,
        title: 'Container Security & Non-Root Execution',
        order: 3,
        estimated_time_minutes: 7,
        content_markdown: `### DevSecOps: Dropping Root Privileges

By default, processes inside a Docker container execute as \`root\` (UID 0). If an application has a vulnerability, an attacker could potentially escape the container and compromise the host node.

**Always switch to an unprivileged user before starting the application:**

\`\`\`dockerfile
USER node
EXPOSE 5000
CMD ["node", "server.js"]
\`\`\``
      },
      {
        id: 4,
        title: 'Volumes and Container Networking',
        order: 4,
        estimated_time_minutes: 7,
        content_markdown: `### Data Persistence & Bridge Networks

- **Ephemeral Storage**: When a container stops and is removed, its writable layer is destroyed.
- **Named Volumes**: Managed by Docker in \`/var/lib/docker/volumes/\`. Ideal for databases (\`docker volume create db_data\`).
- **Bridge Networks**: Provide isolated DNS resolution between containers. Containers connected to the same custom bridge network can resolve each other by container name (e.g., \`backend\` resolves \`mongodb\`).`
      }
    ],
    exercises: [
      {
        id: 1,
        title: 'Default Non-Root Node User',
        order: 1,
        type: 'flag-based',
        description_markdown: 'What is the default unprivileged system user provided in official node:alpine images? (Used with USER directive)',
        hint: 'Four letters, same name as the runtime.',
        points: 40,
        expected_flag: 'node'
      },
      {
        id: 2,
        title: 'Background Detached Flag',
        order: 2,
        type: 'flag-based',
        description_markdown: 'Which docker run command flag runs a container in the background (detached mode)?',
        hint: 'Single letter flag preceded by a hyphen.',
        points: 30,
        expected_flag: '-d'
      }
    ],
    quizzes: [
      {
        id: 1,
        title: 'Docker Mastery Quiz',
        pass_percentage: 75,
        time_limit_seconds: 300,
        questions: [
          {
            id: 1,
            type: 'single',
            question_text: 'Which Dockerfile instruction specifies the executable that should always run when the container starts?',
            options: ['ENTRYPOINT', 'RUN', 'EXPOSE', 'MAINTAINER'],
            correct_answer: 'ENTRYPOINT',
            points: 10,
            explanation: 'ENTRYPOINT sets the default command and executable that cannot easily be overridden, defining the container as a specialized executable.'
          },
          {
            id: 2,
            type: 'single',
            question_text: 'What is the primary benefit of Multi-Stage Docker builds?',
            options: [
              'Creates significantly smaller and more secure production images',
              'Allows running multiple operating systems inside one container',
              'Removes the requirement for Docker daemon',
              'Increases memory allocation of the container'
            ],
            correct_answer: 'Creates significantly smaller and more secure production images',
            points: 15,
            explanation: 'Multi-stage builds allow compiling in an intermediate stage and copying only the final artifacts to a minimal runtime base, stripping build dependencies and attack surface.'
          }
        ]
      }
    ],
    isActive: true
  },
  {
    slug: 'kubernetes-orchestration-basics',
    title: 'Kubernetes Core Architecture & Pods',
    short_description: 'Explore the Kubernetes control plane, worker nodes, Pod lifecycles, Deployments, and Service networking.',
    long_description_markdown: `# Kubernetes Core Architecture & Pods

Kubernetes (K8s) is the industry standard for automating container deployment, scaling, self-healing, and operational management. This room demystifies Kubernetes architecture, explains the relationship between Pods, ReplicaSets, and Deployments, and guides you through cluster networking and configuration injection.

### What You'll Learn:
- Control plane components: kube-apiserver, etcd, kube-scheduler, kube-controller-manager.
- Worker node components: kubelet, kube-proxy, container runtime interface (CRI).
- Deploying workloads declaratively with YAML manifests.
- Exposing applications with ClusterIP, NodePort, and LoadBalancer Services.
- Probes: \`livenessProbe\` and \`readinessProbe\` for automatic self-healing.`,
    difficulty: 'Intermediate',
    category: 'Kubernetes',
    tags: ['Kubernetes', 'K8s', 'Pods', 'Deployments', 'Services'],
    creator: 'GoDevOps Team',
    estimated_time_minutes: 35,
    prerequisites: ['Docker Containerization fundamentals'],
    learning_objectives: [
      'Explain control plane vs worker node responsibilities',
      'Write production Deployment and Service manifests',
      'Configure health checks for automatic container restarts and traffic routing',
      'Use kubectl to inspect pods, stream logs, and debug cluster issues'
    ],
    topics: [
      {
        id: 1,
        title: 'Kubernetes Architecture Demystified',
        order: 1,
        estimated_time_minutes: 8,
        content_markdown: `### Control Plane & Worker Nodes

Kubernetes organizes nodes into a cluster with two key planes:

1. **Control Plane (The Brain)**:
   - **kube-apiserver**: REST API gateway; the only component that communicates with etcd.
   - **etcd**: Consistent, highly-available key-value store holding the complete cluster state.
   - **kube-scheduler**: Watches for unassigned pods and assigns them to suitable worker nodes.
   - **kube-controller-manager**: Reconciles desired state with actual state (e.g. NodeController, ReplicaSetController).

2. **Worker Nodes (The Muscle)**:
   - **kubelet**: Agent running on each node, ensuring pods described in PodSpecs are running.
   - **kube-proxy**: Manages network routing and IP table rules on the host.
   - **Container Runtime**: Software that runs containers (containerd, CRI-O).`
      },
      {
        id: 2,
        title: 'Pods, ReplicaSets & Deployments',
        order: 2,
        estimated_time_minutes: 9,
        content_markdown: `### Declarative Workload Hierarchy

- **Pod**: The smallest deployable unit in Kubernetes. Represents one or more containers sharing network namespace and storage.
- **ReplicaSet**: Guarantees a specified number of identical Pods remain running at all times.
- **Deployment**: High-level controller managing ReplicaSets and enabling declarative rolling updates and zero-downtime rollbacks.

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: godevops-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: godevops-api
  template:
    metadata:
      labels:
        app: godevops-api
    spec:
      containers:
      - name: api
        image: godevops/backend:v1.0.0
        ports:
        - containerPort: 5000
\`\`\``
      },
      {
        id: 3,
        title: 'Services & Ingress Networking',
        order: 3,
        estimated_time_minutes: 9,
        content_markdown: `### Connecting Clients to Dynamic Pods

Because Pods are ephemeral with dynamic IP addresses, **Services** provide stable IP addresses and DNS names:

1. **ClusterIP (Default)**: Exposes the Service on an internal IP accessible only within the cluster.
2. **NodePort**: Exposes the Service on a static high port (30000-32767) on each node's IP.
3. **LoadBalancer**: Provisions an external cloud load balancer (e.g. AWS NLB/ALB) routing to the Service.
4. **Ingress**: Layer 7 reverse proxy routing HTTP/HTTPS traffic to Services based on domain name and URI path.`
      },
      {
        id: 4,
        title: 'Liveness & Readiness Probes',
        order: 4,
        estimated_time_minutes: 7,
        content_markdown: `### Automatic Self-Healing

- **livenessProbe**: Checks if the application is still running. If it fails, kubelet kills and restarts the container.
- **readinessProbe**: Checks if the application is ready to accept incoming user traffic. If it fails, Kubernetes removes the Pod from Service endpoints so no requests hit it.`
      }
    ],
    exercises: [
      {
        id: 1,
        title: 'Default Service Type',
        order: 1,
        type: 'flag-based',
        description_markdown: 'What is the default ServiceType in Kubernetes that provides an internal cluster-only IP address?',
        hint: 'Starts with Cluster...',
        points: 40,
        expected_flag: 'ClusterIP'
      },
      {
        id: 2,
        title: 'State Storage Component',
        order: 2,
        type: 'flag-based',
        description_markdown: 'Which distributed key-value store component holds the entire desired and active state of a Kubernetes cluster?',
        hint: 'Four lowercase letters.',
        points: 30,
        expected_flag: 'etcd'
      }
    ],
    quizzes: [
      {
        id: 1,
        title: 'Kubernetes Architecture Exam',
        pass_percentage: 75,
        time_limit_seconds: 300,
        questions: [
          {
            id: 1,
            type: 'single',
            question_text: 'What happens when a container fails its readinessProbe in Kubernetes?',
            options: [
              'The Pod is temporarily removed from Service load balancing endpoints',
              'The container is immediately killed and restarted',
              'The entire worker node is cordoned and drained',
              'The deployment is automatically rolled back'
            ],
            correct_answer: 'The Pod is temporarily removed from Service load balancing endpoints',
            points: 15,
            explanation: 'When readinessProbe fails, the pod is not terminated; instead, traffic is routed away from it until it reports healthy again.'
          },
          {
            id: 2,
            type: 'single',
            question_text: 'Which node agent communicates with the kube-apiserver and ensures Pod containers are running?',
            options: ['kubelet', 'kube-proxy', 'containerd', 'etcd'],
            correct_answer: 'kubelet',
            points: 10,
            explanation: 'kubelet is the primary node agent that registers the node, monitors PodSpecs from the API server, and instructs the CRI to start or stop containers.'
          }
        ]
      }
    ],
    isActive: true
  },
  {
    slug: 'cicd-github-actions',
    title: 'CI/CD Automation with GitHub Actions',
    short_description: 'Construct automated continuous integration and delivery pipelines with GitHub Actions workflows.',
    long_description_markdown: `# CI/CD Automation with GitHub Actions

Continuous Integration (CI) and Continuous Delivery (CD) allow engineering teams to ship code safely, frequently, and with confidence. In this room, you will learn the mechanics of GitOps and pipeline automation using GitHub Actions: triggers, jobs, runners, caching, matrix strategies, and automated container registry publishing.

### What You'll Learn:
- Core CI/CD definitions: Automated testing, linting, packaging, and deployment.
- GitHub Actions workflow syntax (\`.github/workflows/*.yml\`).
- Trigger conditions: \`push\`, \`pull_request\`, \`workflow_dispatch\`, and cron schedules.
- Secrets management and environment protection rules.
- Building, scanning with Trivy, and pushing Docker images to registries.`,
    difficulty: 'Beginner',
    category: 'CI/CD',
    tags: ['CI/CD', 'GitHub Actions', 'Pipelines', 'DevOps', 'Automation'],
    creator: 'GoDevOps Team',
    estimated_time_minutes: 30,
    prerequisites: ['Git basics', 'Docker containerization concepts'],
    learning_objectives: [
      'Author automated GitHub Actions YAML workflows',
      'Parallelize and synchronize workflow jobs using `needs`',
      'Inject sensitive tokens and API keys securely using GitHub Secrets',
      'Publish versioned container images automatically to Docker Hub / GHCR'
    ],
    topics: [
      {
        id: 1,
        title: 'CI vs CD Fundamentals',
        order: 1,
        estimated_time_minutes: 6,
        content_markdown: `### The DevOps Pipeline Lifecycle

- **Continuous Integration (CI)**: Automatically build and run unit/integration tests whenever code is pushed. Catches bugs before merging.
- **Continuous Delivery (CD)**: Automatically package and stage releases in a deployable state, requiring manual sign-off for production.
- **Continuous Deployment (CD)**: Automatically deploys passing changes directly to production with zero human intervention.`
      },
      {
        id: 2,
        title: 'GitHub Actions Architecture',
        order: 2,
        estimated_time_minutes: 8,
        content_markdown: `### Workflow Anatomy

GitHub Actions workflows are declared in \`.github/workflows/\`:

- **Workflows**: Configured automated processes (\`main.yml\`).
- **Events**: Activities triggering the workflow (\`on: [push, pull_request]\`).
- **Jobs**: Sets of steps executing on the same runner. Jobs run in **parallel** by default.
- **Runners**: Virtual machines (Ubuntu, Windows, macOS) or self-hosted servers executing jobs.
- **Steps**: Individual tasks running shell commands or pre-built community actions.

\`\`\`yaml
name: CI Pipeline
on:
  push:
    branches: [ main ]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
\`\`\``
      },
      {
        id: 3,
        title: 'Job Dependencies & Secrets Management',
        order: 3,
        estimated_time_minutes: 8,
        content_markdown: `### Orchestrating Jobs & Secrets

#### Sequential Jobs:
Use the \`needs\` keyword to force a job to wait for another job to succeed:

\`\`\`yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps: ...
  test:
    runs-on: ubuntu-latest
    steps: ...
  build-and-push:
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps: ...
\`\`\`

#### Secure Secrets:
Never commit credentials to Git. Store secrets in **Repository Settings > Secrets & Variables** and reference them:
\`\${{ secrets.DOCKERHUB_TOKEN }}\``
      }
    ],
    exercises: [
      {
        id: 1,
        title: 'Job Dependency Keyword',
        order: 1,
        type: 'flag-based',
        description_markdown: 'Which GitHub Actions keyword is used inside a job definition to specify that it depends on another job finishing first?',
        hint: 'Five letters, sounds like requirement.',
        points: 30,
        expected_flag: 'needs'
      },
      {
        id: 2,
        title: 'PR Trigger Event',
        order: 2,
        type: 'flag-based',
        description_markdown: 'What is the exact GitHub Actions event keyword used in the on: block to trigger workflows on pull requests?',
        hint: 'pull_request with an underscore.',
        points: 30,
        expected_flag: 'pull_request'
      }
    ],
    quizzes: [
      {
        id: 1,
        title: 'CI/CD Pipeline Assessment',
        pass_percentage: 75,
        time_limit_seconds: 300,
        questions: [
          {
            id: 1,
            type: 'single',
            question_text: 'How do multiple jobs inside a single GitHub Actions workflow run by default?',
            options: ['In parallel', 'Sequentially in alphabetical order', 'One at a time in order of declaration', 'Only upon manual trigger'],
            correct_answer: 'In parallel',
            points: 10,
            explanation: 'Unless constrained by the "needs" keyword, GitHub Actions executes all jobs concurrently across available runner capacity.'
          }
        ]
      }
    ],
    isActive: true
  },
  {
    slug: 'terraform-iac-fundamentals',
    title: 'Infrastructure as Code (IaC) with Terraform',
    short_description: 'Provision and manage multi-cloud infrastructure deterministically using HashiCorp Terraform and HCL.',
    long_description_markdown: `# Infrastructure as Code (IaC) with Terraform

Infrastructure as Code allows operations teams to define, provision, version, and manage cloud resources using machine-readable configuration files rather than manual console clicking. In this room, you will master HashiCorp Terraform and HashiCorp Configuration Language (HCL).

### What You'll Learn:
- Declarative vs Imperative infrastructure provisioning.
- The Terraform core lifecycle: \`init\`, \`plan\`, \`apply\`, and \`destroy\`.
- State file management (\`terraform.tfstate\`) and distributed locking with S3 and DynamoDB.
- Authoring modular, reusable cloud architectures with variables, locals, and outputs.`,
    difficulty: 'Intermediate',
    category: 'Terraform',
    tags: ['Terraform', 'IaC', 'HCL', 'Cloud', 'AWS'],
    creator: 'GoDevOps Team',
    estimated_time_minutes: 35,
    prerequisites: ['Basic cloud architecture understanding'],
    learning_objectives: [
      'Understand the declarative paradigm of HashiCorp Configuration Language (HCL)',
      'Execute the Terraform CLI lifecycle with safety and verification steps',
      'Configure remote backend state persistence with state locking',
      'Structure clean Terraform projects with modular architecture'
    ],
    topics: [
      {
        id: 1,
        title: 'Declarative Infrastructure with HCL',
        order: 1,
        estimated_time_minutes: 8,
        content_markdown: `### Declarative vs Imperative

- **Imperative (e.g. AWS CLI scripts)**: Tells the system *how* to perform actions step by step.
- **Declarative (e.g. Terraform)**: Tells the system *what* the desired end-state should look like. Terraform calculates the diff and takes the required actions.

\`\`\`hcl
provider "aws" {
  region = "us-east-1"
}

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = {
    Name        = "godevops-vpc"
    Environment = "production"
  }
}
\`\`\``
      },
      {
        id: 2,
        title: 'The Core Terraform Lifecycle',
        order: 2,
        estimated_time_minutes: 8,
        content_markdown: `### The 4-Step Lifecycle

1. \`terraform init\`: Downloads provider plugins (AWS, Azure, GCP) and initializes the backend state storage.
2. \`terraform plan\`: Compares configuration with active state and generates an execution plan showing additions, changes, and destructions.
3. \`terraform apply\`: Executes the proposed changes against the cloud provider API.
4. \`terraform destroy\`: Safely destroys all infrastructure tracked in the state file.`
      },
      {
        id: 3,
        title: 'State File & Distributed Locking',
        order: 3,
        estimated_time_minutes: 8,
        content_markdown: `### Remote State Best Practices

Terraform records mappings between cloud resources and code in \`terraform.tfstate\`.

**Production Rules:**
- Never commit \`*.tfstate\` to Git (it can contain secrets and passwords in plaintext).
- Use a **Remote Backend** such as Amazon S3 with server-side encryption.
- Enable **State Locking** using Amazon DynamoDB to prevent concurrent executions from corrupting the state.`
      }
    ],
    exercises: [
      {
        id: 1,
        title: 'Initialization Command',
        order: 1,
        type: 'flag-based',
        description_markdown: 'What terraform command prepares the workspace by downloading provider plugins and configuring the backend?',
        hint: 'terraform followed by a 4-letter word for initialization.',
        points: 30,
        expected_flag: 'terraform init'
      },
      {
        id: 2,
        title: 'Execution Plan Command',
        order: 2,
        type: 'flag-based',
        description_markdown: 'What terraform command compares desired state with current infrastructure and previews changes without applying them?',
        hint: 'terraform followed by a 4-letter word.',
        points: 30,
        expected_flag: 'terraform plan'
      }
    ],
    quizzes: [
      {
        id: 1,
        title: 'Terraform Professional Quiz',
        pass_percentage: 75,
        time_limit_seconds: 300,
        questions: [
          {
            id: 1,
            type: 'single',
            question_text: 'What mechanism prevents two engineers from running terraform apply simultaneously and corrupting state?',
            options: ['State Locking', 'Git Merge Conflict', 'VPC Peering', 'IAM Role Policy'],
            correct_answer: 'State Locking',
            points: 10,
            explanation: 'State locking (e.g. through DynamoDB or Terraform Cloud) locks the state file during write operations, preventing race conditions.'
          }
        ]
      }
    ],
    isActive: true
  }
];

async function seedDevOpsRooms() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/godevops';
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully.');

    for (const roomData of devopsRooms) {
      console.log(`Upserting room: ${roomData.slug} (${roomData.title})...`);
      await Room.findOneAndUpdate(
        { slug: roomData.slug },
        { $set: roomData },
        { upsert: true, new: true }
      );
    }

    const totalRooms = await Room.countDocuments({ isActive: true });
    console.log(`\n🎉 Successfully seeded DevOps rooms! Total active rooms in database: ${totalRooms}`);
  } catch (error) {
    console.error('❌ Error seeding DevOps rooms:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed.');
  }
}

seedDevOpsRooms();
