const pool = require('../config/database')

const Historial = {

    registrar: async (escaneo_id, accion, detalle) => {
        const [resultado] = await pool.query(
            `INSERT INTO HISTORIAL_ESCANEOS 
            (escaneo_id, accion, detalle) 
            VALUES (?, ?, ?)`,
            [escaneo_id, accion, detalle]
        )
        return resultado
    },

    buscarPorEscaneo: async (escaneo_id) => {
        const [filas] = await pool.query(
            `SELECT * FROM HISTORIAL_ESCANEOS 
            WHERE escaneo_id = ? 
            ORDER BY registrado_en ASC`,
            [escaneo_id]
        )
        return filas
    },

    listarTodos: async () => {
        const [filas] = await pool.query(
            `SELECT h.*, e.imagen_path, u.nombre_operador
            FROM HISTORIAL_ESCANEOS h
            JOIN ESCANEOS e ON h.escaneo_id = e.id
            JOIN USUARIOS u ON e.usuario_id = u.id
            ORDER BY h.registrado_en DESC`
        )
        return filas
    },

    eliminarPorEscaneo: async (escaneo_id) => {
        const [resultado] = await pool.query(
            `DELETE FROM HISTORIAL_ESCANEOS 
            WHERE escaneo_id = ?`,
            [escaneo_id]
        )
        return resultado
    }

}

module.exports = Historial