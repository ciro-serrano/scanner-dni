# 🛠️ Instructivo de instalación — Scanner DNI

Este instructivo te va a permitir clonar y correr el proyecto en tu propia PC.

---

## 1. Requisitos previos

Antes de empezar, asegurate de tener instalado:

- **XAMPP** → [apachefriends.org](https://www.apachefriends.org)
- **Node.js (LTS)** → [nodejs.org](https://nodejs.org)
- **Git** → [git-scm.com](https://git-scm.com)
- **VSCode** (recomendado) → [code.visualstudio.com](https://code.visualstudio.com)

Verificá que estén bien instalados corriendo esto en una terminal:

```cmd
node --version
npm --version
git --version
```

---

## 2. Aceptar la invitación al repositorio

1. Revisá tu email (o las notificaciones de GitHub).
2. Abrí la invitación a `scanner-dni` y hacé clic en **Accept invitation**.

---

## 3. Clonar el proyecto

Abrí la terminal en CMD, navegá hasta la carpeta `htdocs` de XAMPP y cloná el repositorio:

```cmd
cd C:\xampp\htdocs
git clone https://github.com/ciro-serrano/scanner-dni.git
cd scanner-dni
```

---

## 4. Instalar las dependencias

Dentro de la carpeta del proyecto, corré:

```cmd
npm install
```

Esto va a instalar automáticamente todas las librerías necesarias (Express, MySQL, bcrypt, etc.) según lo que indica `package.json`.

---

## 5. Crear tu propio archivo `.env`

Este archivo **no viene incluido** en el repositorio por seguridad. Tenés que crearlo a mano.

Dentro de la carpeta `scanner-dni`, creá un archivo nuevo llamado `.env` y pegá esto:

```env
# Servidor
PORT=3000

# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=scanner_dni

# JWT
JWT_SECRET=scanner_dni_2025_clave_secreta

# Claude API (no usada por ahora)
CLAUDE_API_KEY=pendiente

# Gemini API
GEMINI_API_KEY=PEGA_ACA_TU_PROPIA_CLAVE
```

### ¿Cómo consigo mi propia clave de Gemini?

1. Entrá a [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Iniciá sesión con tu cuenta de Google
3. Hacé clic en **Create API Key**
4. Copiá la clave y pegala en el `.env` donde dice `GEMINI_API_KEY`

Es gratuita, no pide tarjeta de crédito.

---

## 6. Arrancar XAMPP

1. Abrí el **XAMPP Control Panel**
2. Iniciá **Apache** y **MySQL** (tienen que quedar en verde)

---

## 7. Crear la base de datos

1. Entrá a `localhost/phpmyadmin` desde el navegador
2. Hacé clic en la pestaña **SQL**
3. Abrí el archivo `sql/estructura.sql` del proyecto, copiá todo su contenido y pegalo ahí
4. Ejecutá

Esto crea la base de datos `scanner_dni` con las 4 tablas necesarias.

---

## 8. Arrancar el servidor

Desde la terminal, dentro de la carpeta del proyecto:

```cmd
node server.js
```

Si todo salió bien vas a ver:

```
Servidor corriendo en http://localhost:3000
```

---

## 9. Crear tu usuario operador

1. Abrí el navegador en `http://localhost:3000/registro.html`
2. Completá tus datos y creá tu cuenta
3. Iniciá sesión en `http://localhost:3000/login.html`

---

## ✅ Listo

Ya deberías poder ver la pantalla principal y probar el escaneo de un DNI.

---

## Problemas comunes

| Problema | Solución |
|---|---|
| `git: command not found` | Reinstalá Git y reiniciá la terminal |
| Apache o MySQL no arrancan en XAMPP | Verificá que no haya otro programa usando los puertos 80 o 3306 |
| Error de conexión a la base de datos | Revisá que MySQL esté corriendo y que `DB_NAME` coincida con `scanner_dni` |
| Error 403 o 429 al escanear | Tu API key de Gemini puede estar mal copiada o sin habilitar — revisá en Google AI Studio |
| El navegador bloquea la cámara | Asegurate de estar en `localhost` (no en una IP) y aceptar los permisos de cámara |

---

Cualquier duda, consultenme directamente. 🙌