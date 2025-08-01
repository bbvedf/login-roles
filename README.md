# Compra-Venta App

## Descripción

Aplicación web para gestionar usuarios con autenticación (registro, login, logout) y rutas protegidas.  
Construida con React en el frontend y Node.js/Express en el backend (autenticación con JWT).

---

## Tecnologías usadas

- Frontend: React 19, React Router DOM 6  
- Backend: Node.js, Express, JWT  
- Gestión de estado y contexto para autenticación  
- Fetch API para comunicación cliente-servidor

---

## Estructura del proyecto (cliente)

```
src/
├── components/
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── PrivateRoute.jsx
│   └── Register.jsx
├── context/
│   └── AuthContext.jsx
├── App.js
├── index.js
├── App.css
└── index.css
```

---

## Instalación y ejecución

1. Clonar repositorio

```bash
git clone <url-del-repo>
cd compra-venta-app/client
```

2. Instalar dependencias

```bash
npm install
```

3. Ejecutar servidor de desarrollo

```bash
npm start
```

4. Abrir en navegador en `http://localhost:3000`

---

## Funcionalidades

- Registro de usuarios (email, usuario y contraseña)  
- Inicio de sesión con JWT  
- Rutas privadas protegidas (Dashboard)  
- Logout y gestión de token en contexto y localStorage  
- Navegación entre Login y Registro  
- Mensajes de error y confirmación

---

## API Endpoints (backend)

- `POST /api/auth/register` - Registro  
- `POST /api/auth/login` - Login  
- (Asegúrate de tener el backend corriendo en `http://localhost:5000`)

---

## Cómo funciona la autenticación

- Al iniciar sesión, el token JWT se guarda en contexto React y localStorage  
- El contexto proporciona funciones `login`, `logout` y el estado `isLoggedIn`  
- Las rutas privadas usan un componente `PrivateRoute` para proteger contenido  
- Si el usuario no está autenticado, se redirige al login

---

## Próximos pasos

- Añadir autenticación con Google  
- Implementar timeout de sesión en Dashboard  
- Mejorar estilos y UX

---

## Notas

Este proyecto es una base para ampliar funcionalidades y experimentar con autenticación React+Node.  
Para cualquier duda o contribución, abrir issue o PR.
