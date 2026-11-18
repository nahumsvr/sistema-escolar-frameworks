const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * @swagger
 * /api/inscripciones:
 *   get:
 *     summary: Obtiene todas las inscripciones
 *     tags: [Inscripciones]
 *     responses:
 *       200:
 *         description: Lista de inscripciones obtenida.
 *       500:
 *         description: Error al consultar la BD.
 */
router.get('/', async (req, res) => {
    try {
        const resultado = await db.query('SELECT * FROM inscripciones ORDER BY id');
        res.status(200).json(resultado.rows);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al consultar la BD" });
    }
});

/**
 * @swagger
 * /api/inscripciones:
 *   post:
 *     summary: Inscribe un alumno a una materia
 *     tags: [Inscripciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_alta:
 *                 type: string
 *                 format: date
 *                 example: "2025-08-18"
 *               calificacion_final:
 *                 type: number
 *                 example: 8.5
 *               alumno_id:
 *                 type: integer
 *                 example: 1
 *               materia_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Inscripción registrada.
 *       500:
 *         description: Error al guardar (verifica que el alumno y la materia existan).
 */
router.post('/', async (req, res) => {
    try {
        const { fecha_alta, calificacion_final, alumno_id, materia_id } = req.body;
        const query = 'INSERT INTO inscripciones (fecha_alta, calificacion_final, alumno_id, materia_id) VALUES ($1, $2, $3, $4) RETURNING *';
        const resultado = await db.query(query, [fecha_alta, calificacion_final, alumno_id, materia_id]);
        res.status(201).json({ mensaje: "Inscripción creada", inscripcion: resultado.rows[0] });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al guardar" });
    }
});

/**
 * @swagger
 * /api/inscripciones/{id}:
 *   put:
 *     summary: Actualiza una inscripción (ej. capturar calificación)
 *     tags: [Inscripciones]
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
 *               fecha_alta:
 *                 type: string
 *                 format: date
 *                 example: "2025-08-11"
 *               calificacion_final:
 *                 type: number
 *                 example: 9.8
 *               alumno_id:
 *                 type: integer
 *                 example: 1
 *               materia_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Inscripción actualizada.
 *       404:
 *         description: Inscripción no encontrada.
 *       500:
 *         description: Error al actualizar.
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha_alta, calificacion_final, alumno_id, materia_id } = req.body;
        const query = 'UPDATE inscripciones SET fecha_alta = $1, calificacion_final = $2, alumno_id = $3, materia_id = $4 WHERE id = $5 RETURNING *';
        const resultado = await db.query(query, [fecha_alta, calificacion_final, alumno_id, materia_id, id]);
        if (resultado.rowCount === 0) {
            return res.status(404).json({ mensaje: "Inscripción no encontrada" });
        }
        res.status(200).json({ mensaje: "Inscripción actualizada", inscripcion: resultado.rows[0] });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar" });
    }
});

/**
 * @swagger
 * /api/inscripciones/{id}:
 *   delete:
 *     summary: Elimina una inscripción
 *     tags: [Inscripciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Inscripción eliminada.
 *       404:
 *         description: Inscripción no encontrada.
 *       500:
 *         description: Error al eliminar.
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await db.query('DELETE FROM inscripciones WHERE id = $1 RETURNING *', [id]);
        if (resultado.rowCount === 0) {
            return res.status(404).json({ mensaje: "Inscripción no encontrada" });
        }
        res.status(200).json({ mensaje: "Inscripción eliminada" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar" });
    }
});

module.exports = router;
