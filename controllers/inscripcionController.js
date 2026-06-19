const Inscripcion = require('../models/Inscripcion')
const Historial = require('../models/Historial')

const inscripcionController = {

    crear: async (req, res) => {
        try {
            const {
                escaneo_id,
                nombre,
                apellido,
                dni_numero,
                fecha_nacimiento,
                sexo,
                domicilio,
                cuil
            } = req.body

            // Verificar campos obligatorios
            if (!escaneo_id || !nombre || !apellido || !dni_numero) {
                return res.status(400).json({
                    error: 'Faltan campos obligatorios'
                })
            }

            // Verificar que no exista ya una inscripción para ese escaneo
            const inscripcionExistente = await Inscripcion.buscarPorEscaneo(escaneo_id)
            if (inscripcionExistente) {
                return res.status(400).json({
                    error: 'Ya existe una inscripción para este escaneo'
                })
            }

            // Crear la inscripción
            const inscripcion_id = await Inscripcion.crear({
                escaneo_id,
                nombre,
                apellido,
                dni_numero,
                fecha_nacimiento,
                sexo,
                domicilio,
                cuil
            })

            // Registrar en el historial
            await Historial.registrar(
                escaneo_id,
                'inscripcion_creada',
                `Inscripción creada con id: ${inscripcion_id}`
            )

            return res.status(201).json({
                mensaje: 'Inscripción creada correctamente',
                inscripcion_id
            })

        } catch (error) {
            return res.status(500).json({
                error: 'Error al crear la inscripción',
                detalle: error.message
            })
        }
    },

    obtener: async (req, res) => {
        try {
            const inscripcion = await Inscripcion.buscarPorId(req.params.id)
            if (!inscripcion) {
                return res.status(404).json({
                    error: 'Inscripción no encontrada'
                })
            }
            return res.status(200).json({ inscripcion })
        } catch (error) {
            return res.status(500).json({
                error: 'Error al obtener la inscripción',
                detalle: error.message
            })
        }
    },

    listar: async (req, res) => {
        try {
            const inscripciones = await Inscripcion.listarTodas()
            return res.status(200).json({ inscripciones })
        } catch (error) {
            return res.status(500).json({
                error: 'Error al listar inscripciones',
                detalle: error.message
            })
        }
    },

    actualizarEstado: async (req, res) => {
        try {
            const { estado } = req.body
            const estadosValidos = ['pendiente', 'confirmada', 'cancelada']

            if (!estadosValidos.includes(estado)) {
                return res.status(400).json({
                    error: 'Estado inválido. Debe ser pendiente, confirmada o cancelada'
                })
            }

            await Inscripcion.actualizarEstado(req.params.id, estado)

            await Historial.registrar(
                req.params.id,
                'estado_actualizado',
                `Estado cambiado a: ${estado}`
            )

            return res.status(200).json({
                mensaje: `Estado actualizado a: ${estado}`
            })

        } catch (error) {
            return res.status(500).json({
                error: 'Error al actualizar el estado',
                detalle: error.message
            })
        }
    }

}

module.exports = inscripcionController