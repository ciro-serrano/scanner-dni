const Escaneo = require('../models/Escaneo')
const Historial = require('../models/Historial')
const { analizarDNI } = require('../config/claudeApi')
//modulos nativos de Node.js
const fs = require('fs') //FileSystem, gracias a este modulo, Node, puede interactuar con archivos de mi disco, eliminar/leer,verificar si existe,/escribir
const path = require('path') //maneja rutas de archivos de forma inteligente ej: path.extname,path.join,etc

const detectarMimeType = (nombreArchivo) => {
    const extension = path.extname(nombreArchivo).toLowerCase()
    if (extension === '.png') return 'image/png'
    if (extension === '.pdf') return 'application/pdf'
    return 'image/jpeg'
}
const escaneoController = {

    escanear: async (req, res) => {
    try {
        // Verificar que llegó al menos un archivo
        if (!req.files || (!req.files.frente && !req.files.dorso)) {
            return res.status(400).json({
                error: 'No se recibió ninguna imagen del DNI'
            })
        }

        const usuario_id = req.usuario.id

        // Tomar la ruta de cada archivo si existe
        const archivoFrente = req.files.frente ? req.files.frente[0] : null
        const archivoDorso = req.files.dorso ? req.files.dorso[0] : null

        // Usamos la ruta del frente como referencia principal, o el dorso si no hay frente
        const imagen_path = archivoFrente ? archivoFrente.path : archivoDorso.path

        // Crear el escaneo en la base de datos
        const escaneo_id = await Escaneo.crear(usuario_id, imagen_path)

        // Registrar en el historial
        await Historial.registrar(
            escaneo_id,
            'escaneo_iniciado',
            `Frente: ${archivoFrente ? 'sí' : 'no'}, Dorso: ${archivoDorso ? 'sí' : 'no'}`
        )

        // Convertir cada imagen disponible a base64
        const imagenes = []

        if (archivoFrente) {
            const buffer = fs.readFileSync(archivoFrente.path)
            imagenes.push({
                base64: buffer.toString('base64'),
                mimeType: detectarMimeType(archivoFrente.originalname)
            })
        }

        if (archivoDorso) {
            const buffer = fs.readFileSync(archivoDorso.path)
            imagenes.push({
                base64: buffer.toString('base64'),
                mimeType: detectarMimeType(archivoDorso.originalname)
            })
        }

        // Llamar a Gemini con ambas imágenes (o la que esté disponible)
        await Historial.registrar(
            escaneo_id,
            'ocr_iniciado',
            'Enviando imagen(es) a Gemini API'
        )

        const datosExtraidos = await analizarDNI(imagenes)

        // Guardar el raw_text en el escaneo
        await Escaneo.actualizarRawText(
            escaneo_id,
            JSON.stringify(datosExtraidos)
        )

        // Registrar éxito en el historial
        await Historial.registrar(
            escaneo_id,
            'ocr_exitoso',
            `Gemini extrajo los datos correctamente`
        )

        return res.status(200).json({
            mensaje: 'DNI escaneado correctamente',
            escaneo_id,
            datos: datosExtraidos
        })

    } catch (error) {
        console.log('ERROR DETALLADO:', error)
        return res.status(500).json({
            error: 'Error al procesar el DNI',
            detalle: error.message
        })
    }
},
    
    listar: async (req, res) => {
        try {
            const escaneos = await Escaneo.listarPorUsuario(req.usuario.id)
            return res.status(200).json({ escaneos })
        } catch (error) {
            return res.status(500).json({
                error: 'Error al listar escaneos',
                detalle: error.message
            })
        }
    },

    obtener: async (req, res) => {
        try {
            const escaneo = await Escaneo.buscarPorId(req.params.id)
            if (!escaneo) {
                return res.status(404).json({
                    error: 'Escaneo no encontrado'
                })
            }
            return res.status(200).json({ escaneo })
        } catch (error) {
            return res.status(500).json({
                error: 'Error al obtener el escaneo',
                detalle: error.message
            })
        }
    },

    eliminar: async (req, res) => {
        try {
            const escaneo = await Escaneo.buscarPorId(req.params.id)
            if (!escaneo) {
                return res.status(404).json({
                    error: 'Escaneo no encontrado'
                })
            }

            // Eliminar el archivo físico de uploads/
            if (fs.existsSync(escaneo.imagen_path)) {
                fs.unlinkSync(escaneo.imagen_path)
            }

            await Escaneo.eliminar(req.params.id)

            return res.status(200).json({
                mensaje: 'Escaneo eliminado correctamente'
            })
        } catch (error) {
            return res.status(500).json({
                error: 'Error al eliminar el escaneo',
                detalle: error.message
            })
        }
    }

}

module.exports = escaneoController