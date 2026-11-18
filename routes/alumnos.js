const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * @swagger
 * /api/alumnos:
 *   get:
 *     summary: Obtiene todos los alumnos
 *     tags: [Alumnos]
 *     responses:
 *       200:
 *         description: Lista de alumnos obtenida.
 *       500:
 *         description: Error al consultar la BD.
 */
router.get('/', async (req, res) => {
    try {
        const resultado = await db.query('SELECT * FROM alumnos ORDER BY id');
        res.status(200).json(resultado.rows);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al consultar la BD" });
    }
});

/**
 * @swagger
 * /api/alumnos/{id}:
 *   get:
 *     summary: Obtiene un alumno por su id
 *     tags: [Alumnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Alumno encontrado.
 *       404:
 *         description: Alumno no encontrado.
 *       500:
 *         description: Error al consultar la BD.
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await db.query('SELECT * FROM alumnos WHERE id = $1', [id]);
        if (resultado.rowCount === 0) {
            return res.status(404).json({ mensaje: "Alumno no encontrado" });
        }
        res.status(200).json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al consultar la BD" });
    }
});

/**
 * @swagger
 * /api/alumnos:
 *   post:
 *     summary: Registra un alumno
 *     tags: [Alumnos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               matricula:
 *                 type: string
 *                 example: "A2025011"
 *               nombre:
 *                 type: string
 *                 example: "Andrea Lozano Peña"
 *               semestre:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Alumno registrado.
 *       500:
 *         description: Error al guardar (la matrícula debe ser única).
 */
router.post('/', async (req, res) => {
    try {
        const { matricula, nombre, semestre } = req.body;
        const query = 'INSERT INTO alumnos (matricula, nombre, semestre) VALUES ($1, $2, $3) RETURNING *';
        const resultado = await db.query(query, [matricula, nombre, semestre]);
        res.status(201).json({ mensaje: "Alumno creado", alumno: resultado.rows[0] });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al guardar" });
    }
});

/**
 * @swagger
 * /api/alumnos/{id}:
 *   put:
 *     summary: Actualiza un alumno
 *     tags: [Alumnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               matricula:
 *                 type: string
 *                 example: "A2024001"
 *               nombre:
 *                 type: string
 *                 example: "Diego Pérez Salas"
 *               semestre:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Alumno actualizado.
 *       404:
 *         description: Alumno no encontrado.
 *       500:
 *         description: Error al actualizar.
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { matricula, nombre, semestre } = req.body;
        const query = 'UPDATE alumnos SET matricula = $1, nombre = $2, semestre = $3 WHERE id = $4 RETURNING *';
        const resultado = await db.query(query, [matricula, nombre, semestre, id]);
        if (resultado.rowCount === 0) {
            return res.status(404).json({ mensaje: "Alumno no encontrado" });
        }
        res.status(200).json({ mensaje: "Alumno actualizado", alumno: resultado.rows[0] });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar" });
    }
});

/**
 * @swagger
 * /api/alumnos/{id}:
 *   delete:
 *     summary: Elimina un alumno
 *     tags: [Alumnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Alumno eliminado.
 *       404:
 *         description: Alumno no encontrado.
 *       500:
 *         description: Error al eliminar (puede tener inscripciones).
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await db.query('DELETE FROM alumnos WHERE id = $1 RETURNING *', [id]);
        if (resultado.rowCount === 0) {
            return res.status(404).json({ mensaje: "Alumno no encontrado" });
        }
        res.status(200).json({ mensaje: "Alumno eliminado" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar" });
    }
});

module.exports = router;
