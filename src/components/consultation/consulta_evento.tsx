import React, { useState, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProjectModal from "../modal/ProjectModal";
import "./consulta.css";

// Modelo de proyecto
type Project = {
  id: string;
  name: string;
  type: string;
  date: string;
  career: string;
};

const mockProjects: Project[] = [
  { id: "1", name: "Proyecto 1", type: "Software", date: "2025-06-20", career: "ISC" },
  { id: "2", name: "Proyecto 2", type: "Hardware", date: "2025-06-21", career: "II" },
  { id: "3", name: "Proyecto 3", type: "Redes", date: "2025-06-22", career: "IM" },
  { id: "4", name: "Proyecto 4", type: "Software", date: "2025-06-20", career: "ISC" },
  { id: "5", name: "Proyecto 5", type: "Hardware", date: "2025-06-21", career: "II" },
  { id: "6", name: "Proyecto 6", type: "Redes", date: "2025-06-22", career: "IM" },
];

// Obtención dinámica de filtros únicos
const projectTypes = Array.from(new Set(mockProjects.map(p => p.type)));
const careers = Array.from(new Set(mockProjects.map(p => p.career)));
const dates = Array.from(new Set(mockProjects.map(p => p.date)));

export default function ExpoESCOMProjects() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCareer, setSelectedCareer] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "type">("date");
  const [modalProject, setModalProject] = useState<Project | null>(null);

  // Filtrado y ordenamiento
  const filteredProjects = useMemo(() => {
    let result = mockProjects.filter(
      (p) =>
        (!search || p.name.toLowerCase().includes(search.toLowerCase())) &&
        (!selectedType || p.type === selectedType) &&
        (!selectedCareer || p.career === selectedCareer) &&
        (!selectedDate || p.date === selectedDate)
    );
    result = result.sort((a, b) =>
      sortBy === "date"
        ? a.date.localeCompare(b.date)
        : a.type.localeCompare(b.type)
    );
    return result;
  }, [search, selectedType, selectedCareer, selectedDate, sortBy]);

  return (
    <div className="expoescom-container">
      <div className="expoescom-left">
        <h1>Proyectos<br />ExpoESCOM</h1>
        <div className="expoescom-semester">Semestre 2025-2</div>
        <div className="expoescom-filters">
          <div>
            <span className="filter-icon">
              {/* Filtro SVG */}
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M2 4h16l-6 7v5l-4 2v-7z" fill="none" stroke="#000" strokeWidth="2"/>
              </svg>
            </span>
            <label>Tipo de proyecto</label>
            <select value={selectedType} onChange={e => setSelectedType(e.target.value)}>
              <option value="">Todos</option>
              {projectTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <span className="filter-icon">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M2 4h16l-6 7v5l-4 2v-7z" fill="none" stroke="#000" strokeWidth="2"/>
              </svg>
            </span>
            <label>Fecha</label>
            <select value={selectedDate} onChange={e => setSelectedDate(e.target.value)}>
              <option value="">Todas</option>
              {dates.map(date => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
          </div>
          <div>
            <span className="filter-icon">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M2 4h16l-6 7v5l-4 2v-7z" fill="none" stroke="#000" strokeWidth="2"/>
              </svg>
            </span>
            <label>Carrera</label>
            <select value={selectedCareer} onChange={e => setSelectedCareer(e.target.value)}>
              <option value="">Todas</option>
              {careers.map(career => (
                <option key={career} value={career}>{career}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="expoescom-right">
        {/* Barra de búsqueda superior derecha */}
        <div className="expoescom-searchbar-wrapper">
          <div className="expoescom-searchbar">
            <span className="expoescom-search-icon">
              {/* Lupa SVG */}
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="10" cy="10" r="8" stroke="#5f2eea" strokeWidth="2"/>
                <line x1="16.0711" y1="16.4853" x2="20" y2="20" stroke="#5f2eea" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
            <input
              type="search"
              className="expoescom-search-input"
              placeholder="Buscar proyecto..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="expoescom-sort">
          <label>Ordenar por:</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as "date" | "type")}>
            <option value="date">Fecha</option>
            <option value="type">Tipo de proyecto</option>
          </select>
        </div>
        <ul className="expoescom-project-list">
          {filteredProjects.map(project => (
            <li
              key={project.id}
              className="expoescom-project-item"
              onClick={() => setModalProject(project)}
            >
              {project.name}
            </li>
          ))}
        </ul>
        {modalProject && (
          <ProjectModal
            project={modalProject}
            onClose={() => setModalProject(null)}
            onRegister={() => {
              toast.success("¡Registro exitoso! Se ha enviado confirmación.");
              setModalProject(null);
            }}
          />
        )}
        <ToastContainer />
      </div>
    </div>
  );
}
