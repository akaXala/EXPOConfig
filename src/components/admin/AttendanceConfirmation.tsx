import React from "react";
import "./AttendanceConfirmation.css";

// Simulación de datos de asistencia
const projects = [
  { name: "Proyecto 1", attended: true },
  { name: "Proyecto 2", attended: false },
  { name: "Proyecto 3", attended: false },
  { name: "Proyecto 4", attended: true },
];

export default function AttendanceConfirmation() {
  return (
    <div className="attendance-bg">
      <div className="attendance-panel">
        <h1>Confirmación de asistencia</h1>
        <div className="attendance-semester">Semestre 2025-2</div>
        <div className="attendance-list">
          {projects.map((p, idx) => (
            <div className="attendance-row" key={p.name}>
              <span className="attendance-project">{p.name}</span>
              <span className="attendance-mark">
                {p.attended ? (
                  <span className="attendance-check">✔️</span>
                ) : (
                  <span className="attendance-cross">❌</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
