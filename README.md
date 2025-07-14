# Drone Telemetry Monitoring Stack Project Overview

This project delivers a complete CI/CD-enabled observability platform for a Node.js-based drone telemetry system using Docker, GitHub Actions, and popular monitoring and logging tools.

🔐 Security and Configuration
GitHub Secrets are used to store sensitive credentials like Docker Hub username and token, ensuring no secrets are hardcoded.

Private DockerHub image hosting ensures controlled deployment artifacts.

💾 Persistent Data

All key services like MongoDB, Elasticsearch, Prometheus, and Grafana use mounted volumes under /mnt, ensuring data survives container restarts and recreations.

⚙️ CI/CD Automation

Fully automated zero-touch deployment using GitHub Actions:

ci.yaml builds and pushes Docker images on each main branch push.

deploy.yaml runs only on successful CI, deploying the image to a Linux GitHub runner via Docker Compose.

Ensures clean separation of build and deploy phases with dependency checks and rollback-safe deployments.

📊 Observability Stack

Prometheus scrapes metrics from /metrics endpoint exposed by the Node.js app.

Grafana dashboards visualize key metrics via Prometheus data source.

ELK Stack (Elasticsearch, Logstash, Kibana, Filebeat) handles complete structured log aggregation and visualization.


## 📦 Project Structure

```bash
.
├── server.js             # Node.js API
├── Dockerfile
├── docker-compose.yml   # Full observability stack
├── prometheus.yml       # Prometheus scrape config
├── logstash.conf        # Logstash pipeline
├── filebeat.yml         # Filebeat input/output config
└── .github/
    └── workflows/
        ├── ci.yaml      # CI: build/test/push Docker image
        └── deploy.yaml  # CD: deploy using docker-compose

CI/CD Workflow Overview
Trigger: Push to main branch
CI Workflow (ci.yaml)
Runs on GitHub-hosted runner

Runs lint & test

Builds Docker image (tags: latest, YYYY-MM-DD-HH-MM-SS)

Pushes to Docker Hub

CD Workflow (deploy.yaml)
Runs on self-hosted Linux GitHub runner

Pulls latest image

Deploys with docker compose up -d


---
Docker Compose Services

| Service         | Purpose             | Port  |
| --------------- | ------------------- | ----- |
| `api`           | Drone telemetry API | 3000  |
| `mongo`         | MongoDB             | 27017 |
| `prometheus`    | Scrape /metrics     | 9090  |
| `grafana`       | Dashboards          | 3001  |
| `elasticsearch` | Log storage         | 9200  |
| `logstash`      | Parse logs          | 5044  |
| `filebeat`      | Collect logs        | -     |
| `kibana`        | Log dashboard UI    | 5601  |



GitHub Secrets
You must set the following secrets in Settings → Secrets → Actions:

| Secret Name       | Description               |
| ----------------- | ------------------------- |
| `DOCKER_USERNAME` | Your Docker Hub username  |
| `DOCKER_PASSWORD` | Docker Hub password/token |



# Access telemetry API
curl http://localhost:3000/health


Dashboards

Grafana: http://localhost:3001

Kibana: http://localhost:5601

Prometheus: http://localhost:9090


🧩 Key Design Decisions
Used host-mounted volumes to persist container data across restarts.

Configured a Linux server as a self-hosted GitHub Actions runner for controlled deployments.

Configured CD to always pull the latest Docker image from Docker Hub during deployment.

Appended a timestamp tag to each Docker image for easy version traceability.

Implemented multi-stage Docker builds to reduce final image size.

Stored Docker credentials securely using GitHub Secrets, avoiding hardcoding sensitive data.


