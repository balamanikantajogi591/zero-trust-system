# Setup Python Virtual Environment and Install Dependencies
Write-Host "Setting up Python virtual environment..." -ForegroundColor Cyan

if (-not (Test-Path venv)) {
    python -m venv venv
    Write-Host "Virtual environment created." -ForegroundColor Green
} else {
    Write-Host "Virtual environment already exists." -ForegroundColor Yellow
}

Write-Host "Installing dependencies..." -ForegroundColor Cyan
./venv/Scripts/pip install -r requirements.txt

Write-Host "ML Service environment setup complete!" -ForegroundColor Green
