# M_O_Landing

FastAPI application that serves the static landing pages located in `static_src` and exposes a simple health endpoint for monitoring.

## Требования
- Python 3.11+
- Poetry (для управления зависимостями)
- Docker и Docker Compose (для контейнеризации)

## Локальный запуск с Poetry
1. Установите Poetry (например, `pip install --user "poetry==2.2.1"`).
2. Установите зависимости без создания виртуального окружения (опционально):
   ```bash
   poetry config virtualenvs.create false
   poetry install --only main
   ```
3. Запустите приложение:
   ```bash
   poetry run uvicorn app.main:app --host 0.0.0.0 --port 8001
   ```
4. Откройте `http://localhost:8001` — будет отдан `index.html` из `static_src`. Проверка здоровья доступна по `http://localhost:8001/health`.

## Запуск в Docker
1. Соберите образ (зависимости устанавливаются через Poetry внутри образа):
   ```bash
   docker build -t m_o_landing:latest .
   ```
2. Запустите контейнер:
   ```bash
   docker run --rm -p 8001:8001 m_o_landing:latest
   ```
3. Проверьте приложение по `http://localhost:8001` и `/health`.

## Запуск через Docker Compose
1. Постройте и запустите сервис:
   ```bash
   docker compose up --build
   ```
2. Откройте `http://localhost:8001`.

### Горячая перезагрузка (опционально)
Для локальной разработки раскомментируйте секцию `volumes` и `command` в `docker-compose.yml`, чтобы получать обновления статики и кода без пересборки образа.

## Структура проекта
- `app/main.py` — конфигурация FastAPI и маршруты.
- `static_src/` — статические HTML/CSS/JS/изображения, обслуживаются по корню (`/`).
- `Dockerfile` — сборка образа приложения (устанавливает зависимости через Poetry).
- `docker-compose.yml` — оркестрация сервиса в контейнере.

## Health-check
Запрос `GET /health` возвращает `{ "status": "ok" }`, что можно использовать в балансировщиках и мониторинге.
