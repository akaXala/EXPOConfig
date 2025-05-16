'use client';

import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import DownloadIcon from '@mui/icons-material/Download';
import { useEffect, useState } from 'react';

type Estudiante = {
  noboleta: string;
  nombre: string;
  appaterno: string;
  apmaterno: string | null;
};

type Profesor = {
  notrabajador: number;
  nombre: string;
  appaterno: string;
  apmaterno: string | null;
};

type Stand = {
  nostand: number;
  ubicacion: string;
  salon: number | null;
  capacidad: number | null;
};

type Proyecto = {
  noproyecto: number;
  nombre: string;
  ua: string;
  grupo: string;
  academia: string;
  descripcion: string;
  cartel: string;
};

type ProjectData = {
  proyecto: Proyecto;
  estudiantes: Estudiante[];
  profesores: Profesor[];
  stand: Stand | null;
};

type ProjectModalProps = {
  open: boolean;
  onClose: () => void;
  projectId: number;
};

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  maxHeight: '80vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function ProjectModal({ open, onClose, projectId }: ProjectModalProps) {
  const [data, setData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    setData(null);

    fetch('/api/proyectos/detalle/?id=' + projectId)
      .then(async (res) => {
        if (!res.ok) throw new Error('Error al cargar proyecto');
        return res.json();
      })
      .then((json: ProjectData) => {
        setData(json);
      })
      .catch((err) => {
        setError(err.message || 'Error desconocido');
      })
      .finally(() => setLoading(false));
  }, [projectId, open]);

  const handleDownload = () => {
    if (data?.proyecto.cartel) {
      const link = document.createElement('a');
      link.href = data.proyecto.cartel;
      link.download = 'cartel-proyecto.jpg'; // Puedes cambiar la extensión según sea necesario
      link.click();
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="project-modal-title">
      <Box sx={style}>
        <Typography id="project-modal-title" variant="h4" mb={2} align="center">
          Detalles del Proyecto
        </Typography>

        {loading && <CircularProgress />}
        {error && <Typography color="error">Error: {error}</Typography>}

        {!loading && !error && data && (
          <Box>
            <Typography><strong>Nombre:</strong> {data.proyecto.nombre}</Typography>
            <Typography><strong>Materia:</strong> {data.proyecto.ua}</Typography>
            <Typography><strong>Grupo:</strong> {data.proyecto.grupo}</Typography>
            <Typography><strong>Academia:</strong> {data.proyecto.academia}</Typography>
            <Typography sx={{ mt: 1 }}><strong>Descripción:</strong> {data.proyecto.descripcion}</Typography>

            <Typography variant="h6" mt={1}><strong>Estudiantes</strong></Typography>
            <List dense>
              {data.estudiantes.map((est) => (
                <ListItem key={est.noboleta}>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary={`${est.nombre} ${est.appaterno} ${est.apmaterno ?? ''}`} />
                </ListItem>
              ))}
            </List>

            <Typography variant="h6" mt={1}><strong>Profesores</strong></Typography>
            {data.profesores.length === 0 ? (
              <Typography>No hay profesores asignados a este proyecto.</Typography>
            ) : (
              <List dense>
                {data.profesores.map((prof) => (
                  <ListItem key={prof.notrabajador}>
                    <ListItemIcon>
                      <SchoolIcon />
                    </ListItemIcon>
                    <ListItemText primary={`${prof.nombre} ${prof.appaterno} ${prof.apmaterno ?? ''}`} />
                  </ListItem>
                ))}
              </List>
            )}

            <Typography variant="h6" mt={1}><strong>Stand</strong></Typography>
            {data.stand ? (
              <>
                <Typography><strong>Ubicación:</strong> {data.stand.ubicacion}</Typography>
                <Typography><strong>Salón:</strong> {data.stand.salon ?? 'No especificado'}</Typography>
                <Typography><strong>Capacidad:</strong> {data.stand.capacidad ?? 'No especificado'}</Typography>
              </>
            ) : (
              <Typography>No hay stand asignado a este proyecto D:</Typography>
            )}

            <Stack direction="row" justifyContent="space-between" mt={3}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
                disabled={!data.proyecto.cartel}
              >
                Descargar Cartel :3
              </Button>
              <Button onClick={onClose} variant="outlined">
                Cerrar
              </Button>
            </Stack>
          </Box>
        )}
      </Box>
    </Modal>
  );
}
