# Cloud Development Environment (Sandbox)

This project provides a cloud-native development environment, similar to GitHub Codespaces, allowing users to dynamically spin up containerized development environments (Vite/React apps) in a Kubernetes cluster and access them via preview URLs.

## Architecture

The system consists of several key components:

### 1. Sandbox Server (`/sandbox/server`)
- An Express.js backend responsible for orchestrating the creation of sandbox environments.
- Exposes a `POST /api/sandbox/start` endpoint which generates a unique UUID (Sandbox ID).
- Uses the `@kubernetes/client-node` SDK to dynamically create:
  - A **Kubernetes Pod** (`sandbox-pod-<id>`) running the Vite development template.
  - A **Kubernetes Service** (`sandbox-service-<id>`) to expose the Pod's port `5173`.
- Returns the dynamically generated `previewUrl` to access the environment.

### 2. Router (`/sandbox/router`)
- A dynamic reverse proxy built with Express.js and `http-proxy-middleware`.
- Routes wildcard domain requests (`*.preview.localhost`) to the appropriate sandbox service.
- Extracts the Sandbox ID from the Host header and proxies the HTTP traffic directly to the internal Kubernetes service.
- Supports WebSockets (`ws: true`), ensuring Vite's Hot Module Replacement (HMR) functions correctly inside the sandbox.

### 3. Template (`/sandbox/template`)
- A baseline React + Vite application that serves as the starting point for new sandboxes.
- Configured with **TailwindCSS** for rapid styling.
- Bundled into a Docker image (`template:latest`). The `sync.ps1` script is used to build the image and push it to the local Kubernetes node using containerd (`ctr`).

### 4. Kubernetes Manifests (`/k8s`)
- **Ingress (`ingress.yml`)**: An NGINX Ingress Controller configuration that routes:
  - `/api/sandbox` traffic to the Sandbox Server.
  - `*.preview.localhost` traffic to the Router.
- **Deployments & Services**: Defines the necessary deployments and cluster IP services for the Router and Sandbox Server.
- **RBAC (`rbac.yml`)**: Grants the Sandbox Server the necessary permissions to dynamically spawn and manage pods and services within the namespace.

## Traffic Flow

1. User requests a new environment via `/api/sandbox/start`.
2. The Server provisions a new Pod + Service and returns `http://<id>.preview.localhost`.
3. The user opens the preview URL in their browser.
4. Traffic hits the Kubernetes **Ingress Controller**, which routes the wildcard domain to the **Router**.
5. The **Router** extracts `<id>` from the host, and proxies the traffic directly to the pod's running Vite server.

## Getting Started

### Prerequisites
- Docker
- A local Kubernetes cluster (e.g., Docker Desktop, Minikube, Kind) with an NGINX Ingress Controller installed.

### Setup

1. **Build the Template Image:**
   Navigate to `/sandbox/template` and run the sync script to build the image and load it into your local cluster:
   ```powershell
   cd sandbox/template
   .\sync.ps1
   ```

2. **Deploy the Services:**
   Apply the Kubernetes manifests from the root directory:
   ```shell
   kubectl apply -f k8s
   ```

3. **Create a Sandbox:**
   Send a POST request to `/api/sandbox/start` (via the ingress or port-forwarding the server) to launch your first sandbox.
