#!/bin/bash
echo "📦 Instalando dependencias..."
pip install -r requirements.txt

echo "⚛️ Compilando frontend..."
cd frontend
npm install
npm run build
cd ..

echo "📁 Recolectando archivos estáticos..."
python manage.py collectstatic --noinput

echo "📂 Aplicando migraciones..."
python manage.py migrate
