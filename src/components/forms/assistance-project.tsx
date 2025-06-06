'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
} from '@mui/material';

interface Project {
  idproyecto: number;
  estudiante: string;
  nombre_proyecto: string;
  ua: string;
  grupo: string;
  academia: string;
  profesor: string;
}

interface ProjectSimplified {
  id: number;
  titulo: string;
}

export default function AssistanceProject() {
  const [allProjects, setAllProjects] = useState<ProjectSimplified[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectSimplified[]>([]);
  const [projectSearchInput, setProjectSearchInput] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<ProjectSimplified | null>(null);

  const searchParams = useSearchParams();
  const idProyectoFromURL = searchParams.get('id-proyecto');

  // Cargar proyectos desde la API y seleccionar automáticamente si hay ID en la URL
  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch('/api/proyectos/dashboardProjects');
      const data: Project[] = await res.json();
      const simplifiedProjects: ProjectSimplified[] = data.map((item) => ({
        id: item.idproyecto,
        titulo: item.nombre_proyecto,
      }));
      setAllProjects(simplifiedProjects);
      setFilteredProjects(simplifiedProjects);
      console.log('ID desde URL:', idProyectoFromURL);

      if (idProyectoFromURL) {
        const matchedProject = simplifiedProjects.find(
          (project) => project.id.toString() === idProyectoFromURL
        );
        if (matchedProject) {
          setSelectedProject(matchedProject);
        }
      }
    };

    fetchProjects();
  }, [idProyectoFromURL]);

  // Filtrar proyectos al escribir en el buscador
  useEffect(() => {
    if (projectSearchInput.trim() === '') {
      setFilteredProjects(allProjects);
    } else {
      const lowerInput = projectSearchInput.toLowerCase();
      const matchingProjects = allProjects.filter(
        (project) =>
          project.titulo.toLowerCase().includes(lowerInput) ||
          project.id.toString().includes(lowerInput)
      );
      setFilteredProjects(matchingProjects);
    }
  }, [projectSearchInput, allProjects]);

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', p: 2 }}>
      <Typography variant="h5" mb={2}>
        Proyecto
      </Typography>

      <Autocomplete
        options={filteredProjects}
        getOptionLabel={(option) => `${option.id} - ${option.titulo}`}
        value={selectedProject}
        onChange={(_, newProject) => setSelectedProject(newProject)}
        inputValue={projectSearchInput}
        onInputChange={(_, newInput) => setProjectSearchInput(newInput)}
        renderInput={(params) => (
          <TextField {...params} label="Buscar proyecto" variant="outlined" />
        )}
        noOptionsText="No hay coincidencias"
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />

      {selectedProject && (
        <Box mt={2}>
          <Typography>
            Proyecto seleccionado: <strong>{selectedProject.titulo}</strong> (ID: {selectedProject.id})
          </Typography>
        </Box>
      )}
    </Box>
  );
}
