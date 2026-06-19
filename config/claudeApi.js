require('dotenv').config()

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_MODEL = 'gemini-2.5-flash'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`

const analizarDNI = async (imagenes) => {
    // Armar la parte de texto (el prompt)
    const promptTexto = {
        text: `Analizá estas imágenes de un DNI argentino (puede ser frente, dorso, o ambos) y devolveme ÚNICAMENTE un objeto JSON sin texto adicional, sin backticks, sin explicaciones. El JSON debe tener exactamente esta estructura:
{
    "nombre": "",
    "apellido": "",
    "dni_numero": "",
    "fecha_nacimiento": "",
    "sexo": "",
    "domicilio": "",
    "cuil": ""
}
Combiná la información de todas las imágenes que recibas. Si no podés leer algún campo con certeza, dejalo como string vacío.`
    }

    // Armar una parte por cada imagen recibida
    const partesImagenes = imagenes.map((img) => ({
        inline_data: {
            mime_type: img.mimeType,
            data: img.base64
        }
    }))

    // El array final: primero el texto, después todas las imágenes
    const parts = [promptTexto, ...partesImagenes]

    const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: parts
                }
            ]
        })
    })

    const data = await response.json()
    //console.log('RESPUESTA DE GEMINI:', JSON.stringify(data, null, 2))

    const texto = data.candidates[0].content.parts[0].text.trim()
    const textoLimpio = texto.replace(/```json|```/g, '').trim()
    const datosExtraidos = JSON.parse(textoLimpio)

    return datosExtraidos
}

module.exports = { analizarDNI }