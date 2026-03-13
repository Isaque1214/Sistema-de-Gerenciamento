@echo off
title EloGestao - Iniciando...

echo.
echo  ============================================
echo   EloGestao SaaS - Iniciando ambiente local
echo  ============================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado. Instale em: https://nodejs.org
    pause & exit /b 1
)

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Python nao encontrado. Instale em: https://python.org
    pause & exit /b 1
)

echo [1/3] Iniciando o backend Python (FastAPI na porta 5050)...
start "EloGestao Backend" cmd /k "cd backend && pip install -r requirements.txt -q && python -m uvicorn main:app --reload --port 5050"

echo [2/3] Aguardando backend iniciar...
timeout /t 5 /nobreak >nul

echo [3/3] Iniciando o frontend Next.js...
start "EloGestao Frontend" cmd /k "cd frontend && npm install --silent && npm run dev"

echo.
echo Aguardando o sistema iniciar (15 segundos)...
timeout /t 15 /nobreak >nul

echo Abrindo o navegador...
start http://192.168.0.17:3000

echo.
echo  Sistema rodando!
echo  Frontend:  http://192.168.0.17:3000
echo  Backend:   http://192.168.0.17:5050
echo  Docs API:  http://192.168.0.17:5050/docs
echo.
pause