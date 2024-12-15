# **Donde Es** - Plataforma de Eventos Locales

**Descripción**

**Donde Es** es una plataforma web que permite a los usuarios **crear, gestionar y descubrir eventos locales**. Utiliza **geolocalización** para mostrar eventos cercanos y ofrece pensadas funcionalidades para la gestión de usuarios y eventos.

---

## **Tecnologías Utilizadas**

**Frontend:**

- HTML5
- CSS3
- JavaScript Vanilla

**Backend:**

- Node.js
- Express.js

**Base de Datos:**

- PostgreSQL

**APIs:**

- HERE Maps (para geolocalización)

**Autenticación:**

- JWT (JSON Web Tokens)

---

## **Dependencias Principales**

- **bcrypt**: Encriptación de contraseñas
- **express**: Framework web
- **pg**: Cliente PostgreSQL
- **jsonwebtoken**: Gestión de tokens JWT

---

## **Requisitos Previos**

- **Node.js** (v14 o superior)
- **PostgreSQL** (v12 o superior)
- **npm** o **yarn** como gestor de paquetes

---

## **Instalación**

Sigue estos pasos para instalar y configurar el proyecto:

## 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd donde-es
```

## 2. Instalar las dependencias del servidor

```bash
cd server
npm install
```

## 3. Configurar variables de entorno

#### Crea un archivo .env basado en .env.example y configura los valores:

#### Configuración de Base de Datos

- DB_USER=your_username
- DB_HOST=your_host
- DB_NAME=your_database_name
- DB_PASSWORD=your_password
- DB_PORT=5432

#### Configuración JWT

- JWT_SECRET=your_jwt_secret
- NODE_ENV=development

#### Clave HERE MAPS

HERE_MAPS_API_KEY=your_here_maps_key

## 4. Configurar la base de datos

- Crea la base de datos en PostgreSQL.
- Ejecuta el archivo dump_bd_donde-es.sql dentro de la base de datos creada previamente.


### Despliegue y Ejecución

1. Iniciar el servidor:

```bash
  cd server
  npm run dev # Para desarrollo
  npm start # Para producción
```

1. Acceder a la aplicación:

- Abre http://localhost:3000 en tu navegador. La aplicación estará disponible en este URL.

## **Funcionalidades Principales**

### **Gestión de Usuarios**

- Registro e inicio de sesión
- Perfiles de usuario personalizables
- Gestión de sesiones con JWT

### **Gestión de Eventos**

- Crear eventos con ubicación
- Ver eventos cercanos
- Filtrar eventos por distancia
- Ver detalles de eventos en un modal

### **Geolocalización**

- Integración con HERE Maps
- Búsqueda de ubicaciones
- Cálculo de distancias
