# VivaVisas

Proyecto Full Stack con **React (Vite)** en el frontend y **Express.js + TypeORM** en el backend conectado a **PostgreSQL (Neon)**.

---

## 📁 Estructura del Proyecto

```text
VivaVisas/
├── backend/                  # API REST con Express.js y TypeORM
│   ├── src/
│   │   ├── entities/         # Esquemas de TypeORM (JavaScript puro)
│   │   │   └── Usuario.js
│   │   ├── data-source.js    # Conexión TypeORM a Neon PostgreSQL
│   │   └── index.js          # Servidor Express y rutas de la API
│   ├── .env.example          # Plantilla de variables de entorno
│   ├── .env                  # Variables locales (con DATABASE_URL de Neon)
│   └── package.json
├── frontend/                 # Aplicación React creada con Vite
│   ├── src/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── .gitignore                # Reglas de git para ignorar node_modules, .env, etc.
├── package.json              # Scripts centralizados en la raíz
└── README.md
```

---

## 🚀 Cómo ejecutar el proyecto

### 1. Iniciar el Backend (Express + TypeORM)
Desde la raíz del proyecto:
```bash
npm run dev:backend
```
El servidor backend se ejecutará en: `http://localhost:4000` *(configurable en `backend/.env`)*.

Rutas de prueba:
- `http://localhost:4000/` -> Mensaje de bienvenida
- `http://localhost:4000/api/health` -> Chequeo de estado del servidor y de la base de datos Neon
- `http://localhost:4000/api/usuarios` -> Listar usuarios (`GET`) o crear usuario (`POST`)

---

### 2. Iniciar el Frontend (React + Vite)
Desde la raíz del proyecto:
```bash
npm run dev:frontend
```
La aplicación React se ejecutará en: `http://localhost:5173`

---

### 3. Instalar dependencias en ambos entornos
```bash
npm run install:all
```
