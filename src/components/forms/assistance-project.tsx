'use client';

import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  FormLabel,
  Button,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import {
  SentimentVeryDissatisfied as VeryDissatisfied,
  SentimentDissatisfied as Dissatisfied,
  SentimentNeutral as Neutral,
  SentimentSatisfied as Satisfied,
  SentimentVerySatisfied as VerySatisfied,
} from '@mui/icons-material';

import { SvgIconProps } from '@mui/material/SvgIcon';

interface Project {
  idproyecto: number;
  nombre_proyecto: string;
}

interface ProjectSimplified {
  id: number;
  titulo: string;
}

const satisfactionOptions: {
  value: string;
  label: string;
  icon: React.ElementType<SvgIconProps>;
}[] = [
  { value: '1', label: 'Muy insatisfecho', icon: VeryDissatisfied },
  { value: '2', label: 'Insatisfecho', icon: Dissatisfied },
  { value: '3', label: 'Neutral', icon: Neutral },
  { value: '4', label: 'Satisfecho', icon: Satisfied },
  { value: '5', label: 'Muy satisfecho', icon: VerySatisfied },
];

export default function AssistanceProject() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id-proyecto');

  const [allProjects, setAllProjects] = useState<ProjectSimplified[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectSimplified[]>([]);
  const [projectSearchInput, setProjectSearchInput] = useState('');
  const [selectedProject, setSelectedProject] = useState<ProjectSimplified | null>(null);
  const [lockedByUrl, setLockedByUrl] = useState(true);

  const [form, setForm] = useState({
    nombreCompleto: '',
    correo: '',
    edad: '',
    procedencia: '',
    satisfaccion: '',
    observaciones: '',
  });

  const isDisabled = !selectedProject;

  // 1) Cargo proyectos
  useEffect(() => {
    fetch('/api/proyectos/dashboardProjects')
      .then((res) => res.json())
      .then((data: Project[]) => {
        const simplified = data.map((p) => ({ id: p.idproyecto, titulo: p.nombre_proyecto }));
        setAllProjects(simplified);
        setFilteredProjects(simplified);
      });

  }, []);

  // 2) Cuando cambien allProjects o idParam, selecciono desde URL
  useEffect(() => {
    if (!idParam) setLockedByUrl(false);
    if (idParam && allProjects.length > 0) {
      const idNum = parseInt(idParam, 10);
      if (!isNaN(idNum)) {
        const project = allProjects.find((p) => p.id === idNum);
        if (project) {
          setSelectedProject(project);
          setProjectSearchInput(`${project.id} - ${project.titulo}`);
          setLockedByUrl(true);
        }else {
          setSelectedProject(null);
          setProjectSearchInput('');
          setLockedByUrl(false);
        }
      }
    }
  }, [idParam, allProjects]);

  // 3) Filtrado y reseteo al cambiar projectSearchInput
  useEffect(() => {
    // Solo resetear si el usuario borró el input manualmente y no está bloqueado por URL
    if (!projectSearchInput.trim() && !lockedByUrl) {
      setSelectedProject(null);
      setFilteredProjects(allProjects);
      setForm({
        nombreCompleto: '',
        correo: '',
        edad: '',
        procedencia: '',
        satisfaccion: '',
        observaciones: '',
      });
    } else {
      const lower = projectSearchInput.toLowerCase();
      setFilteredProjects(
        allProjects.filter(
          (p) => p.titulo.toLowerCase().includes(lower) || p.id.toString().includes(lower)
        )
      );
    }
  }, [projectSearchInput, allProjects, lockedByUrl]);


  const handleChange = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async () => {
  if (!selectedProject) return;

  const payload = {
    idproyecto: selectedProject.id,
    ...form,
    edad: parseInt(form.edad, 10),
  };

  try {
    const response = await fetch('/api/asistente/asistencia-proyecto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Error al enviar la asistencia');
    }

    const data = await response.json();
    console.log('Asistencia enviada con éxito:', data);
    alert('Asistencia registrada con éxito');

    // Limpiar formulario
    setForm({
      nombreCompleto: '',
      correo: '',
      edad: '',
      procedencia: '',
      satisfaccion: '',
      observaciones: '',
    });

    if (!lockedByUrl) {
      setSelectedProject(null);
      setProjectSearchInput('');
    }

  } catch (error) {
    console.error('Error al enviar la asistencia:', error);
    alert('Error al enviar la asistencia');
  }
};

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Typography variant="h5" mb={2}>
        Proyecto
      </Typography>

      {lockedByUrl && selectedProject ? (
        <TextField
          label="Proyecto seleccionado"
          value={`${selectedProject.id} - ${selectedProject.titulo}`}
          fullWidth
          disabled
          sx={{ mb: 3 }}
        />
      ) : (
        <Autocomplete
          options={filteredProjects}
          getOptionLabel={(option) => `${option.id} - ${option.titulo}`}
          value={selectedProject}
          onChange={(_, newProject) => setSelectedProject(newProject)}
          inputValue={projectSearchInput}
          onInputChange={(_, newInput) => setProjectSearchInput(newInput)}
          renderInput={(params) => <TextField {...params} label="Buscar proyecto" />}
          isOptionEqualToValue={(o, v) => o.id === v.id}
          noOptionsText="No hay coincidencias"
        />
      )}

      <Box component="form" mt={4} display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Nombre completo"
          value={form.nombreCompleto}
          onChange={handleChange('nombreCompleto')}
          fullWidth
          disabled={isDisabled}
        />

        <TextField
          label="Correo electrónico"
          type="email"
          value={form.correo}
          onChange={handleChange('correo')}
          fullWidth
          disabled={isDisabled}
        />

        <TextField
          label="Edad"
          type="number"
          value={form.edad}
          onChange={handleChange('edad')}
          fullWidth
          disabled={isDisabled}
        />

        <TextField
          label="Procedencia"
          value={form.procedencia}
          onChange={handleChange('procedencia')}
          fullWidth
          disabled={isDisabled}
        />

        <FormControl component="fieldset">
          <FormLabel component="legend">Nivel de satisfacción</FormLabel>
          <ToggleButtonGroup
            value={form.satisfaccion}
            exclusive
            onChange={(_, newValue) => {
              if (newValue !== null)
                setForm((prev) => ({ ...prev, satisfaccion: newValue }));
            }}
            fullWidth
          >
            {satisfactionOptions.map(({ value, icon: Icon }) => (
              <ToggleButton key={value} value={value} disabled={isDisabled}>
                <Icon color={form.satisfaccion === value ? 'primary' : 'disabled'} />
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </FormControl>

        <TextField
          label="Observaciones"
          value={form.observaciones}
          onChange={handleChange('observaciones')}
          multiline
          rows={3}
          fullWidth
          disabled={isDisabled}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isDisabled}
        >
          Enviar
        </Button>
      </Box>
    </Box>
  );
}
