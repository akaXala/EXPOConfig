CREATE TABLE Estudiante (
  NoBoleta VARCHAR(10) NOT NULL,
  Nombre VARCHAR(75) NOT NULL,
  ApPaterno VARCHAR(50) NOT NULL,
  ApMaterno VARCHAR(50),
  Carrera VARCHAR(100) NOT NULL,
  PRIMARY KEY (NoBoleta)
);

CREATE TABLE Asistente (
  IdAsistente SERIAL,
  NombreCompleto VARCHAR(100) NOT NULL,
  Correo VARCHAR(100) NOT NULL,
  Edad INT NOT NULL,
  Procedencia VARCHAR(100) NOT NULL,
  PRIMARY KEY (IdAsistente)
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
  Evaluador BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (NoTrabajador),
  FOREIGN KEY (NoTrabajador) REFERENCES Usuario(NoTrabajador)
);

CREATE TABLE Administrador (
  NoTrabajador INT NOT NULL,
  PRIMARY KEY (NoTrabajador),
  FOREIGN KEY (NoTrabajador) REFERENCES Usuario(NoTrabajador)
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
  IdAsistente INT NOT NULL,
  NoProyecto INT NOT NULL,
  Observaciones VARCHAR(500) NULL,
  Satisfaccion INT NOT NULL,
  PRIMARY KEY (IdAsistente, NoProyecto),
  FOREIGN KEY (IdAsistente) REFERENCES Asistente(IdAsistente),
  FOREIGN KEY (NoProyecto) REFERENCES Proyecto(NoProyecto)
);

CREATE TABLE EsTutor (
  NoProyecto INT NOT NULL,
  NoTrabajador INT NOT NULL,
  PRIMARY KEY (NoProyecto, NoTrabajador),
  FOREIGN KEY (NoProyecto) REFERENCES Proyecto(NoProyecto),
  FOREIGN KEY (NoTrabajador) REFERENCES Profesor(NoTrabajador)
);

CREATE TABLE Evalua (
  NoProyecto INT NOT NULL,
  NoTrabajador INT NOT NULL,
  Calificacion INT NULL,
  PRIMARY KEY (NoProyecto, NoTrabajador),
  FOREIGN KEY (NoProyecto) REFERENCES Proyecto(NoProyecto),
  FOREIGN KEY (NoTrabajador) REFERENCES Profesor(NoTrabajador)
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
  IdAsistente INT NOT NULL,
  IdEvento INT NOT NULL,
  Observaciones VARCHAR(500) NULL,
  Satisfaccion INT NOT NULL,
  PRIMARY KEY (IdAsistente, IdEvento),
  FOREIGN KEY (IdAsistente) REFERENCES Asistente(IdAsistente),
  FOREIGN KEY (IdEvento) REFERENCES Evento(IdEvento)
);