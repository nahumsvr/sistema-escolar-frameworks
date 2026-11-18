-- SISTEMA DE ADMINISTRACIÓN ESCOLAR (escuela_db)

DROP TABLE IF EXISTS inscripciones;
DROP TABLE IF EXISTS materias;
DROP TABLE IF EXISTS alumnos;
DROP TABLE IF EXISTS profesores;

-- 1. CREACIÓN DE TABLAS

-- Profesores: tabla independiente (no depende de nadie)
CREATE TABLE profesores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especialidad VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL
);

-- Materias: cada materia la imparte un profesor (1 profesor -> N materias)
CREATE TABLE materias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    creditos INTEGER NOT NULL CHECK (creditos > 0),
    profesor_id INTEGER NOT NULL REFERENCES profesores(id)
);

-- Alumnos: tabla independiente
CREATE TABLE alumnos (
    id SERIAL PRIMARY KEY,
    matricula VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    semestre INTEGER NOT NULL CHECK (semestre BETWEEN 1 AND 12)
);

-- Inscripciones: tabla intermedia (N alumnos <-> N materias)
CREATE TABLE inscripciones (
    id SERIAL PRIMARY KEY,
    fecha_alta DATE NOT NULL DEFAULT CURRENT_DATE,
    calificacion_final NUMERIC(4,2) CHECK (calificacion_final BETWEEN 0 AND 10),
    alumno_id INTEGER NOT NULL REFERENCES alumnos(id),
    materia_id INTEGER NOT NULL REFERENCES materias(id)
);

-- 2. INSERCIÓN DE REGISTROS
INSERT INTO profesores (nombre, especialidad, correo) VALUES
('Laura Martínez Ruiz', 'Matemáticas', 'laura.martinez@escuela.edu.mx'),
('Carlos Hernández López', 'Programación', 'carlos.hernandez@escuela.edu.mx'),
('María Fernanda Gómez', 'Bases de Datos', 'maria.gomez@escuela.edu.mx'),
('Jorge Ramírez Torres', 'Redes', 'jorge.ramirez@escuela.edu.mx'),
('Ana Sofía Castillo', 'Física', 'ana.castillo@escuela.edu.mx'),
('Roberto Sánchez Díaz', 'Arquitectura de Computadoras', 'roberto.sanchez@escuela.edu.mx'),
('Patricia Morales Vega', 'Inglés', 'patricia.morales@escuela.edu.mx'),
('Luis Alberto Cruz', 'Sistemas Operativos', 'luis.cruz@escuela.edu.mx'),
('Gabriela Ortiz Reyes', 'Ingeniería de Software', 'gabriela.ortiz@escuela.edu.mx'),
('Fernando Jiménez Mora', 'Estadística', 'fernando.jimenez@escuela.edu.mx');

INSERT INTO materias (nombre, creditos, profesor_id) VALUES
('Cálculo Diferencial', 5, 1),
('Programación Orientada a Objetos', 6, 2),
('Bases de Datos', 6, 3),
('Redes de Computadoras', 5, 4),
('Física General', 4, 5),
('Arquitectura de Computadoras', 5, 6),
('Inglés Técnico', 3, 7),
('Sistemas Operativos', 5, 8),
('Ingeniería de Software', 6, 9),
('Probabilidad y Estadística', 4, 10);

INSERT INTO alumnos (matricula, nombre, semestre) VALUES
('A2024001', 'Diego Pérez Salas', 1),
('A2024002', 'Valeria Núñez Ríos', 1),
('A2023003', 'Emiliano Rojas Luna', 3),
('A2023004', 'Camila Herrera Paz', 3),
('A2022005', 'Santiago Flores Mejía', 5),
('A2022006', 'Regina Aguilar Soto', 5),
('A2021007', 'Mateo Vargas León', 7),
('A2021008', 'Ximena Medina Cano', 7),
('A2020009', 'Sebastián Ruiz Campos', 9),
('A2020010', 'Renata Domínguez Gil', 9);

INSERT INTO inscripciones (fecha_alta, calificacion_final, alumno_id, materia_id) VALUES
('2025-08-11', 9.50, 1, 1),
('2025-08-11', 8.00, 2, 1),
('2025-08-12', 7.80, 3, 2),
('2025-08-12', 9.20, 4, 3),
('2025-08-13', 6.90, 5, 4),
('2025-08-13', 8.70, 6, 6),
('2025-08-14', 10.00, 7, 8),
('2025-08-14', 9.10, 8, 9),
('2025-08-15', 7.50, 9, 9),
('2025-08-15', 8.40, 10, 10);

-- 3. VERIFICACIÓN 
SELECT * FROM profesores;
SELECT * FROM materias;
SELECT * FROM alumnos;
SELECT * FROM inscripciones;
