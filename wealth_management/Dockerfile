# Dockerfile for FastAPI backend
FROM python:3.12-slim

WORKDIR /app

COPY wealth_management/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY wealth_management /app/wealth_management

EXPOSE 8000

CMD ["uvicorn", "wealth_management.main:app", "--host", "0.0.0.0", "--port", "8000"] 