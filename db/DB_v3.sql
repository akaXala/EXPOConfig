CREATE TABLE Estudiante (
  NoBoleta VARCHAR(10) NOT NULL,
  Nombre VARCHAR(75) NOT NULL,
  ApPaterno VARCHAR(50) NOT NULL,
  ApMaterno VARCHAR(50),
  Carrera VARCHAR(100) NOT NULL,
  PRIMARY KEY (NoBoleta)
);

CREATE TABLE Asistente (
  NoBoleta VARCHAR(10) NOT NULL,
  NombreCompleto VARCHAR(100) NOT NULL,
  Correo VARCHAR(100) NOT NULL,
  Edad INT NOT NULL,
  Procedencia VARCHAR(100) NOT NULL,
  PRIMARY KEY (NoBoleta)
);

CREATE TABLE Proyecto (
  NoProyecto SERIAL PRIMARY KEY,
  Nombre VARCHAR(200) NOT NULL,
  UA VARCHAR(100) NOT NULL,
  Grupo VARCHAR(10) NOT NULL,
  Academia VARCHAR(100) NOT NULL,
  Descripcion VARCHAR(500) NOT NULL,
  Cartel VARCHAR(200) NOT NULL
);

CREATE TABLE Stand (
  NoStand SERIAL PRIMARY KEY,
  Ubicacion VARCHAR(100) NOT NULL,
  Salon INT,
  Capacidad INT,
  NoProyecto INT NOT NULL,
  FOREIGN KEY (NoProyecto) REFERENCES Proyecto(NoProyecto)
);

CREATE TABLE Agenda (
  IdAgenda SERIAL PRIMARY KEY,
  FechaIncio DATE NOT NULL,
  FechaFin DATE NOT NULL
);

CREATE TABLE Usuario (
  NoTrabajador SERIAL PRIMARY KEY,
  Nombre VARCHAR(75) NOT NULL,
  ApPaterno VARCHAR(75) NOT NULL,
  ApMaterno VARCHAR(75),
  FechaNacimiento DATE NOT NULL,
  Sexo VARCHAR(20) NOT NULL,
  Telefono VARCHAR(10) NOT NULL,
  Email VARCHAR(100) NOT NULL,
  Contrasena VARCHAR(200) NOT NULL
);

CREATE TABLE Impresiones (
  NoTrabajador INT NOT NULL,
  PRIMARY KEY (NoTrabajador),
  FOREIGN KEY (NoTrabajador) REFERENCES Usuario(NoTrabajador)
);

CREATE TABLE Organizador (
  NoTrabajador INT NOT NULL,
  PRIMARY KEY (NoTrabajador),
  FOREIGN KEY (NoTrabajador) REFERENCES Usuario(NoTrabajador)
);

CREATE TABLE Profesor (
  NoTrabajador INT NOT NULL,
  PRIMARY KEY (NoTrabajador),
  FOREIGN KEY (NoTrabajador) REFERENCES Usuario(NoTrabajador)
);

CREATE TABLE Administrador (
  NoTrabajador INT NOT NULL,
  PRIMARY KEY (NoTrabajador),
  FOREIGN KEY (NoTrabajador) REFERENCES Usuario(NoTrabajador)
);

CREATE TABLE Evaluador (
  Area VARCHAR(100) NOT NULL,
  NoTrabajador INT NOT NULL,
  PRIMARY KEY (NoTrabajador),
  FOREIGN KEY (NoTrabajador) REFERENCES Profesor(NoTrabajador)
);

CREATE TABLE Tutor (
  Materia INT NOT NULL,
  NoTrabajador INT NOT NULL,
  PRIMARY KEY (NoTrabajador),
  FOREIGN KEY (NoTrabajador) REFERENCES Profesor(NoTrabajador)
);

CREATE TABLE Expositor (
  IdExpositor SERIAL PRIMARY KEY,
  Nombre VARCHAR(75) NOT NULL,
  ApPaterno VARCHAR(50) NOT NULL,
  ApMaterno VARCHAR(50),
  Procedencia VARCHAR(100) NOT NULL
);

CREATE TABLE ParticipaEstudiante (
  NoBoleta VARCHAR(10) NOT NULL,
  NoProyecto INT NOT NULL,
  PRIMARY KEY (NoBoleta, NoProyecto),
  FOREIGN KEY (NoBoleta) REFERENCES Estudiante(NoBoleta),
  FOREIGN KEY (NoProyecto) REFERENCES Proyecto(NoProyecto)
);

CREATE TABLE VisitaProyecto (
  NoBoleta VARCHAR(10) NOT NULL,
  NoProyecto INT NOT NULL,
  PRIMARY KEY (NoBoleta, NoProyecto),
  FOREIGN KEY (NoBoleta) REFERENCES Asistente(NoBoleta),
  FOREIGN KEY (NoProyecto) REFERENCES Proyecto(NoProyecto)
);

CREATE TABLE ParticipaTutor (
  NoProyecto INT NOT NULL,
  NoTrabajador INT NOT NULL,
  PRIMARY KEY (NoProyecto, NoTrabajador),
  FOREIGN KEY (NoProyecto) REFERENCES Proyecto(NoProyecto),
  FOREIGN KEY (NoTrabajador) REFERENCES Tutor(NoTrabajador)
);

