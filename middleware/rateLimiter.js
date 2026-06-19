const rateLimit = require('express-rate-limit')

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: 'Demasiadas solicitudes, esperá 15 minutos e intentá de nuevo.'
    }
})

module.exports = rateLimiter