const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

// Importar rutas
const authRoutes = require('./routes/authRoutes')
const escaneoRoutes = require('./routes/escaneoRoutes')
const inscripcionRoutes = require('./routes/inscripcionRoutes')

// Importar rate limiter
const rateLimiter = require('./middleware/rateLimiter')

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares de seguridad
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "blob:"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"]
        }
    }
}))
app.use(cors())
app.use(rateLimiter)

// Middlewares para parsear JSON y formularios
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'frontend')))

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/escaneo', escaneoRoutes)
app.use('/api/inscripcion', inscripcionRoutes)

// Ruta raíz → sirve el frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'))
})

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})