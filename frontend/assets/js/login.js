const form = document.getElementById('loginForm')
const errorMsg = document.getElementById('errorMsg')
const btnLogin = document.getElementById('btnLogin')

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    errorMsg.style.display = 'none'
    btnLogin.textContent = 'Ingresando...'
    btnLogin.disabled = true

    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        const data = await response.json()

        if (response.status === 200) {
            localStorage.setItem('token', data.token)
            localStorage.setItem('operador', JSON.stringify(data.usuario))
            window.location.href = '/index.html'
        } else {
            errorMsg.style.display = 'block'
            btnLogin.textContent = 'Ingresar'
            btnLogin.disabled = false
        }

    } catch (error) {
        errorMsg.textContent = 'Error de conexión, intentá de nuevo'
        errorMsg.style.display = 'block'
        btnLogin.textContent = 'Ingresar'
        btnLogin.disabled = false
    }
})