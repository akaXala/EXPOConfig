-- Insertamos los datos de prueba en Usuarios y en su tipo de Usuario
-- Profesor
INSERT INTO Usuario (Nombre, ApPaterno, ApMaterno, FechaNacimiento, Sexo, Telefono, Email, Contrasena)
VALUES ('Prueba', 'Prueba', '', '1990-01-01', 'Indefinido', '0123456789', 'pprueba1@profesor.expoconfig.mx', '$2b$10$ow9uOKyb0JZWAMdqQ39mPO0oLVK3kh7MFtDEPiD8KHDdhFkO1eXsm');
INSERT INTO Profesor (NoTrabajador) VALUES (1);

-- Organizador
INSERT INTO Usuario (Nombre, ApPaterno, ApMaterno, FechaNacimiento, Sexo, Telefono, Email, Contrasena)
VALUES ('Prueba', 'Prueba', '', '1990-01-01', 'Indefinido', '0123456789', 'pprueba2@organizador.expoconfig.mx', '$2b$10$SDw19AgYVwBlhvLTuzDMiO.mIwxc1g60RO1bcOZbrVL4UBEBn7Vlq');
INSERT INTO Organizador (NoTrabajador) VALUES (2);

-- Impresiones
INSERT INTO Usuario (Nombre, ApPaterno, ApMaterno, FechaNacimiento, Sexo, Telefono, Email, Contrasena)
VALUES ('Prueba', 'Prueba', '', '1990-01-01', 'Indefinido', '0123456789', 'pprueba3@impresiones.expoconfig.mx', '$2b$10$GNMp3yGIVaLBzn9yC9ZQqudAnpJjTopqi6JJkumXTfpLhSQs6.JdS');
INSERT INTO Impresiones (NoTrabajador) VALUES (3);

-- Administrador
INSERT INTO Usuario (Nombre, ApPaterno, ApMaterno, FechaNacimiento, Sexo, Telefono, Email, Contrasena)
VALUES ('Prueba', 'Prueba', '', '1990-01-01', 'Indefinido', '0123456789', 'pprueba4@administrador.expoconfig.mx', '$2b$10$Y1SgrwuWBcrury20hM0tOeBc4xz6xJAds3uxS.PzT513fTV3a4OsO');
INSERT INTO Administrador (NoTrabajador) VALUES (4);

-- Mas profesores
INSERT INTO Usuario (Nombre, ApPaterno, ApMaterno, FechaNacimiento, Sexo, Telefono, Email, Contrasena)
VALUES 
('Laura', 'González', 'Ramírez', '1985-07-15', 'Femenino', '5512345678', 'lgonzalez@profesor.expoconfig.mx', '$2b$10$ow9uOKyb0JZWAMdqQ39mPO0oLVK3kh7MFtDEPiD8KHDdhFkO1eXsm'),
('Carlos', 'Martínez', 'López', '1978-11-02', 'Masculino', '5523456789', 'cmartinez@profesor.expoconfig.mx', '$2b$10$ow9uOKyb0JZWAMdqQ39mPO0oLVK3kh7MFtDEPiD8KHDdhFkO1eXsm'),
('Ana', 'Hernández', 'Soto', '1992-03-21', 'Femenino', '5534567890', 'ahernandez@profesor.expoconfig.mx', '$2b$10$ow9uOKyb0JZWAMdqQ39mPO0oLVK3kh7MFtDEPiD8KHDdhFkO1eXsm'),
('Javier', 'Rodríguez', 'Mejía', '1980-09-10', 'Masculino', '5545678901', 'jrodriguez@profesor.expoconfig.mx', '$2b$10$ow9uOKyb0JZWAMdqQ39mPO0oLVK3kh7MFtDEPiD8KHDdhFkO1eXsm'),
('Sofía', 'Vargas', 'Delgado', '1995-12-05', 'Femenino', '5556789012', 'svargas@profesor.expoconfig.mx', '$2b$10$ow9uOKyb0JZWAMdqQ39mPO0oLVK3kh7MFtDEPiD8KHDdhFkO1eXsm'),
('Miguel', 'López', 'García', '1988-04-23', 'Masculino', '5567890123', 'mlopez@profesor.expoconfig.mx', '$2b$10$ow9uOKyb0JZWAMdqQ39mPO0oLVK3kh7MFtDEPiD8KHDdhFkO1eXsm');

