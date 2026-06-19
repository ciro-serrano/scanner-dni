const pool = require('../config/database')
const bcrypt = require('bcrypt')

const Usuario = {

    crear: async (nombre_operador, email, password) => {
        const saltRounds = 10
        const password_hash = await bcrypt.hash(password, saltRounds)
        const [resultado] = await pool.query(
            `INSERT INTO USUARIOS (nombre_operador, email, password_hash) 
            VALUES (?, ?, ?)`,
            [nombre_operador, email, password_hash]
        )
        return resultado
    },

    buscarPorEmail: async (email) => {
        const [filas] = await pool.query(
            `SELECT * FROM USUARIOS WHERE email = ?`,
            [email]
        )
        return filas[0]
    },

    buscarPorId: async (id) => {
        const [filas] = await pool.query(
            `SELECT id, nombre_operador, email, creado_en 
            FROM USUARIOS WHERE id = ?`,
            [id]
        )
        return filas[0]
    },

    verificarPassword: async (password, password_hash) => {
        return await bcrypt.compare(password, password_hash)
    }

}

module.exports = Usuario