'use client';

import {
  Autocomplete,
  TextField,
  Box,
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
  SentimentVerySatisfied as VerySatisfiedIcon, // Renombrado para evitar conflicto
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
  { value: '5', label: 'Muy satisfecho', icon: VerySatisfiedIcon },
];

export default function AssistanceProject() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id-proyecto');

  const [allProjects, setAllProjects] = useState<ProjectSimplified[]>([]);
  const [projectSearchInput, setProjectSearchInput] = useState('');
  const [selectedProject, setSelectedProject] = useState<ProjectSimplified | null>(
    null
  );
  const [lockedByUrl, setLockedByUrl] = useState(true);

  const [form, setForm] = useState({
    nombreCompleto: '',
    correo: '',
    edad: '',
    procedencia: '',
    satisfaccion: '4', // Valor por defecto para una mejor UX
    observaciones: '',
  });

  const isDisabled = !selectedProject;

  // 1) Carga inicial de todos los proyectos
  useEffect(() => {
    fetch('/api/proyectos/dashboardProjects')
      .then((res) => res.json())
      .then((data: Project[]) => {
        const simplified = data.map((p) => ({
          id: p.idproyecto,
          titulo: p.nombre_proyecto,
        }));
        setAllProjects(simplified);
      });
  }, []);

  // 2) Efecto para seleccionar el proyecto si viene un ID en la URL
  useEffect(() => {
    if (!idParam) {
      setLockedByUrl(false);
      return;
    }
    if (allProjects.length > 0) {
      const idNum = parseInt(idParam, 10);
      const project = allProjects.find((p) => p.id === idNum);
      if (project) {
        setSelectedProject(project);
        setProjectSearchInput(`${project.id} - ${project.titulo}`);
        setLockedByUrl(true);
      } else {
        setLockedByUrl(false); // Si el ID no es válido, desbloquear
      }
    }
  }, [idParam, allProjects]);

  const handleChange = (
    key: keyof typeof form,
    isNumeric: boolean = false
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Prevenir valores no numéricos en el campo de edad
    if (isNumeric && value && !/^\d+$/.test(value)) {
      return;
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedProject) return;

    const payload = {
      idproyecto: selectedProject.id,
      nombre: form.nombreCompleto,
      correo: form.correo,
      edad: parseInt(form.edad, 10),
      procedencia: form.procedencia,
      satisfaccion: parseInt(form.satisfaccion, 10),
      observaciones: form.observaciones,
    };

    // Validación simple
    if (!payload.nombre || !payload.correo || !payload.edad) {
        alert('Por favor, completa los campos de nombre, correo y edad.');
        return;
    }

    try {
      const response = await fetch('/api/asistente/asistencia-proyecto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Error al enviar la asistencia');
      }

      await response.json();
      alert('Asistencia registrada con éxito');

      // Limpiar formulario
      setForm({
        nombreCompleto: '',
        correo: '',
        edad: '',
        procedencia: '',
        satisfaccion: '4',
        observaciones: '',
      });

      if (!lockedByUrl) {
        setSelectedProject(null);
        setProjectSearchInput('');
      }
    } catch (error) {
      console.error('Error al enviar la asistencia:', error);
      alert('Hubo un error al registrar la asistencia.');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        {lockedByUrl && selectedProject ? (
          <TextField
            fullWidth
            label="Proyecto seleccionado"
            value={`${selectedProject.id} - ${selectedProject.titulo}`}
            size="small"
            InputProps={{ readOnly: true }}
          />
        ) : (
          <Autocomplete
            options={allProjects}
            getOptionLabel={(option) => `${option.id} - ${option.titulo}`}
            value={selectedProject}
            onChange={(_, newProject) => setSelectedProject(newProject)}
            inputValue={projectSearchInput}
            onInputChange={(_, newInput) => setProjectSearchInput(newInput)}
            renderInput={(params) => <TextField {...params} label="Buscar proyecto" />}
            isOptionEqualToValue={(o, v) => o.id === v.id}
            noOptionsText="No hay coincidencias"
            size="small"
          />
        )}
      </Box>

      <Box component="form" display="flex" flexDirection="column" gap={3}>
        <Box display="flex" flexWrap="wrap" gap={2}>
          {/* Fila 1 de TextFields */}
          <Box sx={{ flex: '1 1 auto', minWidth: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
            <TextField
              fullWidth
              label="Nombre completo"
              value={form.nombreCompleto}
              onChange={handleChange('nombreCompleto')}
              size="small"
              disabled={isDisabled}
              required
            />
          </Box>
          <Box sx={{ flex: '1 1 auto', minWidth: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
            <TextField
              fullWidth
              label="Correo electrónico"
              type="email"
              value={form.correo}
              onChange={handleChange('correo')}
              size="small"
              disabled={isDisabled}
              required
            />
          </Box>
          {/* Fila 2 de TextFields */}
          <Box sx={{ flex: '1 1 auto', minWidth: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
            <TextField
              fullWidth
              label="Edad"
              type="text" // Usar text para manejar el input con la validación de regex
              slotProps={{ input: { inputMode: 'numeric' } }}
              value={form.edad}
              onChange={handleChange('edad', true)}
              size="small"
              disabled={isDisabled}
              required
            />
          </Box>
          <Box sx={{ flex: '1 1 auto', minWidth: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
            <TextField
              fullWidth
              label="Procedencia (Ej. ESCOM, UPIITA)"
              value={form.procedencia}
              onChange={handleChange('procedencia')}
              size="small"
              disabled={isDisabled}
            />
          </Box>
        </Box>

        <FormControl component="fieldset" disabled={isDisabled}>
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
                <Icon
                  color={form.satisfaccion === value ? 'primary' : undefined}
                />
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </FormControl>

        <TextField
          label="Observaciones (opcional)"
          value={form.observaciones}
          onChange={handleChange('observaciones')}
          multiline
          rows={3}
          fullWidth
          disabled={isDisabled}
          sx={{
            '& .MuiInputBase-input': {
              paddingLeft: 2,
            },
          }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isDisabled}
          size="large"
        >
          Enviar
        </Button>
      </Box>
    </Box>
  );
}