// ProjectModal.tsx
import React, { useState } from "react";
import "\EXPOConfig\src\app\styles\consulta.css";

type Project = {
  id: string;
  name: string;
  type: string;
  date: string;
  career: string;
  // Puedes agregar aquí otros campos relevantes si los necesitas
};

type ProjectModalProps = {
  project: Project;
  onClose: () => void;
  onRegister: () => void;
};

const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onRegister,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2>{project.name}</h2>
        <p>
          <b>Tipo:</b> {project.type}
        </p>
        <p>
          <b>Fecha:</b> {project.date}
        </p>
        <p>
          <b>Carrera:</b> {project.career}
        </p>
        {/* Puedes agregar más detalles aquí */}
        <button
          className="modal-register"
          onClick={() => setShowConfirm(true)}
        >
          Registrar asistencia
        </button>
        <button className="modal-calendar">
          Agregar al calendario
        </button>
        {showConfirm && (
          <div className="modal-confirm">
            <p>¿Confirmas tu asistencia?</p>
            {/* Aquí podrías agregar una breve encuesta si lo deseas */}
            <button onClick={onRegister}>Sí, confirmar</button>
            <button onClick={() => setShowConfirm(false)}>Cancelar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectModal;
