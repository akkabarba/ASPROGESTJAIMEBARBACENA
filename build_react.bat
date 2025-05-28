@echo off
echo 🛠️ Generando build de React...
cd frontend
call npm install
call npm run build || exit /b
cd ..