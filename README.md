# VivaVisas

Sistema de Gestión de Citas y Asesorías Migratorias desarrollado con **React (Vite)** en el frontend y **Express.js + TypeORM** en el backend bajo **Arquitectura Hexagonal (Puertos y Adaptadores)** conectado a **PostgreSQL (Neon)**.

---

## 📁 Estructura del Proyecto (Arquitectura Hexagonal)

```text
VivaVisas/
├── backend/                              # Backend monolítico modular
│   ├── src/
│   │   ├── core/                         # Núcleo de la aplicación
│   │   │   ├── domain/                   # Entidades puras y reglas de negocio
│   │   │   ├── ports/                    # Interfaces y contratos de repositorios
│   │   │   └── useCases/                 # Casos de uso desacoplados (auth, clientes, etc.)
│   │   ├── infrastructure/               # Adaptadores
│   │   │   ├── database/                 # Persistencia (TypeORM, Neon, Repositorios)
│   │   │   ├── http/                     # Adaptador web (Express, Rutas, Controladores, Zod)
│   │   │   └── external/                 # Servicios externos (Correo, Disponibilidad)
│   │   └── index.js                      # Bootstrap del servidor (37 líneas)
│   ├── .env.example                      # Plantilla de variables de entorno genérica
│   └── package.json
├── frontend/                             # Aplicación React creada con Vite
│   ├── src/
│   └── package.json
├── package.json                          # Scripts centralizados en la raíz
└── README.md
```

---

## 🚀 Cómo ejecutar el proyecto

### 1. Instalar dependencias en ambos entornos
Desde la raíz del proyecto:
```bash
npm run install:all
```

### 2. Iniciar el Backend (Express + TypeORM)
Desde la raíz del proyecto:
```bash
npm run dev:backend
```
* Servidor backend: `http://localhost:4000` *(puerto estandarizado en `backend/.env`)*.

Rutas principales de verificación:
* `http://localhost:4000/` -> Mensaje de confirmación de arquitectura hexagonal.
* `http://localhost:4000/api/health` -> Chequeo de estado del servidor y base de datos.
* `http://localhost:4000/api/auth/login` -> Inicio de sesión protegido con rate limiting y Zod.
* `http://localhost:4000/api/clientes` -> Gestión de cartera de clientes (protegido por JWT).
* `http://localhost:4000/api/citas/disponibilidad` -> Cálculo dinámico de slots horarios.

### 3. Iniciar el Frontend (React + Vite)
Desde la raíz del proyecto:
```bash
npm run dev:frontend
```
* Aplicación web: `http://localhost:5173`
