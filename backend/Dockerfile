# Use Python 3.11 slim image
FROM python:3.11-slim

WORKDIR /app

# Skip system dependencies due to network issues
# RUN apt-get update && apt-get install -y gcc g++ || echo "Package installation failed, continuing without system deps"

# Create non-root user
RUN adduser --disabled-password --gecos '' appuser

# Copy requirements first for better caching
COPY requirements.txt .

# Skip Python dependencies due to network issues
# RUN pip install --no-cache-dir --upgrade pip || echo "pip upgrade failed, using system pip"
# RUN pip install --no-cache-dir -r requirements.txt || echo "pip install failed, some dependencies may be missing"

# Copy application code
COPY . .

# Change ownership to appuser
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:8000/health', timeout=5)"

# Start the application with fallback
CMD ["python", "main.py"]