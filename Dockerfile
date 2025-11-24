FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_NO_INTERACTION=1 \
    POETRY_VERSION=2.2.1

WORKDIR /app

# Install Poetry to manage dependencies in the container
RUN pip install --no-cache-dir "poetry==${POETRY_VERSION}"

# Copy dependency manifests first for better layer caching
COPY pyproject.toml poetry.lock ./
RUN poetry install --only main --no-root --no-ansi

# Copy application code and static assets
COPY app ./app
COPY static_src ./static_src

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
