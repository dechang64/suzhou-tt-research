FROM python:3.12-slim

WORKDIR /app

# Install Node.js for building frontend
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python deps
COPY backend/requirements.txt /app/backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy and build frontend
COPY package.json package-lock.json /app/
RUN npm ci
COPY . /app/
RUN npm run build

# Expose port
EXPOSE 8000

# Start server
CMD ["python3", "-c", "import sys; sys.path.insert(0, '.'); from backend.server import app; import uvicorn; uvicorn.run(app, host='0.0.0.0', port=8000)"]
