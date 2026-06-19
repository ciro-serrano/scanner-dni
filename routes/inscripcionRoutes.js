const express = require('express')
const router = express.Router()
const inscripcionController = require('../controllers/inscripcionController')
const verificarToken = require('../middleware/auth')

// Todas las rutas de inscripción requieren token
router.use(verificarToken)

// POST /api/inscripcion → crear inscripción nueva
router.post('/', inscripcionController.crear)

// GET /api/inscripcion → listar todas las inscripciones
router.get('/', inscripcionController.listar)

// GET /api/inscripcion/:id → obtener una inscripción específica
router.get('/:id', inscripcionController.obtener)

// PATCH /api/inscripcion/:id/estado → actualizar estado
router.patch('/:id/estado', inscripcionController.actualizarEstado)

module.exports = router