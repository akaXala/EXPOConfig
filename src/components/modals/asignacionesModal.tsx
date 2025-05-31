'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

type Asignacion = {
  notrabajador: number;
  idproyecto: number;
  nombreprofesor: string;
  nombreproyecto: string;
};

type AgrupacionAsignaciones = {
  notrabajador: number;
  nombreprofesor: string;
  proyectos: string[];
};

type AsignacionesModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function AsignacionesModal({ open, onClose }: AsignacionesModalProps) {
  const [asignacionesAgrupadas, setAsignacionesAgrupadas] = useState<AgrupacionAsignaciones[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchAsignaciones = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/proyectos/asignacionesProfesores/ver');
        if (!response.ok) throw new Error('Error al obtener asignaciones');

        const data: Asignacion[] = await response.json();
        

        // Agrupar asignaciones por profesor
        const agrupadas: Record<string, AgrupacionAsignaciones> = {};
        console.log('Datos obtenidos:', data);
        data.forEach(({notrabajador, idproyecto, nombreprofesor, nombreproyecto}) => {
            console.log(`Procesando asignación: ${notrabajador}, ${idproyecto}, ${nombreprofesor}, ${nombreproyecto}`);
          if (!agrupadas[notrabajador]) {
            agrupadas[notrabajador] = {
              notrabajador,
              nombreprofesor,
              proyectos: [],
            };
          }
          agrupadas[notrabajador].proyectos.push(nombreproyecto);
        });

        setAsignacionesAgrupadas(Object.values(agrupadas));
        console.log('Asignaciones agrupadas:', Object.values(agrupadas));
      } catch (error) {
        console.error('Error al obtener asignaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAsignaciones();
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Asignaciones actuales</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Typography variant="body2" align="center">Cargando...</Typography>
        ) : asignacionesAgrupadas.length === 0 ? (
          <Typography variant="body2" align="center">No hay asignaciones registradas.</Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><strong>Profesor</strong></TableCell>
                <TableCell><strong>Proyectos Asignados</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {asignacionesAgrupadas.map((profesor) => (
                <TableRow key={profesor.notrabajador}>
                  <TableCell>{profesor.nombreprofesor}</TableCell>
                  <TableCell>
                    {profesor.proyectos.map((p, i) => (
                      <div key={i}>{p}</div>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
