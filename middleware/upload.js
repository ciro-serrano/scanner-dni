const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const nombreUnico = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const extension = path.extname(file.originalname)
        cb(null, nombreUnico + extension)
    }
})

const filtroArchivos = (req, file, cb) => {
    const tiposPermitidos = /jpeg|jpg|png|pdf/
    const extension = tiposPermitidos.test(path.extname(file.originalname).toLowerCase())
    const mimeType = tiposPermitidos.test(file.mimetype)

    if (extension && mimeType) {
        cb(null, true)
    } else {
        cb(new Error('Solo se permiten archivos JPG, PNG o PDF'))
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: filtroArchivos
})

module.exports = upload