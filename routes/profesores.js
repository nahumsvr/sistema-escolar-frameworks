const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * @swagger
 * /api/profesores:
 *   get:
 *     summary: Obtiene todos los profesores
 *     tags: [Profesores]
 *     responses:
 *       200:
 *         description: Lista de profesores obtenida.
 *       500:
 *         description: Error al consultar la BD.
 */
router.get('/', async (req, res) => {
    try {
        const resultado = await db.query('SELECT * FROM profesores ORDER BY id');
        res.status(200).json(resultado.rows);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al consultar la BD" });
    }
});

/**
 * @swagger
 * /api/profesores:
 *   post:
 *     summary: Registra un profesor
 *     tags: [Profesores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Ricardo Salinas Paz"
 *               especialidad:
 *                 type: string
 *                 example: "Inteligencia Artificial"
 *               correo:
 *                 type: string
 *                 example: "ricardo.salinas@escuela.edu.mx"
 *     responses:
 *       201:
 *         description: Profesor registrado.
 *       500:
 *         description: Error al guardar.
 */
router.post('/', async (req, res) => {
    try {
        const { nombre, especialidad, correo } = req.body;
        const query = 'INSERT INTO profesores (nombre, especialidad, correo) VALUES ($1, $2, $3) RETURNING *';
        const resultado = await db.query(query, [nombre, especialidad, correo]);
        res.status(201).json({ mensaje: "Profesor creado", profesor: resultado.rows[0] });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al guardar" });
    }
});

/**
 * @swagger
 * /api/profesores/{id}:
 *   put:
 *     summary: Actualiza un profesor
 *     tags: [Profesores]
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
 *               nombre:
 *                 type: string
 *                 example: "Laura Martínez Ruiz"
 *               especialidad:
 *                 type: string
 *                 example: "Matemáticas Aplicadas"
 *               correo:
 *                 type: string
 *                 example: "laura.martinez@escuela.edu.mx"
 *     responses:
 *       200:
 *         description: Profesor actualizado.
 *       404:
 *         description: Profesor no encontrado.
 *       500:
 *         description: Error al actualizar.
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, especialidad, correo } = req.body;
        const query = 'UPDATE profesores SET nombre = $1, especialidad = $2, correo = $3 WHERE id = $4 RETURNING *';
        const resultado = await db.query(query, [nombre, especialidad, correo, id]);
        if (resultado.rowCount === 0) {
            return res.status(404).json({ mensaje: "Profesor no encontrado" });
        }
        res.status(200).json({ mensaje: "Profesor actualizado", profesor: resultado.rows[0] });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar" });
    }
});

/**
 * @swagger
 * /api/profesores/{id}:
 *   delete:
 *     summary: Elimina un profesor
 *     tags: [Profesores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Profesor eliminado.
 *       404:
 *         description: Profesor no encontrado.
 *       500:
 *         description: Error al eliminar (puede tener materias asignadas).
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await db.query('DELETE FROM profesores WHERE id = $1 RETURNING *', [id]);
        if (resultado.rowCount === 0) {
            return res.status(404).json({ mensaje: "Profesor no encontrado" });
        }
        res.status(200).json({ mensaje: "Profesor eliminado" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar" });
    }
});

module.exports = router;
