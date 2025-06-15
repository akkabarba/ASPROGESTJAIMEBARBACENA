# ASPROGEST · Sistema de Gestión de Incidencias

ASPROGEST es una aplicación web desarrollada con **React** (frontend) y **Django + Django REST Framework** (backend), diseñada para facilitar la **gestión de incidencias** en centros educativos o instituciones. Permite a los usuarios registrar incidencias y al personal administrativo gestionarlas de forma estructurada y eficiente.

## 🚀 Características principales

- ✅ Registro de incidencias segmentadas por tipo (tecnología, telefonía, etc.).
- 🧑‍💼 Diferenciación de roles: usuarios estándar y administradores (superadmin).
- 🔐 Autenticación y autorización con **JWT** (access y refresh tokens).
- 📁 API REST robusta para interacción frontend/backend.
- 📊 Panel de administración para gestionar usuarios e incidencias.
- 🎨 Interfaz moderna y responsive con React.
- ☁️ Despliegue en producción usando **Render** y base de datos **PostgreSQL**.

## 🛠️ Tecnologías utilizadas

### Backend (Django)
- Django 4+
- Django REST Framework
- SimpleJWT para autenticación
- PostgreSQL (Render)

### Frontend (React)
- React 18+ con Vite
- React Router DOM
- Context API para gestión del estado global
- Axios para llamadas a la API
- TailwindCSS (u otra librería CSS moderna)

### Infraestructura
- Render.com (servicio cloud)
- Configuración de despliegue mediante `render.yaml`

## 📂 Estructura del repositorio

ASPROGESTJAIMEBARBACENA/
│
├── backend/ # Proyecto Django (API)
│ ├── asprogest/ # App principal
│ └── manage.py
│
├── frontend/ # Proyecto React
│ ├── src/
│ └── vite.config.js
│
├── render.yaml # Configuración de servicios en Render
├── build_backend.sh # Script de build para backend
└── README.md # Este archivo

bash
Copiar
Editar

## 🔧 Instalación y ejecución local

### 1. Clona el repositorio

```bash
git clone https://github.com/akkabarba/ASPROGESTJAIMEBARBACENA.git
cd ASPROGESTJAIMEBARBACENA
2. Backend (Django)
bash
Copiar
Editar
cd backend
python -m venv env
source env/bin/activate   # En Windows: env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
3. Frontend (React)
bash
Copiar
Editar
cd frontend
npm install
npm run dev
🔑 Autenticación
El sistema utiliza JWT con tokens access y refresh.

Los tokens se almacenan en cookies para mayor seguridad.

Las rutas están protegidas dependiendo del rol del usuario.

📦 Despliegue en Render
Configuración definida en render.yaml.

Base de datos PostgreSQL configurada en Render y conectada al backend.

Frontend desplegado como servicio web independiente.

📸 Capturas (opcional)
Puedes incluir aquí imágenes de la app: panel de incidencias, formulario de creación, dashboard de admin, etc.

🤝 Contribución
Este es un proyecto académico en desarrollo, pero se agradecen ideas o mejoras. Puedes abrir issues o enviar pull requests.