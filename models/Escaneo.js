const pool = require('../config/database')

const Escaneo = {

    crear: async (usuario_id, imagen_path) => {
        const [resultado] = await pool.query(
            `INSERT INTO ESCANEOS (usuario_id, imagen_path) 
            VALUES (?, ?)`,
            [usuario_id, imagen_path]
        )
        return resultado.insertId
    },

    actualizarRawText: async (id, raw_text) => {
        const [resultado] = await pool.query(
            `UPDATE ESCANEOS SET raw_text = ?, procesado = 1 
            WHERE id = ?`,
            [raw_text, id]
        )
        return resultado
    },

    buscarPorId: async (id) => {
        const [filas] = await pool.query(
            `SELECT * FROM ESCANEOS WHERE id = ?`,
            [id]
        )
        return filas[0]
    },

    listarPorUsuario: async (usuario_id) => {
        const [filas] = await pool.query(
            `SELECT * FROM ESCANEOS 
            WHERE usuario_id = ? 
            ORDER BY fecha_escaneo DESC`,
            [usuario_id]
        )
        return filas
    },

    eliminar: async (id) => {
        const [resultado] = await pool.query(
            `DELETE FROM ESCANEOS WHERE id = ?`,
            [id]
        )
        return resultado
    }

}

module.exports = Escaneo