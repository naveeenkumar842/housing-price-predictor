FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --upgrade pip setuptools wheel

# Copy backend files
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

# Copy the entire backend
COPY backend/ .

# Create directories
RUN mkdir -p /app/data /app/models /app/logs

# Train the model
RUN python -m app.train_model

EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]