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
  Nombre INT NOT NULL,
  ApPaterno INT NOT NULL,
  ApMaterno INT,
  Contrasena INT NOT NULL
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
