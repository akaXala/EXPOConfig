// ProjectModal.tsx
import React, { useState } from "react";
import "./ProjectModal.css";

type Props = {
  project: {
    id: string;
    name: string;
    type: string;
    date: string;
    career: string;
    // ...otros campos
  };
  onClose: () => void;
  onRegister: () => void;
};

export default function ProjectModal({ project, onClose, onRegister }: Props) {
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{project.name}</h2>
        <p><b>Tipo:</b> {project.type}</p>
        <p><b>Fecha:</b> {project.date}</p>
        <p><b>Carrera:</b> {project.career}</p>
        {/* Otros detalles */}
        <button className="modal-register" onClick={() => setConfirm(true)}>
          Registrar asistencia
        </button>
        <button className="modal-calendar">
          Agregar al calendario
        </button>
        {confirm && (
          <div className="modal-confirm">
            <p>¿Confirmas tu asistencia?</p>
            {/* Aquí podrías agregar una breve encuesta */}
            <button onClick={onRegister}>Sí, confirmar</button>
            <button onClick={() => setConfirm(false)}>Cancelar</button>
          </div>
        )}
      </div>
    </div>
  );
}
