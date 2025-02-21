const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const router = express.Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

router.use(express.json());

/**
 * @swagger
 * /habitaciones:
 *   get:
 *     summary: Obtiene todas las habitaciones
 *     tags: [Habitaciones]
 *     responses:
 *       200:
 *         description: Lista de habitaciones obtenida exitosamente
 *       500:
 *         description: Error al obtener las habitaciones
 *       404:
 *         description: No hay habitaciones registradas
 */
router.get('/', async (req, res) => {
    const { data, error } = await supabase.from('habitaciones').select('*');

    if (error) return res.status(500).json({ error: error.message });

    if (!data || data.length === 0) {
        return res.status(404).json({ error: "No hay habitaciones registradas" });
    }

    res.json(data);
});

/**
 * @swagger
 * /habitaciones/{id}:
 *   get:
 *     summary: Obtiene una habitación por ID
 *     tags: [Habitaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la habitación a obtener
 *     responses:
 *       200:
 *         description: Habitación encontrada
 *       404:
 *         description: Habitación no encontrada
 *       400:
 *         description: ID inválido
 */
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "ID inválido. Debe ser un número entero positivo." });
    }

    const { data, error } = await supabase.from('habitaciones').select('*').eq('habitacion_id', id).single();

    if (error || !data) {
        return res.status(404).json({ error: "Habitación no encontrada" });
    }

    res.json(data);
});

/**
 * @swagger
 * /habitaciones:
 *   post:
 *     summary: Crea una nueva habitación
 *     tags: [Habitaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               num_habi:
 *                 type: integer
 *               tipo:
 *                 type: string
 *               capacidad:
 *                 type: integer
 *               precio:
 *                 type: integer
 *               estado:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Habitación creada exitosamente
 *       400:
 *         description: Datos de la habitación inválidos
 *       409:
 *         description: El número de habitación ya existe
 */
router.post('/', async (req, res) => {
    const { num_habi, tipo, capacidad, precio, estado } = req.body;

    if (!num_habi || !tipo || !capacidad || !precio || estado === undefined) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    const { data: existeHabitacion } = await supabase
        .from('habitaciones')
        .select('*')
        .eq('num_habi', num_habi)
        .single();

    if (existeHabitacion) {
        return res.status(409).json({ error: "El número de habitación ya existe." });
    }

    const { data, error } = await supabase
        .from('habitaciones')
        .insert([{ num_habi, tipo, capacidad, precio, estado }])
        .select('*')
        .single();

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json(data);
});

/**
 * @swagger
 * /habitaciones/{id}:
 *   patch:
 *     summary: Actualiza parcialmente una habitación por ID
 *     tags: [Habitaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la habitación a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               num_habi:
 *                 type: integer
 *               tipo:
 *                 type: string
 *               capacidad:
 *                 type: integer
 *               precio:
 *                 type: integer
 *               estado:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Habitación actualizada correctamente
 *       400:
 *         description: ID inválido o datos incorrectos
 *       404:
 *         description: Habitación no encontrada
 *       500:
 *         description: Error al actualizar la habitación
 */
router.patch('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "ID inválido. Debe ser un número entero positivo." });
    }

    const { num_habi, tipo, capacidad, precio, estado } = req.body;

    // Verificar si la habitación existe
    const { data: habitacionExistente } = await supabase
        .from('habitaciones')
        .select('*')
        .eq('habitacion_id', id)
        .single();

    if (!habitacionExistente) {
        return res.status(404).json({ error: "Habitación no encontrada." });
    }

    // Crear objeto con solo los campos que el usuario quiere actualizar
    const camposActualizados = {};
    if (num_habi !== undefined) camposActualizados.num_habi = num_habi;
    if (tipo !== undefined) camposActualizados.tipo = tipo;
    if (capacidad !== undefined) camposActualizados.capacidad = capacidad;
    if (precio !== undefined) camposActualizados.precio = precio;
    if (estado !== undefined) camposActualizados.estado = estado;

    // Si no hay campos válidos para actualizar, devolver error
    if (Object.keys(camposActualizados).length === 0) {
        return res.status(400).json({ error: "Debe proporcionar al menos un campo para actualizar." });
    }

    // Actualizar la habitación con los campos proporcionados
    const { data, error } = await supabase
        .from('habitaciones')
        .update(camposActualizados)
        .eq('habitacion_id', id)
        .select('*')
        .single();

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: "Habitación actualizada correctamente.", data });
});


/**
 * @swagger
 * /habitaciones/{id}:
 *   delete:
 *     summary: Elimina una habitación
 *     tags: [Habitaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Habitación eliminada exitosamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Habitación no encontrada
 */
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "ID inválido. Debe ser un número entero positivo." });
    }

    const { data: habitacionExistente } = await supabase.from('habitaciones').select('*').eq('habitacion_id', id).single();

    if (!habitacionExistente) {
        return res.status(404).json({ error: "Habitación no encontrada" });
    }

    const { error } = await supabase.from('habitaciones').delete().eq('habitacion_id', id);

    if (error) return res.status(500).json({ error: error.message });

    res.status(204).send();
});


// Exportamos el router en lugar de iniciar un servidor
module.exports = router;
