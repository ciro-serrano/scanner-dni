const express = require('express')
const router = express.Router()
const escaneoController = require('../controllers/escaneoController')
const verificarToken = require('../middleware/auth')
const upload = require('../middleware/upload')

// Todas las rutas de escaneo requieren token
router.use(verificarToken)

// POST /api/escaneo → escanear un DNI espera 2 campos posibles
router.post('/', upload.fields([
    { name: 'frente', maxCount: 1 },
    { name: 'dorso', maxCount: 1 }
]), escaneoController.escanear)
// GET /api/escaneo → listar escaneos del operador
router.get('/', escaneoController.listar)

// GET /api/escaneo/:id → obtener un escaneo específico
router.get('/:id', escaneoController.obtener)

// DELETE /api/escaneo/:id → eliminar un escaneo
router.delete('/:id', escaneoController.eliminar)

module.exports = router