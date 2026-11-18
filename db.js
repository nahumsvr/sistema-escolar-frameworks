// 1. IMPORTACIÓN
// Extraemos únicamente la herramienta 'Pool' de la librería 'pg'.
const { Pool, types } = require('pg');

// Devuelve las columnas DATE como texto 'YYYY-MM-DD' en lugar de convertirlas a fecha con hora.
// 1082 es el identificador interno del tipo DATE en PostgreSQL.
types.setTypeParser(1082, (valor) => valor);

// 2. CREACIÓN DEL POOL DE CONEXIONES
// El Pool administra varias conexiones abiertas y listas para usarse.
const db = new Pool({
    user: 'postgres',        // El superusuario
    host: 'localhost',       // Tu computadora
    database: 'escuela_db',  // El nombre de la base de datos
    password: 'postgres',    // La contraseña de postgres
    port: 5432,
});

// 3. EXPORTACIÓN DEL MÓDULO
// Permite que otros archivos hagan require('./db') y usen la conexión.
module.exports = db;
