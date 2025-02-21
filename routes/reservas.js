const express = require('express');
const router = express.Router();

// Base de datos simulada
let reservas = [];

// POST: Crear una nueva reserva
/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Crear una nueva reserva
 *     description: Crea una nueva reserva en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               fecha:
 *                 type: string
 *               personas:
 *                 type: integer
 *             required:
 *               - nombre
 *               - fecha
 *               - personas
 *     responses:
 *       201:
 *         description: Reserva creada con éxito.
 */
router.post('/', (req, res) => {
  const { nombre, fecha, personas } = req.body;
  const nuevaReserva = { id: reservas.length + 1, nombre, fecha, personas };
  reservas.push(nuevaReserva);
  res.status(201).json(nuevaReserva);
});

// PUT: Editar una reserva existente
/**
 * @swagger
 * /reservas/{id}:
 *   put:
 *     summary: Editar una reserva existente
 *     description: Actualiza una reserva existente por su ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la reserva
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
 *               fecha:
 *                 type: string
 *               personas:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Reserva actualizada con éxito.
 *       404:
 *         description: Reserva no encontrada.
 */
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, fecha, personas } = req.body;
  let reserva = reservas.find((r) => r.id === parseInt(id));
  
  if (!reserva) {
    return res.status(404).json({ message: 'Reserva no encontrada' });
  }

  reserva.nombre = nombre;
  reserva.fecha = fecha;
  reserva.personas = personas;
  
  res.json(reserva);
});

// DELETE: Eliminar una reserva
/**
 * @swagger
 * /reservas/{id}:
 *   delete:
 *     summary: Eliminar una reserva
 *     description: Elimina una reserva existente por su ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la reserva
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reserva eliminada con éxito.
 *       404:
 *         description: Reserva no encontrada.
 */
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const index = reservas.findIndex((r) => r.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ message: 'Reserva no encontrada' });
  }

  reservas.splice(index, 1);
  res.status(200).json({ message: 'Reserva eliminada' });
});

module.exports = router;
