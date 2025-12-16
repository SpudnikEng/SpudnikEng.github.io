@echo off
cd /d "%~dp0"
echo Starting server on http://localhost:8080
echo Press Ctrl+C to stop the server
python -m http.server 8080

