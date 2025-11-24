from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR / "static_src"

app = FastAPI(title="M_O_Landing", docs_url=None, redoc_url=None)


@app.get("/health", summary="Health check")
def health() -> dict[str, str]:
    return {"status": "ok"}


# Обслуживайте все статические ресурсы (CSS, JS, изображения, дополнительные файлы HTML)
app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")