INSERT INTO Profesor (NoTrabajador) 
VALUES
(5), 
(6),
(7),
(8),
(9),
(10);


-- Estudiante
INSERT INTO Estudiante (NoBoleta, Nombre, ApPaterno, ApMaterno, Carrera)
VALUES 
('2023014589', 'Valeria Fernanda', 'Ramírez', 'Gómez', 'Inteligencia Artificial'),
('2023147852', 'Luis Ángel', 'Hernández', 'Sánchez', 'Ciencia de Datos'),
('2023258943', 'María José', 'Pérez', 'Rodríguez', 'Sistemas Computacionales'),
('2023098417', 'José Antonio', 'Martínez', 'Luna', 'Inteligencia Artificial'),
('2023670192', 'Ana Sofía', 'García', 'Hernández', 'Ciencia de Datos'),
('2023117095', 'Daniela Itzel', 'Flores', 'Vega', 'Sistemas Computacionales'),
('2023580274', 'Jorge Luis', 'Morales', 'Castillo', 'Inteligencia Artificial'),
('2023661297', 'Santiago', 'Ortega', 'Ruiz', 'Ciencia de Datos'),
('2023401956', 'Camila', 'Reyes', 'Mendoza', 'Sistemas Computacionales'),
('2023770235', 'Emiliano', 'Cruz', 'Domínguez', 'Inteligencia Artificial');

--Proyectos
INSERT INTO Proyecto (Nombre, UA, Grupo, Academia, Descripcion, Cartel)
VALUES 
('Sistema de Gestión Escolar', 'Ingenieria de Software', '3BM5', 'Computacion', 'Aplicación web para administrar datos escolares.', 'https://carteles.com/sge01'),
('Análisis de Series Temporales', 'Matemáticas Avanzadas', '5AV9', 'Basicas', 'Proyecto de análisis estadístico de datos históricos.', 'https://carteles.com/ast02'),
('App de Finanzas Personales', 'FEPI', '2CM3', 'Computacion', 'Aplicación móvil para control de gastos e ingresos.', 'https://carteles.com/afp03'),
('Detector de Fugas de Gas', 'MCTD', '6BV11', 'Electronica', 'Sistema IoT para detección temprana de fugas de gas.', 'https://carteles.com/dfg04'),
('Sitio Web de Recetas Saludables', 'WEB', '1AM7', 'Computacion', 'Página interactiva con recetas personalizadas.', 'https://carteles.com/swr05'),
('Sistema de Riego Automatizado', 'MCTD', '4CV12', 'Electronica', 'Control automático de riego según humedad del suelo.', 'https://carteles.com/sra06'),
('Algoritmo de Reconocimiento Facial', 'Ingenieria de Software', '7BV4', 'Computacion', 'Software de seguridad con reconocimiento facial.', 'https://carteles.com/arf07'),
('Simulador de Redes Neuronales', 'Matemáticas Avanzadas', '8AM8', 'Basicas', 'Simulación visual de modelos neuronales simples.', 'https://carteles.com/srn08'),
('Sistema de Inventario', 'FEPI', '2CV2', 'Computacion', 'Gestión de inventarios con control por código QR.', 'https://carteles.com/sdi09'),
('Controlador de Semáforos Inteligente', 'MCTD', '3BM14', 'Electronica', 'Sistema adaptativo para control de tráfico.', 'https://carteles.com/csi10'),
('Marketplace de Artesanías', 'WEB', '6AV10', 'Computacion', 'Tienda en línea para venta de productos artesanales.', 'https://carteles.com/mda11'),
('Asistente de Estudio con IA', 'Ingenieria de Software', '5CV6', 'Computacion', 'Aplicación con chatbot para ayuda académica.', 'https://carteles.com/aei12'),
('Simulador de Cálculo Numérico', 'Matemáticas Avanzadas', '1BV1', 'Basicas', 'Herramienta interactiva para resolver ecuaciones.', 'https://carteles.com/scn13'),
('Gestión de Consultas Médicas', 'FEPI', '4AM0', 'Computacion', 'Sistema web para control de pacientes y citas.', 'https://carteles.com/gcm14'),
('Sensor de Movimiento Inteligente', 'MCTD', '7AV13', 'Electronica', 'Dispositivo que detecta movimiento y alerta.', 'https://carteles.com/smi15'),
('Plataforma de Blogs Personales', 'WEB', '8CM5', 'Computacion', 'Sitio donde usuarios pueden crear y compartir blogs.', 'https://carteles.com/pbp16'),
('Gestión de Tareas Escolares', 'Ingenieria de Software', '3BV3', 'Computacion', 'Aplicación para asignar y entregar tareas escolares.', 'https://carteles.com/gte17'),
('Modelado de Datos Estadísticos', 'Matemáticas Avanzadas', '6AM6', 'Basicas', 'Análisis y visualización de datos numéricos.', 'https://carteles.com/mde18'),
('Automatización de Invernaderos', 'MCTD', '1CV13', 'Electronica', 'Control automático de clima y humedad.', 'https://carteles.com/adi19'),
('Portfolio Profesional Web', 'WEB', '2BV2', 'Computacion', 'Sitio web para mostrar portafolio profesional.', 'https://carteles.com/ppw20');

