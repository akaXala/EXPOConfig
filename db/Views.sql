
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

-- View of dashboard for projects
CREATE VIEW dashboardproyectoview AS
SELECT 
  pr.noproyecto AS idproyecto,
  STRING_AGG(DISTINCT e.nombre || ' ' || e.appaterno || ' ' || e.apmaterno, ', ') AS estudiante,
  pr.nombre AS nombre_proyecto,
  pr.ua,
  pr.grupo,
  pr.academia,
  STRING_AGG(DISTINCT u.nombre || ' ' || u.appaterno || ' ' || u.apmaterno, ', ') AS profesor
FROM proyecto pr
INNER JOIN participaestudiante pe ON pr.noproyecto = pe.noproyecto
INNER JOIN estudiante e ON pe.noboleta = e.noboleta
INNER JOIN estutor es ON pr.noproyecto = es.noproyecto
INNER JOIN profesor prof ON es.notrabajador = prof.notrabajador
INNER JOIN usuario u ON prof.notrabajador = u.notrabajador
GROUP BY 
  pr.noproyecto, pr.nombre, pr.ua, pr.grupo, pr.academia;

-- Vista para seleccionar al profesor tutor
CREATE VIEW VistaProfesores AS
SELECT
    u.NoTrabajador,
    u.Nombre,
    u.ApPaterno,
    u.ApMaterno
FROM
    Usuario u
INNER JOIN
    Profesor p ON u.NoTrabajador = p.NoTrabajador;