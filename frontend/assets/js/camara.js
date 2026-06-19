// ================================
// VARIABLES GLOBALES
// ================================
const camaraModal = document.getElementById('camaraModal')
const video = document.getElementById('video')
const canvas = document.getElementById('canvas')
const btnCapturar = document.getElementById('btnCapturar')
const btnCerrarCamara = document.getElementById('btnCerrarCamara')

const inputFrente = document.getElementById('inputFrente')
const inputDorso = document.getElementById('inputDorso')

const previewFrente = document.getElementById('previewFrente')
const previewDorso = document.getElementById('previewDorso')
const imgFrente = document.getElementById('imgFrente')
const imgDorso = document.getElementById('imgDorso')

const btnEscanear = document.getElementById('btnEscanear')

let streamActivo = null
let ladoActivo = null // 'frente' o 'dorso'

const archivos = {
    frente: null,
    dorso: null
}

// ================================
// ABRIR CÁMARA (botones con data-tipo="camara")
// ================================
document.querySelectorAll('[data-tipo="camara"]').forEach(btn => {
    btn.addEventListener('click', async () => {
        ladoActivo = btn.dataset.lado
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            })
            streamActivo = stream
            video.srcObject = stream
            camaraModal.style.display = 'flex'
        } catch (error) {
            alert('No se pudo acceder a la cámara. Verificá los permisos del navegador.')
        }
    })
})

// ================================
// CAPTURAR FOTO
// ================================
btnCapturar.addEventListener('click', () => {
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob((blob) => {
        const archivo = new File([blob], `dni_${ladoActivo}.jpg`, { type: 'image/jpeg' })
        guardarArchivo(ladoActivo, archivo)
        cerrarCamara()
    }, 'image/jpeg', 0.9)
})

// ================================
// CERRAR CÁMARA
// ================================
btnCerrarCamara.addEventListener('click', cerrarCamara)

function cerrarCamara() {
    if (streamActivo) {
        streamActivo.getTracks().forEach(track => track.stop())
        streamActivo = null
    }
    camaraModal.style.display = 'none'
    ladoActivo = null
}

// ================================
// SUBIR ARCHIVO (frente y dorso)
// ================================
inputFrente.addEventListener('change', (e) => {
    const archivo = e.target.files[0]
    if (archivo) guardarArchivo('frente', archivo)
})

inputDorso.addEventListener('change', (e) => {
    const archivo = e.target.files[0]
    if (archivo) guardarArchivo('dorso', archivo)
})

// ================================
// GUARDAR ARCHIVO Y MOSTRAR PREVIEW
// ================================
function guardarArchivo(lado, archivo) {
    archivos[lado] = archivo
    const url = URL.createObjectURL(archivo)

    if (lado === 'frente') {
        imgFrente.src = url
        previewFrente.style.display = 'flex'
    } else {
        imgDorso.src = url
        previewDorso.style.display = 'flex'
    }

    actualizarBotonEscanear()
}

// ================================
// QUITAR ARCHIVO
// ================================
document.querySelectorAll('.btn-quitar').forEach(btn => {
    btn.addEventListener('click', () => {
        const lado = btn.dataset.lado
        archivos[lado] = null

        if (lado === 'frente') {
            previewFrente.style.display = 'none'
            imgFrente.src = ''
            inputFrente.value = ''
        } else {
            previewDorso.style.display = 'none'
            imgDorso.src = ''
            inputDorso.value = ''
        }

        actualizarBotonEscanear()
    })
})

// ================================
// HABILITAR BOTÓN ESCANEAR SOLO SI HAY AL MENOS 1 IMAGEN
// ================================
function actualizarBotonEscanear() {
    btnEscanear.disabled = !archivos.frente && !archivos.dorso
}

// ================================
// FUNCIONES PARA FORMULARIO.JS
// ================================
const obtenerArchivos = () => archivos

const resetearCamara = () => {
    archivos.frente = null
    archivos.dorso = null
    previewFrente.style.display = 'none'
    previewDorso.style.display = 'none'
    imgFrente.src = ''
    imgDorso.src = ''
    inputFrente.value = ''
    inputDorso.value = ''
    actualizarBotonEscanear()
}