const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const verificarToken = require('../middleware/auth')

// POST /api/auth/registro → crear operador nuevo
router.post('/registro', authController.registro) // <---- cuando llegue un POST a """" llama a """"

// POST /api/auth/login → iniciar sesión
router.post('/login', authController.login)

// GET /api/auth/perfil → ver perfil del operador autenticado
router.get('/perfil', verificarToken, authController.perfil)  // tiene 3 argumentos,  el 'verificartoken' es un middleware de autenticacion , antes de llegar al Controller , verifica qque el opredaaor tenga tokens validos 

module.exports = router