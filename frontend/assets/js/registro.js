const form = document.getElementById('registroForm')
const errorMsg = document.getElementById('errorMsg')
const successMsg = document.getElementById('successMsg')
const btnRegistro = document.getElementById('btnRegistro')

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    errorMsg.style.display = 'none'
    successMsg.style.display = 'none'
    btnRegistro.textContent = 'Creando cuenta...'
    btnRegistro.disabled = true

    const nombre_operador = document.getElementById('nombre_operador').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    try {
        const response = await fetch('/api/auth/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre_operador, email, password })
        })

        const data = await response.json()

        if (response.status === 201) {
            successMsg.textContent = 'Cuenta creada correctamente. Redirigiendo al login...'
            successMsg.style.display = 'block'
            form.reset()

            setTimeout(() => {
                window.location.href = '/login.html'
            }, 2000)

        } else {
            errorMsg.textContent = data.error || 'Error al crear la cuenta'
            errorMsg.style.display = 'block'
            btnRegistro.textContent = 'Crear cuenta'
            btnRegistro.disabled = false
        }

    } catch (error) {
        errorMsg.textContent = 'Error de conexión, intentá de nuevo'
        errorMsg.style.display = 'block'
        btnRegistro.textContent = 'Crear cuenta'
        btnRegistro.disabled = false
    }
})