--EsTutor <relacion>
INSERT INTO estutor (noproyecto, notrabajador)
VALUES 
  (1, 1), (2, 1), (3, 1), (4, 1), (5, 1),
  (6, 1), (7, 1), (8, 1), (9, 1), (10, 1),
  (11, 1), (12, 1), (13, 1), (14, 1), (15, 1),
  (16, 1), (17, 1), (18, 1), (19, 1), (20, 1);

--ParticipaEstudiante <relacion>
INSERT INTO ParticipaEstudiante (NoBoleta, NoProyecto)
VALUES 
('2023147852', 1), ('2023661297', 2), ('2023098417', 3), ('2023258943', 4), ('2023014589', 5),
('2023770235', 6), ('2023661297', 7), ('2023117095', 8), ('2023401956', 9), ('2023580274', 10),
('2023147852', 11), ('2023258943', 12), ('2023014589', 13), ('2023661297', 14), ('2023098417', 15),
('2023117095', 16), ('2023401956', 17), ('2023580274', 18), ('2023147852', 19), ('2023770235', 20),
('2023147852', 20), ('2023661297', 19), ('2023098417', 18), ('2023258943', 17), ('2023014589', 16),
('2023770235', 15), ('2023661297', 1), ('2023117095', 13), ('2023401956', 12), ('2023580274', 11),
('2023147852', 10), ('2023258943', 9), ('2023014589', 8), ('2023661297', 9), ('2023098417', 6),
('2023117095', 5), ('2023401956', 4), ('2023580274', 3), ('2023147852', 2), ('2023770235', 1);

INSERT INTO Asistente (NombreCompleto, Correo, Edad, Procedencia) VALUES
('Luis Hernández', 'lhernandez@example.com', 25, 'Escom'),
('María Torres', 'mtorres@example.com', 30, 'CECYT 3'),
('Carlos Ramírez', 'cramirez@example.com', 22, 'familiares'),
('Ana López', 'alopez@example.com', 28, 'Upiita'),
('Jorge Martínez', 'jmartinez@example.com', 35, 'amigos'),
('Laura Sánchez', 'lsanchez@example.com', 24, 'Escom'),
('Pedro Gómez', 'pgomez@example.com', 29, 'CECYT 3'),
('Sofía Díaz', 'sdiaz@example.com', 27, 'amigos'),
('Daniel Fernández', 'dfernandez@example.com', 31, 'familiares'),
('Valeria Cruz', 'vcruz@example.com', 26, 'Upiita');
