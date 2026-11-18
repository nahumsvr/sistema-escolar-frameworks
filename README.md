# API Sistema de Administración Escolar

API REST modular (Express + PostgreSQL + Swagger) para gestionar profesores, materias, alumnos e inscripciones.

## Estructura

```
db.js            Pool de conexión a PostgreSQL
index.js         Servidor, Swagger y conexión de rutas
routes/          Un archivo por tabla (CRUD con express.Router)
database.sql     Creación de tablas e inserción de datos
```

## Relaciones

- Un profesor imparte muchas materias (`materias.profesor_id`).
- Un alumno se inscribe a muchas materias y una materia tiene muchos alumnos: la tabla `inscripciones` resuelve la relación N:M (`alumno_id`, `materia_id`).

## Cómo ejecutar

1. Crear la base de datos `escuela_db` en PostgreSQL (usuario `postgres`, contraseña `postgres`).
2. Ejecutar `database.sql` en DataGrip (consola SQL de `escuela_db`).
3. Instalar dependencias: `npm install`
4. Iniciar el servidor: `node index.js`
5. Abrir la documentación: http://localhost:3000/api-docs

## Endpoints

| Tabla | Ruta base |
|-------|-----------|
| Profesores | `/api/profesores` |
| Materias | `/api/materias` |
| Alumnos | `/api/alumnos` |
| Inscripciones | `/api/inscripciones` |

Cada ruta tiene `GET /`, `POST /`, `PUT /:id` y `DELETE /:id`.
