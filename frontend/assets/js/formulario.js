// ================================
// VARIABLES GLOBALES
// ================================

const btnCancelar = document.getElementById('btnCancelar')
const btnConfirmar = document.getElementById('btnConfirmar')
const btnNuevoEscaneo = document.getElementById('btnNuevoEscaneo')
const btnLogout = document.getElementById('btnLogout')
const formInscripcion = document.getElementById('formInscripcion')
const seccionEscaneo = document.getElementById('seccionEscaneo')
const seccionFormulario = document.getElementById('seccionFormulario')
const seccionExito = document.getElementById('seccionExito')
const loading = document.getElementById('loading')
const nombreOperador = document.getElementById('nombreOperador')

// ================================
// INICIALIZACIÓN
// ================================
const init = () => {
    // Verificar que el operador esté autenticado
    const token = localStorage.getItem('token')
    if (!token) {
        window.location.href = '/login.html'
        return
    }

    // Mostrar nombre del operador en el navbar
    const operador = JSON.parse(localStorage.getItem('operador'))
    if (operador) {
        nombreOperador.textContent = `👤 ${operador.nombre_operador}`
    }
}

// ================================
// OBTENER TOKEN
// ================================
const getToken = () => localStorage.getItem('token')

// ================================
// ESCANEAR DNI
// ================================
btnEscanear.addEventListener('click', async () => {
    const { frente, dorso } = obtenerArchivos()

    if (!frente && !dorso) {
        alert('Primero capturá o subí al menos una imagen del DNI')
        return
    }

    // Mostrar loading
    loading.style.display = 'flex'
    btnEscanear.disabled = true

    try {
        // Armar el FormData con ambos archivos (si existen)
        const formData = new FormData()
        if (frente) formData.append('frente', frente)
        if (dorso) formData.append('dorso', dorso)

        // Enviar al backend
        const response = await fetch('/api/escaneo', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            body: formData
        })

        const data = await response.json()

        if (response.status === 200) {
            // Autocompletar el formulario con los datos extraídos
            autocompletar(data.escaneo_id, data.datos)

            // Mostrar sección formulario
            loading.style.display = 'none'
            seccionFormulario.style.display = 'block'
            seccionFormulario.scrollIntoView({ behavior: 'smooth' })

        } else {
            loading.style.display = 'none'
            btnEscanear.disabled = false
            alert('Error al escanear el DNI: ' + data.error)
        }

    } catch (error) {
        loading.style.display = 'none'
        btnEscanear.disabled = false
        alert('Error de conexión, intentá de nuevo')
    }
})

// ================================
// AUTOCOMPLETAR FORMULARIO
// ================================
const autocompletar = (escaneo_id, datos) => {
    document.getElementById('escaneo_id').value = escaneo_id
    document.getElementById('nombre').value = datos.nombre || ''
    document.getElementById('apellido').value = datos.apellido || ''
    document.getElementById('dni_numero').value = datos.dni_numero || ''
    document.getElementById('sexo').value = datos.sexo || ''
    document.getElementById('domicilio').value = datos.domicilio || ''
    document.getElementById('cuil').value = datos.cuil || ''

    // Formatear fecha para input type="date" → YYYY-MM-DD
    if (datos.fecha_nacimiento) {
        const fecha = formatearFecha(datos.fecha_nacimiento)
        document.getElementById('fecha_nacimiento').value = fecha
    }
}

// ================================
// FORMATEAR FECHA
// ================================
const formatearFecha = (fechaStr) => {
    // El DNI argentino tiene formato DD/MM/YYYY
    // El input type="date" necesita YYYY-MM-DD
    if (!fechaStr) return ''

    const partes = fechaStr.split('/')
    if (partes.length === 3) {
        return `${partes[2]}-${partes[1]}-${partes[0]}`
    }
    return fechaStr
}

// ================================
// CONFIRMAR INSCRIPCIÓN
// ================================
formInscripcion.addEventListener('submit', async (e) => {
    e.preventDefault()
    btnConfirmar.disabled = true
    btnConfirmar.textContent = 'Guardando...'

    const datos = {
        escaneo_id: document.getElementById('escaneo_id').value,
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        dni_numero: document.getElementById('dni_numero').value,
        fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
        sexo: document.getElementById('sexo').value,
        domicilio: document.getElementById('domicilio').value,
        cuil: document.getElementById('cuil').value
    }

    try {
        const response = await fetch('/api/inscripcion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(datos)
        })

        const data = await response.json()

        if (response.status === 201) {
            // Mostrar sección éxito
            seccionFormulario.style.display = 'none'
            seccionExito.style.display = 'block'
            seccionExito.scrollIntoView({ behavior: 'smooth' })
        } else {
            alert('Error al guardar la inscripción: ' + data.error)
            btnConfirmar.disabled = false
            btnConfirmar.textContent = '✅ Confirmar inscripción'
        }

    } catch (error) {
        alert('Error de conexión, intentá de nuevo')
        btnConfirmar.disabled = false
        btnConfirmar.textContent = '✅ Confirmar inscripción'
    }
})

// ================================
// CANCELAR
// ================================
btnCancelar.addEventListener('click', () => {
    seccionFormulario.style.display = 'none'
    resetearCamara()
    btnEscanear.disabled = false
})

// ================================
// NUEVO ESCANEO
// ================================
btnNuevoEscaneo.addEventListener('click', () => {
    seccionExito.style.display = 'none'
    seccionFormulario.style.display = 'none'
    resetearCamara()
    btnEscanear.disabled = false
    btnConfirmar.disabled = false
    btnConfirmar.textContent = '✅ Confirmar inscripción'
    formInscripcion.reset()
})

// ================================
// LOGOUT
// ================================
btnLogout.addEventListener('click', () => {
    localStorage.removeItem('token')
    localStorage.removeItem('operador')
    window.location.href = '/login.html'
})

// ================================
// ARRANCAR
// ================================
init()