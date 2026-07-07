# Root Dockerfile (docker-compose style)
FROM python:3.11-slim AS backend

WORKDIR /backend

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --upgrade pip setuptools wheel

# Copy backend requirements and code
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY backend/ .

# Train the model
RUN mkdir -p /backend/data /backend/models /backend/logs
RUN python -m app.train_model

EXPOSE 8000

CMD ["sh", "-c", "cd /backend && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]