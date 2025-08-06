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
- Login con cuenta de Google (OAuth)  

---

## 🚀 Tecnologías  

| Frontend               | Backend              |
|------------------------|----------------------|
| React 19               | Node.js 18           |
| React Router 6         | Express 4            |
| Context API            | JWT Authentication   |
| CSS Modules            | PostgreSQL           |
| Google OAuth           | Bcrypt, dotenv       |

---

## 🏗️ Estructura del Proyecto  
```
compra-venta-app/
├── client/               # Frontend React
│   ├── src/
│   │   ├── components/   # Componentes reutilizables
│   │   ├── context/      # Gestión de autenticación
│   │   └── ...
├── server/               # Backend Node.js
│   ├── controllers/
│   ├── routes/
│   └── ...
├── nginx/                # Configuración Nginx + certbot
├── docker-compose.yml    # Entorno Docker local
├── docker-compose.prod.yml # Entorno Docker en producción
```

---

## ⚡ Instalación Rápida

### 1. Clonar y configurar:
```bash
git clone https://github.com/tu-usuario/compra-venta-app.git
cd compra-venta-app
cp .env.example .env  # Configurar variables
```

### 2. Iniciar entorno local:
```bash
docker-compose up --build
```

Acceder:

- Frontend: http://localhost:3000  
- Backend: http://localhost:5000  

---

## 🌐 Despliegue en Producción

Este proyecto puede ejecutarse en entorno productivo con:

- 🔒 HTTPS con certificados Let's Encrypt  
- 🌍 Dominio personalizado: `https://ryzenpc.mooo.com`  
- 🐳 Docker (Nginx + Backend + Frontend)  
- 🔁 Nginx como reverse proxy  
- 📁 Volúmenes persistentes para certificados SSL  

Para iniciar producción:  
```bash
docker-compose -f docker-compose.prod.yml up --build
```

---

## 🔐 Endpoints Clave

| Método HTTP | Endpoint               | Descripción                           |
|-------------|------------------------|---------------------------------------|
| `POST`      | `/api/auth/register`   | Registro de nuevos usuarios           |
| `POST`      | `/api/auth/login`      | Autenticación con JWT                 |
| `POST`      | `/api/auth/google`     | Login con cuenta de Google            |
| `GET`       | `/api/auth/verify`     | Validación del token JWT              |

---

## 🌟 Funcionalidades Destacadas

✅ **Sistema de Aprobación**  
- Usuarios nuevos van a `/welcome` hasta ser aprobados  
- Integración con lista de emails permitidos  

✅ **Autenticación con Google OAuth**  
- Inicio de sesión con cuenta de Google  
- Redirección automática y almacenamiento de token  

✅ **Seguridad Mejorada**  
- Tokens JWT con expiración  
- Contraseñas hasheadas con bcrypt  
- Middleware de verificación  
- Protección contra CSRF  

✅ **Experiencia de Usuario**  
- Redirecciones inteligentes  
- Mensajes de error descriptivos  
- Indicadores de carga (loading states)  

---

## 🛠️ Desarrollo Local  

### Frontend:
```bash
cd client
npm install
npm start
```

### Backend:
```bash
cd server
npm install
npm run dev
```

---

## 📝 Próximas Mejoras

- Panel de administración  
- Recuperación de contraseña  
- Tests E2E con Cypress  

---

## 📬 Contribuciones

¡Todas las contribuciones son bienvenidas!  

1. Haz fork del proyecto  
2. Crea una rama:  
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```  
3. Commit de tus cambios:  
   ```bash
   git commit -am 'Add nueva funcionalidad'
   ```  
4. Push a tu rama:  
   ```bash
   git push origin feature/nueva-funcionalidad
   ```  
5. Abre un Pull Request  

---

📌 **Requisitos**  
- Node.js 18+  
- PostgreSQL 12+  

---

🔧 ¿Problemas?  
Revisa los [issues](https://github.com/bbvedf/compra-venta-app/issues) del repositorio.