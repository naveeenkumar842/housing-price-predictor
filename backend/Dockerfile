# Root Dockerfile (docker-compose style)
FROM python:3.11-slim AS backend

WORKDIR /app

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

# Copy the entire backend folder
COPY backend/ .

# Copy data folder
COPY data/ /app/data/
COPY models/ /app/models/

# Create directories
RUN mkdir -p /app/data /app/models /app/logs

# Debug: List files
RUN ls -la /app/
RUN ls -la /app/data/ || echo "Data directory not found"

# Train the model
RUN python -m app.train_model

EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]