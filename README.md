# VivaVisas

Proyecto Full Stack con **React (Vite)** en el frontend y **Express.js** en el backend.

---

## 📁 Estructura del Proyecto

```text
VivaVisas/
├── backend/            # API REST con Express.js (Node.js)
│   ├── src/
│   │   └── index.js    # Servidor y rutas principales
│   ├── .env.example    # Variables de entorno de ejemplo
│   ├── .env            # Variables de entorno locales
│   └── package.json
├── frontend/           # Aplicación React creada con Vite
│   ├── src/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── .gitignore          # Reglas de git para ignorar node_modules, etc.
├── package.json        # Scripts convenientes en la raíz
└── README.md
```

---

## 🚀 Cómo ejecutar el proyecto

### 1. Iniciar el Backend (Express)
Desde la raíz del proyecto:
```bash
npm run dev:backend
```
O entrando a la carpeta:
```bash
cd backend
npm run dev
```
El servidor backend se ejecutará en: `http://localhost:5000`

Rutas de prueba:
- `http://localhost:5000/` -> Mensaje de bienvenida
- `http://localhost:5000/api/health` -> Chequeo de estado

---

### 2. Iniciar el Frontend (React + Vite)
Desde la raíz del proyecto:
```bash
npm run dev:frontend
```
O entrando a la carpeta:
```bash
cd frontend
npm run dev
```
La aplicación React se ejecutará por defecto en: `http://localhost:5173`

---

### 3. Instalar dependencias si clonas el proyecto nuevamente
```bash
npm run install:all
```
