#!/bin/bash

echo ""
echo "============================================"
echo " EloGestao SaaS - Iniciando ambiente local"
echo "============================================"
echo ""

# Verifica dependencias
if ! command -v node &> /dev/null; then
    echo "[ERRO] Node.js nao encontrado. Instale em: https://nodejs.org"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo "[ERRO] Python 3 nao encontrado. Instale em: https://python.org"
    exit 1
fi

echo "[1/3] Iniciando o backend Python (FastAPI)..."
cd backend
pip3 install -r requirements.txt -q
python3 -m uvicorn main:app --reload --port 5050 &
BACKEND_PID=$!
cd ..

echo "[2/3] Aguardando backend iniciar..."
sleep 4

echo "[3/3] Iniciando o frontend Next.js..."
cd frontend
npm install --silent
npm run dev &
FRONTEND_PID=$!
cd ..

echo "Aguardando o sistema iniciar..."
sleep 12

echo "Abrindo o navegador..."
if command -v xdg-open &> /dev/null; then
    xdg-open http://192.168.0.17:3000    # Linux
elif command -v open &> /dev/null; then
    open http://192.168.0.17:3000         # Mac
fi

echo ""
echo " Sistema rodando!"
echo " Frontend: http://192.168.0.17:3000"
echo " Backend API: http://192.168.0.17:5050"
echo " Docs da API: http://192.168.0.17:5050/docs"
echo ""
echo " Pressione Ctrl+C para encerrar tudo."
echo ""

# Mantem o script rodando; Ctrl+C encerra os dois processos
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait