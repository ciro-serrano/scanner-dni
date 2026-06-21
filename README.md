# 📄 Scanner DNI

Sistema de escaneo de DNI con IA para autocompletar fichas de inscripción.

## ¿Qué hace?

Permite capturar el frente y dorso de un DNI argentino (por cámara o archivo subido), analiza la imagen con la API de Gemini, y autocompleta automáticamente un formulario de inscripción con los datos extraídos.

## Stack

- **Backend:** Node.js + Express
- **Base de datos:** MySQL (vía XAMPP)
- **IA:** Gemini API (Google AI Studio)
- **Frontend:** HTML + CSS + JavaScript vanilla
- **Seguridad:** bcrypt, JWT, Helmet, CORS, rate limiting

## Instalación

Ver el instructivo completo en [`instructivo-setup-scanner-dni.md`](./instructivo-setup-scanner-dni.md).

Resumen rápido:

```bash
git clone https://github.com/ciro-serrano/scanner-dni.git
cd scanner-dni
npm install
```

Después crear tu propio `.env`, generar tu API key de Gemini, correr `sql/estructura.sql` en phpMyAdmin, y arrancar con:

```bash
node server.js
```

## Estructura del proyecto
config/        → conexión a MySQL y a Gemini API

controllers/   → lógica de negocio

models/        → queries a la base de datos

routes/        → endpoints de la API

middleware/    → autenticación, rate limiting, subida de archivos

frontend/      → HTML, CSS y JS del cliente

sql/           → script de creación de la base de datos

