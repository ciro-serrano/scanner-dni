const pool = require('../config/database')

const Inscripcion = {

    crear: async (datos) => {
        const {
            escaneo_id,
            nombre,
            apellido,
            dni_numero,
            fecha_nacimiento,
            sexo,
            domicilio,
            cuil
        } = datos

        const [resultado] = await pool.query(
            `INSERT INTO INSCRIPCIONES 
            (escaneo_id, nombre, apellido, dni_numero, 
            fecha_nacimiento, sexo, domicilio, cuil) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [escaneo_id, nombre, apellido, dni_numero,
            fecha_nacimiento, sexo, domicilio, cuil]
        )
        return resultado.insertId
    },

    buscarPorId: async (id) => {
        const [filas] = await pool.query(
            `SELECT * FROM INSCRIPCIONES WHERE id = ?`,
            [id]
        )
        return filas[0]
    },

    buscarPorEscaneo: async (escaneo_id) => {
        const [filas] = await pool.query(
            `SELECT * FROM INSCRIPCIONES WHERE escaneo_id = ?`,
            [escaneo_id]
        )
        return filas[0]
    },

    actualizarEstado: async (id, estado) => {
        const [resultado] = await pool.query(
            `UPDATE INSCRIPCIONES SET estado = ? WHERE id = ?`,
            [estado, id]
        )
        return resultado
    },

    listarTodas: async () => {
        const [filas] = await pool.query(
            `SELECT i.*, e.imagen_path, u.nombre_operador 
            FROM INSCRIPCIONES i
            JOIN ESCANEOS e ON i.escaneo_id = e.id
            JOIN USUARIOS u ON e.usuario_id = u.id
            ORDER BY i.fecha_inscripcion DESC`
        )
        return filas
    }

}

module.exports = Inscripcion