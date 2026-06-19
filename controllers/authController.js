const Usuario = require('../models/Usuario')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const authController = {

    registro: async (req, res) => {
        try {
            const { nombre_operador, email, password } = req.body

            // Verificar que no falte ningún campo
            if (!nombre_operador || !email || !password) {
                return res.status(400).json({
                    error: 'Todos los campos son obligatorios'
                })
            }

            // Verificar que el email no esté registrado
            const usuarioExistente = await Usuario.buscarPorEmail(email)
            if (usuarioExistente) {
                return res.status(400).json({
                    error: 'Ya existe un operador con ese email'
                })
            }

            // Crear el usuario
            await Usuario.crear(nombre_operador, email, password)

            return res.status(201).json({
                mensaje: 'Operador registrado correctamente'
            })

        } catch (error) {
            return res.status(500).json({
                error: 'Error interno del servidor',
                detalle: error.message
            })
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body

            // Verificar que no falte ningún campo
            if (!email || !password) {
                return res.status(400).json({
                    error: 'Email y contraseña son obligatorios'
                })
            }

            // Buscar el usuario por email
            const usuario = await Usuario.buscarPorEmail(email)
            if (!usuario) {
                return res.status(401).json({
                    error: 'Email o contraseña incorrectos'
                })
            }

            // Verificar la contraseña
            const passwordValida = await Usuario.verificarPassword(
                password,
                usuario.password_hash
            )
            if (!passwordValida) {
                return res.status(401).json({
                    error: 'Email o contraseña incorrectos'
                })
            }

            // Generar el token JWT
            const token = jwt.sign(
                { id: usuario.id, email: usuario.email },
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            )

            return res.status(200).json({
                mensaje: 'Login exitoso',
                token,
                usuario: {
                    id: usuario.id,
                    nombre_operador: usuario.nombre_operador,
                    email: usuario.email
                }
            })

        } catch (error) {
            return res.status(500).json({
                error: 'Error interno del servidor',
                detalle: error.message
            })
        }
    },

    perfil: async (req, res) => {
        try {
            const usuario = await Usuario.buscarPorId(req.usuario.id)
            return res.status(200).json({ usuario })
        } catch (error) {
            return res.status(500).json({
                error: 'Error interno del servidor',
                detalle: error.message
            })
        }
    }

}

module.exports = authController