
-- CREAR BASE DE DATOS

CREATE DATABASE scanner_dni
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE scanner_dni;


-- TABLA: USUARIOS
-- Operadores que usan el sistema

CREATE TABLE USUARIOS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_operador VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: ESCANEOS
-- Registro de cada DNI escaneado

CREATE TABLE ESCANEOS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    imagen_path VARCHAR(255),
    raw_text TEXT,
    fecha_escaneo DATETIME DEFAULT CURRENT_TIMESTAMP,
    procesado TINYINT(1) DEFAULT 0,
    FOREIGN KEY (usuario_id) REFERENCES USUARIOS(id)
);


-- TABLA: INSCRIPCIONES
-- Formulario confirmado con datos del DNI

CREATE TABLE INSCRIPCIONES (
    id INT AUTO_INCREMENT PRIMARY KEY,
    escaneo_id INT NOT NULL,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    dni_numero VARCHAR(20),
    fecha_nacimiento DATE,
    sexo VARCHAR(10),
    domicilio VARCHAR(255),
    cuil VARCHAR(20),
    fecha_inscripcion DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'confirmada', 'cancelada') DEFAULT 'pendiente',
    FOREIGN KEY (escaneo_id) REFERENCES ESCANEOS(id)
);


-- TABLA: HISTORIAL_ESCANEOS
-- Bitácora de eventos por cada escaneo

CREATE TABLE HISTORIAL_ESCANEOS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    escaneo_id INT NOT NULL,
    accion VARCHAR(100) NOT NULL,
    detalle TEXT,
    registrado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (escaneo_id) REFERENCES ESCANEOS(id)
);