# Drone Telemetry Monitoring Stack

This project provides a complete DevOps monitoring and telemetry solution for drone data. It includes:

- A Node.js telemetry API server
- MongoDB for storing telemetry
- Prometheus + Grafana for metrics
- Elasticsearch + Logstash + Kibana + Filebeat for log aggregation
- GitHub Actions CI/CD pipelines for automatic image build and deployment

---

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


Local Development:
# Start containers
docker compose up -d

# Access telemetry API
curl http://localhost:3000/health


Dashboards

Grafana: http://localhost:3001

Kibana: http://localhost:5601

Prometheus: http://localhost:9090
