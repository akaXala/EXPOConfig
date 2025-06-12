'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
} from '@mui/material';

import { mostrarAlerta } from '@/components/sweetAlert/modalAlerts';
import AsignacionesModal from '@/components/modals/asignacionesModal';

type Profesor = {
  notrabajador: number;
  nombre: string;
  appaterno: string;
  apmaterno: string;
  evaluador: boolean;
};

type Proyecto = {
  idproyecto: number;
};

export default function ViewTeachers() {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [totalProyectos, setTotalProyectos] = useState<number>(0);
  const [modificado, setModificado] = useState(false);
  const [asignacionesModalOpen, setAsignacionesModalOpen] = useState(false);

  const handleVerAsignaciones = () => {
    setAsignacionesModalOpen(true);
  };

  const handleBorrarAsignaciones = async () => {
    try {
      const response = await fetch('/api/proyectos/asignacionesProfesores/eliminar', {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar asignaciones');

      await mostrarAlerta('Éxito', 'Asignaciones eliminadas correctamente', 'OK', 'success');
    } catch (error) {
      console.error('Error al eliminar asignaciones:', error);
      await mostrarAlerta('Error', 'No se pudieron eliminar las asignaciones', 'Cerrar', 'error');
    }
  };

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('/api/profesores/verEvaluador');
        if (!response.ok) throw new Error('Network response was not ok');
        const data: Profesor[] = await response.json();
        setProfesores(data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
        mostrarAlerta('Error', 'Error al obtener los profesores', 'Cerrar', 'error');
      }
    };

    fetchTeachers();
  }, []);

  useEffect(() => {
    const fetchTotalProyectos = async () => {
      try {
        const response = await fetch('/api/proyectos/totalProjects');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setTotalProyectos(data.total_proyectos ?? 0);
      } catch (error) {
        console.error('Error fetching total proyectos:', error);
        mostrarAlerta('Error', 'Error al obtener el total de proyectos', 'Cerrar', 'error');
      }
    };

    fetchTotalProyectos();
  }, []);

  const handleCheckboxChange = (index: number) => {
    setProfesores(prev =>
      prev.map((prof, i) => (i === index ? { ...prof, evaluador: !prof.evaluador } : prof))
    );
    setModificado(true);
  };

  const handleGuardar = async () => {
    try {
      const response = await fetch('/api/profesores/guardarEvaluador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profesores),
      });
      if (!response.ok) throw new Error('Error al guardar los cambios');
      await mostrarAlerta('Éxito', 'Cambios guardados correctamente', 'OK', 'success');
      setModificado(false);
    } catch (error) {
      console.error(error);
      await mostrarAlerta('Error', 'Ocurrió un error al guardar los cambios', 'Cerrar', 'error');
    }
  };

  const handleAsignar = async () => {
  if (modificado) {
    await mostrarAlerta('Atención', 'Guarda los cambios antes de asignar proyectos', 'OK', 'warning');
    return;
  }

  const evaluadores = profesores.filter(p => p.evaluador);
  if (evaluadores.length < 3) {
    await mostrarAlerta('Error', 'Debes seleccionar al menos 3 profesores evaluadores', 'Cerrar', 'error');
    return;
  }

  try {
    const response = await fetch('/api/proyectos/dashboardProjects');
    if (!response.ok) throw new Error('Network response was not ok');
    const proyectos: Proyecto[] = await response.json();

    // Mezclamos los proyectos y profesores para aleatoriedad
    const proyectosAleatorios = [...proyectos].sort(() => Math.random() - 0.5);
    const profesoresAleatorios = [...evaluadores].sort(() => Math.random() - 0.5);

    const asignaciones: { NoTrabajador: number; NoProyecto: number }[] = [];

    // Creamos un índice para rotar evaluadores
    let indexProfesor = 0;

    for (const proyecto of proyectosAleatorios) {
      const profesoresAsignados = new Set<number>();

      while (profesoresAsignados.size < 3) {
        const profesor = profesoresAleatorios[indexProfesor % profesoresAleatorios.length];
        if (!profesoresAsignados.has(profesor.notrabajador)) {
          asignaciones.push({
            NoTrabajador: profesor.notrabajador,
            NoProyecto: proyecto.idproyecto,
          });
          profesoresAsignados.add(profesor.notrabajador);
        }
        indexProfesor++;
      }
    }

    // Guardamos las asignaciones
    const guardarResponse = await fetch('/api/proyectos/asignacionesProfesores/crear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ asignaciones }),
    });

    if (!guardarResponse.ok) throw new Error('Error al guardar asignaciones');

    await mostrarAlerta('Éxito', 'Asignaciones realizadas con éxito', 'OK', 'success');
  } catch (error) {
    console.error('Error en la asignación:', error);
    await mostrarAlerta('Error', 'Error al asignar los proyectos', 'Cerrar', 'error');
  }
};


  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (modificado) {
        event.preventDefault();
        event.returnValue = ''; // Necesario para algunos navegadores
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [modificado]);

  return (
    <Box p={{ xs: 0, sm: 2, md: 4 }}>
      <Box display="flex" justifyContent="center" gap={5} sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Tabla de profesores */}
        <Box display="flex" flexDirection="column" flexGrow={1} maxWidth={700} minWidth={300}>
          <Typography variant="h5" align="center" gutterBottom>
            Profesores
          </Typography>
          <TableContainer component={Paper} sx={{ minWidth: 200, maxHeight: 550, flex: 1 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Nombre</strong></TableCell>
                  <TableCell align="center"><strong>Evalúa</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {profesores.map((profesor, index) => (
                  <TableRow key={profesor.notrabajador}>
                    <TableCell>{`${profesor.nombre} ${profesor.appaterno} ${profesor.apmaterno}`}</TableCell>
                    <TableCell align="center">
                      <Checkbox
                        checked={profesor.evaluador}
                        onChange={() => handleCheckboxChange(index)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    <Typography variant="body2" color="textSecondary">
                      Total: {profesores.length} profesores / {profesores.filter(p => p.evaluador).length} evaluadores
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Botones de acción */}
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2} minWidth={200}>
          <Button fullWidth variant="contained" color="primary" onClick={handleGuardar} sx={{ my: 2 }}>
            Guardar cambios
          </Button>
          <Typography variant="body2" color="textSecondary" align="center">
            Número de proyectos: {totalProyectos}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAsignar}
            disabled={modificado || profesores.every(p => !p.evaluador)}
            sx={{ mb: 1 }}
          >
            Asignar proyectos
          </Button>
          <Button fullWidth variant="contained" onClick={handleBorrarAsignaciones} sx={{ my: 1 }}>
            Borrar asignaciones
          </Button>
          <Button fullWidth variant="contained" onClick={handleVerAsignaciones} sx={{ my: 1 }}>
            Ver asignaciones
          </Button>
        </Box>

        {/* Modal */}
        <AsignacionesModal open={asignacionesModalOpen} onClose={() => setAsignacionesModalOpen(false)} />
      </Box>
    </Box>
  );
}