CREATE TABLE Evalua (
  NoProyecto INT NOT NULL,
  NoTrabajador INT NOT NULL,
  PRIMARY KEY (NoProyecto, NoTrabajador),
  FOREIGN KEY (NoProyecto) REFERENCES Proyecto(NoProyecto),
  FOREIGN KEY (NoTrabajador) REFERENCES Evaluador(NoTrabajador)
);

CREATE TABLE Evento (
  NombreEvento VARCHAR(100) NOT NULL,
  HorarioInicio DATE NOT NULL,
  HorarioFin DATE NOT NULL,
  Tipo VARCHAR(50) NOT NULL,
  Descripcion VARCHAR(500) NOT NULL,
  Fecha DATE NOT NULL,
  IdEvento SERIAL PRIMARY KEY,
  IdAgenda INT NOT NULL,
  FOREIGN KEY (IdAgenda) REFERENCES Agenda(IdAgenda)
);

CREATE TABLE Expone (
  IdEvento INT NOT NULL,
  IdExpositor INT NOT NULL,
  PRIMARY KEY (IdEvento, IdExpositor),
  FOREIGN KEY (IdEvento) REFERENCES Evento(IdEvento),
  FOREIGN KEY (IdExpositor) REFERENCES Expositor(IdExpositor)
);

CREATE TABLE VisitaEvento (
  NoBoleta VARCHAR(10) NOT NULL,
  IdEvento INT NOT NULL,
  PRIMARY KEY (NoBoleta, IdEvento),
  FOREIGN KEY (NoBoleta) REFERENCES Asistente(NoBoleta),
  FOREIGN KEY (IdEvento) REFERENCES Evento(IdEvento)
);

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

-- Estudiante
INSERT INTO Estudiante (NoBoleta, Nombre, ApPaterno, ApMaterno, Carrera)
VALUES ('1234567890', 'Prueba', 'Prueba', '', 'ISC');
INSERT INTO Estudiante (NoBoleta, Nombre, ApPaterno, ApMaterno, Carrera)
VALUES ('1234567893', 'Prueba2', 'Prueba2', 'P2', 'LC');

--Proyecto
INSERT INTO Proyecto (Nombre, UA, Grupo, Academia, Descripcion, Cartel)
VALUES ('Proyecto de Prueba', 'UA de Prueba', '5CM1', 'Academia de Prueba', 'Descripcion de prueba', 'Cartel de prueba');
INSERT INTO Proyecto (Nombre, UA, Grupo, Academia, Descripcion, Cartel)
VALUES ('Proyecto de Prueba2', 'UA de Prueba2', '1BM2', 'Academia de Prueba2', 'Descripcion de prueba2', 'Cartel de 2');
INSERT INTO Proyecto (Nombre, UA, Grupo, Academia, Descripcion, Cartel)
VALUES ('Proyecto de Prueba3', 'UA de Prueba3', '1AI3', 'Academia de Prueba3', 'Descripcion de prueba3', 'Cartel de 3');

-- Tutor
INSERT INTO Tutor (Materia, NoTrabajador)
VALUES (1, 1);

-- Tutor x Proyecto
INSERT INTO ParticipaTutor (NoTrabajador, NoProyecto)
VALUES (1, 1);
INSERT INTO ParticipaTutor (NoTrabajador, NoProyecto)
VALUES (1, 2);


-- Estudiante x Proyecto
INSERT INTO ParticipaEstudiante (NoBoleta, NoProyecto)
VALUES ('1234567890', 2);
INSERT INTO ParticipaEstudiante (NoBoleta, NoProyecto)
VALUES ('1234567890', 1);
INSERT INTO ParticipaEstudiante (NoBoleta, NoProyecto)
VALUES ('1234567893', 3);


-- Creacion de vistas para logins
CREATE VIEW proflogin AS
SELECT u.notrabajador, u.email, u.contrasena
FROM usuario u
INNER JOIN profesor p ON u.notrabajador = p.notrabajador;

CREATE VIEW orglogin AS
SELECT u.notrabajador, u.email, u.contrasena
FROM usuario u
INNER JOIN organizador o ON u.notrabajador = o.notrabajador;

CREATE VIEW imprlogin AS
SELECT u.notrabajador, u.email, u.contrasena
FROM usuario u
INNER JOIN impresiones i ON u.notrabajador = i.notrabajador;

CREATE VIEW adminlogin AS
SELECT u.notrabajador, u.email, u.contrasena
FROM usuario u
INNER JOIN administrador a ON u.notrabajador = a.notrabajador;
 
CREATE VIEW dashboardproyectoview AS
SELECT e.nombre || e.appaterno || e.apmaterno AS estudiante, 
pr.noproyecto as idproyecto, pr.nombre AS nombre_proyecto, pr.ua,  pr.grupo, pr.academia,
u.nombre || u.appaterno  || u.apmaterno AS profesor
FROM estudiante e
INNER JOIN participaestudiante pe ON e.noboleta = pe.noboleta
INNER JOIN proyecto pr ON pe.noproyecto = pr.noproyecto
INNER JOIN participatutor tp ON pr.noproyecto = tp.noproyecto
INNER JOIN tutor t ON tp.notrabajador = t.notrabajador
INNER JOIN profesor prof ON tp.notrabajador = prof.notrabajador
INNER JOIN usuario u ON tp.notrabajador = u.notrabajador;