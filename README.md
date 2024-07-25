# AsesinoEnSerieApp (Frontend)

Esta es la aplicación frontend del juego social "Asesino en Serie". Desarrollada con React Native y Expo, esta aplicación permite a los jugadores interactuar en tiempo real en una partida del juego.

## Características

### Funcionalidades Actuales
- Crear cuenta
- Iniciar sesión
- Crear partida
- Nombrar partida
- Invitar jugadores a la partida
- Guardar partidas en curso
- Cargar partidas en curso
- Salir de la partida en curso
- Chatear en tiempo real con los usuarios de la partida
- Ejecutar acciones específicas por rol, notificando en tiempo real
- Increpar / Ser increpado
- Asesinar / Ser asesinado
- Elegir entre carta libre o formato de carta de despedida al ser asesinado
- El jugador asesinado sigue siendo parte de la partida, pero no puede hablar en el chat
- Usuario tipo REPORTE encargado de acumular los eventos del día

### Funcionalidades Pendientes para Versión Beta (v1)
- Determinar el equipo ganador según la cantidad de asesinados
- Lanzar reporte en horario
- Revisar que la partida termine correctamente y salir del flujo
- Revisar acciones por rol específicas (ej. el doctor pueda salvar después de alguien ser asesinado)
- Registrar una partida completa

### Mejoras Futuras
- Mejoras visuales
- Mejoras en la experiencia del usuario
- Funcionalidades adicionales relacionadas con la red social (interacciones de perfil)

## Instalación y Configuración

### Requisitos Previos
- Node.js (v16 o superior)
- npm (v7 o superior) o yarn

### Configuración del Entorno

1. Clona el repositorio y navega a la carpeta del frontend:
   ```sh
   git clone https://github.com/GabrielRecabarren/AsesinoEnSerieApp.git
   cd AsesinoEnSerieApp
```
2. Instala las dependencias:
```sh

yarn install
```
Inicia la aplicación:
```sh

npx expo start
```
O utiliza el script de inicio:
```sh

./start.sh
```

# AsesinoEnSerieApp (Backend)

Este es el backend del juego social "Asesino en Serie". Desarrollado con Node.js y Express, y utilizando PostgreSQL a través de Prisma, este servidor gestiona la lógica del juego y la comunicación en tiempo real entre los jugadores.

## Características

### Funcionalidades Actuales
- Autenticación de usuarios
- Gestión de partidas
  - Crear partida
  - Nombrar partida
  - Invitar jugadores a la partida
  - Guardar partidas en curso
  - Cargar partidas en curso
  - Salir de la partida en curso
- Comunicación en tiempo real mediante WebSockets
- Acciones específicas por rol con notificaciones en tiempo real
  - Increpar / Ser increpado
  - Asesinar / Ser asesinado
- Manejo de estado de los jugadores
  - El jugador asesinado sigue siendo parte de la partida, pero no puede hablar en el chat
- Usuario tipo REPORTE encargado de acumular los eventos del día

### Funcionalidades Pendientes para Versión Beta (v1)
- Determinar el equipo ganador según la cantidad de asesinados
- Lanzar reporte en horario
- Revisar que la partida termine correctamente y salir del flujo
- Revisar acciones por rol específicas (ej. el doctor pueda salvar después de alguien ser asesinado)
- Registrar una partida completa

### Mejoras Futuras
- Mejoras visuales en los informes
- Mejoras en la experiencia del usuario
- Funcionalidades adicionales relacionadas con la red social (interacciones de perfil)

## Instalación y Configuración

### Requisitos Previos
- Node.js (v16 o superior)
- npm (v7 o superior)
- PostgreSQL

### Configuración del Entorno

1. Clona el repositorio y navega a la carpeta del backend:
   ```sh
   git clone https://github.com/GabrielRecabarren/backend_AsesinoApp.git
   cd backend_AsesinoApp

```

2. Instala las dependencias:
```sh

npm install
```
Configura las variables de entorno en un archivo .env:
```

DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
JWT_SECRET=<your-jwt-secret>
```
Inicia el servidor:
```sh

npm run dev
```
O utiliza el script de inicio:
```sh

./start.sh
```
Configuración de la Base de Datos
Asegúrate de que tu base de datos PostgreSQL esté configurada y accesible mediante la URL proporcionada en el archivo .env. Luego, inicializa Prisma:

```sh
npx prisma migrate dev --name init
```
