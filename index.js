// 1. IMPORTACIÓN DE DEPENDENCIAS GLOBALES
const express = require('express');
// Middleware para permitir peticiones de otros puertos (Frontend)
const cors = require('cors');
// Motor para renderizar la interfaz gráfica de la documentación
const swaggerUi = require('swagger-ui-express');
// Traductor que lee los comentarios YAML y genera el JSON oficial de OpenAPI
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();

// 2. CONFIGURACIÓN DE MIDDLEWARES
app.use(cors());
app.use(express.json());

// 3. CONFIGURACIÓN DEL CONTRATO DE SWAGGER (OpenAPI)
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Sistema de Administración Escolar',
            version: '1.0.0',
            description: 'API modular para gestionar profesores, materias, alumnos e inscripciones con calificaciones.'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor Local de Desarrollo'
            }
        ]
    },
    // Swagger escanea todos los archivos de la carpeta 'routes'
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 4. IMPORTACIÓN DE RUTAS MODULARES
const rutasProfesores = require('./routes/profesores');
const rutasMaterias = require('./routes/materias');
const rutasAlumnos = require('./routes/alumnos');
const rutasInscripciones = require('./routes/inscripciones');

// 5. CONEXIÓN DE RUTAS (Delegación del tráfico)
app.use('/api/profesores', rutasProfesores);
app.use('/api/materias', rutasMaterias);
app.use('/api/alumnos', rutasAlumnos);
app.use('/api/inscripciones', rutasInscripciones);

// 6. ENCENDER EL SERVIDOR
const PUERTO = 3000;
app.listen(PUERTO, () => {
    console.log(`Servidor corriendo exitosamente en http://localhost:${PUERTO}`);
    console.log(`Documentación interactiva lista en http://localhost:${PUERTO}/api-docs`);
});
