# Aditya Mali Portfolio

## Run locally

Double-click `start.bat`, or run `start.bat` from a terminal in this folder.
The first run creates a Python virtual environment and installs the packages in
`requirements.txt`. Then open http://127.0.0.1:8000 in your browser.

## Project files

- `frontend/index.html` — portfolio frontend
- `frontend/assets/certificates/` — certificate image files
- `frontend/assets/images/` — profile photos
- `backend/main.py` — FastAPI server and JSON API
- `requirements.txt` — Python dependencies

API endpoints:

- `GET /api/health` — server status
- `GET /api/certificates` — certificate details and image URLs
