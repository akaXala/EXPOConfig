"use client";

// Componentes MUI
import * as React from 'react';
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Button,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// Componente personalizado
import ManageUsers from '@/components/modals/ManageUsers';

// Tema Custom
import { theme } from '@/ts/customTheme';

// Alertas SweetAlert
import { mostrarAlerta } from '@/components/sweetAlert/modalAlerts';

// Tipos para los datos de usuario
interface Usuario {
  notrabajador: number;
  nombre: string;
  appaterno: string;
  apmaterno: string;
  fechanacimiento: string;
  sexo: string;
  telefono: string;
  email: string;
  contrasena: string;
  nombre_completo: string;
  rol: string;
  // Puedes agregar más campos si tu vista tiene más columnas
}

// Props para la fila
interface RowProps {
  usuario: Usuario;
}

// Fila expandible
function Row({ usuario }: RowProps) {
  const [open, setOpen] = React.useState(false);
  const [manageOpen, setManageOpen] = React.useState(false);

  return (
    <React.Fragment>
      {/* Fila principal */}
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{usuario.notrabajador}</TableCell>
        <TableCell>{usuario.nombre_completo}</TableCell>
        <TableCell>{usuario.rol}</TableCell>
      </TableRow>
      {/* Fila expandida */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Detalles del Usuario
              </Typography>
              <Table size="small" aria-label="details">
                <TableBody>
                  <TableRow>
                    <TableCell><b>ID</b></TableCell>
                    <TableCell>{usuario.notrabajador}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><b>Nombre</b></TableCell>
                    <TableCell>{usuario.nombre}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><b>Apellido Paterno</b></TableCell>
                    <TableCell>{usuario.appaterno}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><b>Apellido Materno</b></TableCell>
                    <TableCell>{usuario.apmaterno}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><b>Fecha de Nacimiento</b></TableCell>
                    <TableCell>
                      {
                        // Formatea la fecha a solo YYYY-MM-DD
                        usuario.fechanacimiento
                          ? new Date(usuario.fechanacimiento).toISOString().split('T')[0]
                          : ''
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><b>Sexo</b></TableCell>
                    <TableCell>{usuario.sexo}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><b>Teléfono</b></TableCell>
                    <TableCell>{usuario.telefono}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><b>Email</b></TableCell>
                    <TableCell>{usuario.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><b>Rol</b></TableCell>
                    <TableCell>{usuario.rol}</TableCell>
                  </TableRow>
                  {/* Puedes agregar más campos si tu vista tiene más */}
                  <TableRow>
                    <TableCell colSpan={2} align="right">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setManageOpen(true)}
                      >
                        Administrar
                      </Button>
                      <ManageUsers
                        open={manageOpen}
                        onClose={() => setManageOpen(false)}
                        usuario={usuario}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

// Tabla principal
const UsuariosTable: React.FC = () => {
  const [usuarios, setUsuarios] = React.useState<Usuario[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await fetch('/api/usuarios');
        const data = await res.json();
        setUsuarios(data);
      } catch (error) {
        setUsuarios([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>ID</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Rol</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                Cargando...
              </TableCell>
            </TableRow>
          ) : usuarios.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No hay usuarios registrados.
              </TableCell>
            </TableRow>
          ) : (
            usuarios.map((usuario) => (
              <Row key={usuario.notrabajador} usuario={usuario} />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Página principal
export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        marginX={{ xs: 2, md: 10 }}
        marginTop={2}
        bgcolor="white"
        padding={2}
        borderRadius={2}
        width="80wh"
        height="83vh"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant='h4' sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
          Administrar usuarios
        </Typography>
        <Box marginTop={4}>
          <UsuariosTable />
        </Box>
      </Box>
    </ThemeProvider>
  );
}