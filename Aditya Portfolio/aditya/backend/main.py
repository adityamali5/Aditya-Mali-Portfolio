from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles


PROJECT_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = PROJECT_DIR / "frontend"
ASSETS_DIR = FRONTEND_DIR / "assets"

CERTIFICATES = [
    {
        "title": "National Space Day 2026 — Certificate of Contribution",
        "organization": "Indo Science Education Trust",
        "image": "Aditya-Mali_National-Space-Day-2026.jpg",
    },
    {
        "title": "Smart India Hackathon 2026 — Internal Hackathon",
        "organization": "RITP, Pune",
        "image": "Aditya-Mali_SIH-2026-Internal-Hackathon.jpg",
    },
    {
        "title": "Google Cybersecurity Professional Certificate",
        "organization": "Google • Coursera",
        "image": "Aditya-Mali_Google-Cybersecurity.jpg",
    },
    {
        "title": "Google AI Essentials",
        "organization": "Google • Coursera",
        "image": "Aditya-Mali_Google-AI-Essentials.jpg",
    },
    {
        "title": "QuizOff 2026 — India's Biggest AI Quiz",
        "organization": "CampusCrew • Unstop",
        "image": "Aditya-Mali_QuizOff-2026.jpg",
    },
    {
        "title": "Ethical Hacking Fundamentals in 90 Minutes",
        "organization": "WsCube Tech",
        "image": "Aditya-Mali_WsCube-Ethical-Hacking.jpg",
    },
    {
        "title": "Ethical Hacking & Cybersecurity Workshop",
        "organization": "VaultofCodes",
        "image": "Aditya-Mali_VaultofCodes-Workshop.jpg",
    },
    {
        "title": "Speech & Poem Competition — 3rd Place",
        "organization": "RITP Storytelling & Theatrical Club • Guru Purnima",
        "image": "Aditya-Mali_Speech-Poem-3rd-Place.jpg",
    },
]

app = FastAPI(title="Aditya Mali Portfolio")
app.mount("/assets", StaticFiles(directory=ASSETS_DIR), name="assets")


@app.get("/", include_in_schema=False)
def portfolio() -> FileResponse:
    return FileResponse(FRONTEND_DIR / "index.html")


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/certificates")
def certificates() -> list[dict[str, str]]:
    return [
        {**certificate, "url": f"/assets/certificates/{certificate['image']}"}
        for certificate in CERTIFICATES
    ]
