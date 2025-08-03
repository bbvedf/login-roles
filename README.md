# 🛒 Compra-Venta App - Sistema de Autenticación
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-16+-339933?logo=node.js)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?logo=json-web-tokens)

## 📌 Descripción
Sistema completo de autenticación con registro, login y rutas protegidas.  
**Características principales**:
- Registro seguro con validación
- Login persistente con JWT
- Dashboard protegido
- Gestión de usuarios aprobados/no aprobados

## 🚀 Tecnologías
| Frontend               | Backend              |
|------------------------|----------------------|
| React 19               | Node.js 18           |
| React Router 6         | Express 4            |
| Context API            | JWT Authentication  |
| CSS Modules           | PostgreSQL           |

## 🏗️ Estructura del Proyecto
```
compra-venta-app/
├── client/ # Frontend React
│ ├── src/
│ │ ├── components/ # Componentes reutilizables
│ │ ├── context/ # Gestión de autenticación
│ │ └── ...
├── server/ # Backend Node.js
│ ├── controllers/
│ ├── routes/
│ └── ...
└── docker-compose.yml # Entorno Docker
```

## ⚡ Instalación Rápida
1. Clonar y configurar:
```bash
git clone https://github.com/tu-usuario/compra-venta-app.git
cd compra-venta-app
cp .env.example .env  # Configurar variables
Iniciar con Docker:

bash
docker-compose up --build
Acceder:

Frontend: http://localhost:3000

Backend: http://localhost:5000

🔐 Endpoints Clave
Método	Endpoint	Descripción
POST	/api/auth/register	Registro de nuevos usuarios
POST	/api/auth/login	Autenticación JWT
GET	/api/auth/verify	Validación de token
🌟 Funcionalidades Destacadas
✅ Sistema de Aprobación:

Usuarios nuevos van a /welcome hasta ser aprobados

Integración con lista de emails permitidos

✅ Seguridad Mejorada:

Tokens JWT con expiración

Contraseñas hasheadas con bcrypt

Protección contra CSRF

✅ Experiencia de Usuario:

Redirecciones inteligentes

Mensajes de error descriptivos

Loading states

🛠️ Desarrollo Local
Frontend:

bash
cd client
npm install
npm start
Backend:

bash
cd server
npm install
npm run dev
📝 Próximas Mejoras
Autenticación con Google OAuth

Panel de administración

Recuperación de contraseña

Tests E2E con Cypress

📬 Contribuciones
¡Todas las contribuciones son bienvenidas! Por favor:

Haz fork del proyecto

Crea una rama (git checkout -b feature/nueva-funcionalidad)

Haz commit de tus cambios (git commit -am 'Add some feature')

Haz push a la rama (git push origin feature/nueva-funcionalidad)

Abre un Pull Request

📌 Nota: Requiere Node.js 18+ y PostgreSQL 12+.
🔧 ¿Problemas? Revisa issues