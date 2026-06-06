FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY j5_claimmd_backend.py .
ENV PORT=8080
EXPOSE 8080
CMD exec uvicorn j5_claimmd_backend:app --host 0.0.0.0 --port ${PORT} --workers 2
