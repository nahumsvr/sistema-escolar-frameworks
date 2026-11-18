const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * @swagger
 * /api/materias:
 *   get:
 *     summary: Obtiene todas las materias
 *     tags: [Materias]
 *     responses:
 *       200:
 *         description: Lista de materias obtenida.
 *       500:
 *         description: Error al consultar la BD.
 */
router.get('/', async (req, res) => {
    try {
        const resultado = await db.query('SELECT * FROM materias ORDER BY id');
        res.status(200).json(resultado.rows);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al consultar la BD" });
    }
});

/**
 * @swagger
 * /api/materias/{id}:
 *   get:
 *     summary: Obtiene una materia por su id
 *     tags: [Materias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Materia encontrada.
 *       404:
 *         description: Materia no encontrada.
 *       500:
 *         description: Error al consultar la BD.
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await db.query('SELECT * FROM materias WHERE id = $1', [id]);
        if (resultado.rowCount === 0) {
            return res.status(404).json({ mensaje: "Materia no encontrada" });
        }
        res.status(200).json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al consultar la BD" });
    }
});

/**
 * @swagger
 * /api/materias:
 *   post:
 *     summary: Registra una materia
 *     tags: [Materias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Desarrollo Web"
 *               creditos:
 *                 type: integer
 *                 example: 5
 *               profesor_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Materia registrada.
 *       500:
 *         description: Error al guardar (verifica que el profesor exista).
 */
router.post('/', async (req, res) => {
    try {
        const { nombre, creditos, profesor_id } = req.body;
        const query = 'INSERT INTO materias (nombre, creditos, profesor_id) VALUES ($1, $2, $3) RETURNING *';
        const resultado = await db.query(query, [nombre, creditos, profesor_id]);
        res.status(201).json({ mensaje: "Materia creada", materia: resultado.rows[0] });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al guardar" });
    }
});

/**
 * @swagger
 * /api/materias/{id}:
 *   put:
 *     summary: Actualiza una materia
 *     tags: [Materias]
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
 *                 example: "Cálculo Integral"
 *               creditos:
 *                 type: integer
 *                 example: 5
 *               profesor_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Materia actualizada.
 *       404:
 *         description: Materia no encontrada.
 *       500:
 *         description: Error al actualizar.
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, creditos, profesor_id } = req.body;
        const query = 'UPDATE materias SET nombre = $1, creditos = $2, profesor_id = $3 WHERE id = $4 RETURNING *';
        const resultado = await db.query(query, [nombre, creditos, profesor_id, id]);
        if (resultado.rowCount === 0) {
            return res.status(404).json({ mensaje: "Materia no encontrada" });
        }
        res.status(200).json({ mensaje: "Materia actualizada", materia: resultado.rows[0] });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar" });
    }
});

/**
 * @swagger
 * /api/materias/{id}:
 *   delete:
 *     summary: Elimina una materia
 *     tags: [Materias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Materia eliminada.
 *       404:
 *         description: Materia no encontrada.
 *       500:
 *         description: Error al eliminar (puede tener inscripciones).
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await db.query('DELETE FROM materias WHERE id = $1 RETURNING *', [id]);
        if (resultado.rowCount === 0) {
            return res.status(404).json({ mensaje: "Materia no encontrada" });
        }
        res.status(200).json({ mensaje: "Materia eliminada" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar" });
    }
});

module.exports = router;
