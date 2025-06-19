"use client";

import * as React from 'react';
import Swal from 'sweetalert2';

// Componentes MUI
import {
    Box,
    Button,
    Grid,
    MenuItem,
    Modal,
    TextField,
    Typography
} from '@mui/material';

// Componentes MUI X para el DatePicker
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";

import { mostrarAlerta } from '@/components/sweetAlert/modalAlerts';

// Estilo para centrar el modal
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

// Opciones para el campo de sexo
const SexoPersona = [
    { value: "Femenino", label: "Femenino" },
    { value: "Masculino", label: "Masculino" },
    { value: "Indefinido", label: "Prefiero no decirlo" },
];

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
}

interface ManageUsersProps {
    open: boolean;
    onClose: () => void;
    usuario: Usuario;
}

export default function ManageUsers({ open, onClose, usuario }: ManageUsersProps) {
    const [view, setView] = React.useState<'modify' | 'password' | 'delete' | null>(null);

    // Estado para los campos del formulario de "Modificar datos"
    const [modifyData, setModifyData] = React.useState({
        nombre: usuario.nombre,
        apellidoPaterno: usuario.appaterno,
        apellidoMaterno: usuario.apmaterno,
        telefono: usuario.telefono,
        sexo: usuario.sexo,
    });
    const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(
        usuario.fechanacimiento ? dayjs(usuario.fechanacimiento) : null
    );

    // Estado para los campos del formulario de "Cambiar contraseña"
    const [passwordData, setPasswordData] = React.useState({
        newPassword: "",
        confirmPassword: "",
    });

    // Resetear vista y datos al cerrar
    React.useEffect(() => {
        if (!open) {
            setView(null);
            setModifyData({
                nombre: usuario.nombre,
                apellidoPaterno: usuario.appaterno,
                apellidoMaterno: usuario.apmaterno,
                telefono: usuario.telefono,
                sexo: usuario.sexo,
            });
            setSelectedDate(usuario.fechanacimiento ? dayjs(usuario.fechanacimiento) : null);
            setPasswordData({
                newPassword: "",
                confirmPassword: "",
            });
        }
    }, [open, usuario]);

    // Manejador de cambios para los inputs de "Modificar datos"
    const handleModifyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setModifyData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    // Manejador para el DatePicker
    const handleDateChange = (newDate: Dayjs | null) => {
        setSelectedDate(newDate);
    };

    // Manejador de cambios para los inputs de "Cambiar contraseña"
    const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setPasswordData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    // Funciones para cambiar de vista
    const handleModifyClick = () => setView('modify');
    const handleChangePasswordClick = () => setView('password');
    const handleDeleteClick = () => setView('delete');

    // --- FUNCIONES DE ACCIÓN CON ALERTAS ---
    // Modificar datos
    const handleActualizar = async () => {
        const confirm = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas actualizar los datos del usuario?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
        });
        if (!confirm.isConfirmed) return;

        onClose(); // Cierra el modal de MUI antes de mostrar la alerta de resultado

        const res = await fetch('/api/usuarios/modificar-datos', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: modifyData.nombre,
                apellidoPaterno: modifyData.apellidoPaterno,
                apellidoMaterno: modifyData.apellidoMaterno,
                fechaNacimiento: selectedDate ? selectedDate.format('YYYY-MM-DD') : '',
                sexo: modifyData.sexo,
                telefono: modifyData.telefono,
                notrabajador: usuario.notrabajador,
            }),
        });
        const data = await res.json();
        if (data.success) {
            await mostrarAlerta('¡Actualizado!', 'Los datos se actualizaron correctamente.', 'OK', 'success');
        } else {
            await mostrarAlerta('Error', data.error || 'No se pudo actualizar.', 'OK', 'error');
        }
    };

    // Cambiar contraseña
    const handleCambiarContrasena = async () => {
        if (!passwordData.newPassword || !passwordData.confirmPassword) {
            await mostrarAlerta('Error', 'Debes llenar ambos campos.', 'OK', 'error');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            await mostrarAlerta('Error', 'Las contraseñas no coinciden.', 'OK', 'error');
            return;
        }
        const confirm = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas cambiar la contraseña?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
        });
        if (!confirm.isConfirmed) return;

        onClose(); // Cierra el modal de MUI antes de mostrar la alerta de resultado

        const res = await fetch('/api/usuarios/cambiar-contrasena', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contrasena: passwordData.newPassword,
                notrabajador: usuario.notrabajador,
            }),
        });
        const data = await res.json();
        if (data.success) {
            await mostrarAlerta('¡Contraseña cambiada!', 'La contraseña se cambió correctamente.', 'OK', 'success');
        } else {
            await mostrarAlerta('Error', data.error || 'No se pudo cambiar la contraseña.', 'OK', 'error');
        }
    };

    // Eliminar usuario
    const handleEliminar = async () => {
        const confirm = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas eliminar este usuario?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
        });
        if (!confirm.isConfirmed) return;

        onClose(); // Cierra el modal de MUI antes de mostrar la alerta de resultado

        const res = await fetch('/api/usuarios/eliminar', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notrabajador: usuario.notrabajador }),
        });
        const data = await res.json();
        if (data.success) {
            await mostrarAlerta('¡Eliminado!', 'El usuario fue eliminado correctamente.', 'OK', 'success');
        } else {
            await mostrarAlerta('Error', data.error || 'No se pudo eliminar el usuario.', 'OK', 'error');
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="opciones-de-usuario-modal"
        >
            <Box sx={style}>
                <Typography id="opciones-de-usuario-modal" variant="h6" component="h2" align="center" gutterBottom>
                    Opciones de Usuario
                </Typography>

                <Grid container spacing={1} justifyContent="center" sx={{ mb: 3 }}>
                    <Grid>
                        <Button variant="outlined" onClick={handleModifyClick}>Modificar datos</Button>
                    </Grid>
                    <Grid>
                        <Button variant="outlined" onClick={handleChangePasswordClick}>Cambiar contraseña</Button>
                    </Grid>
                    <Grid>
                        <Button variant="outlined" color="error" onClick={handleDeleteClick}>Eliminar</Button>
                    </Grid>
                </Grid>

                {/* Vista para Modificar Datos */}
                {view === 'modify' && (
                    <Box component="form" noValidate autoComplete="off">
                        <Typography variant="subtitle1" gutterBottom>Modificar Datos Personales</Typography>
                        <TextField fullWidth margin="dense" id="nombre" label="Nombre" value={modifyData.nombre} onChange={handleModifyInputChange} />
                        <TextField fullWidth margin="dense" id="apellidoPaterno" label="Apellido Paterno" value={modifyData.apellidoPaterno} onChange={handleModifyInputChange} />
                        <TextField fullWidth margin="dense" id="apellidoMaterno" label="Apellido Materno" value={modifyData.apellidoMaterno} onChange={handleModifyInputChange} />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Fecha de Nacimiento"
                                value={selectedDate}
                                onChange={handleDateChange}
                                sx={{ width: '100%', mt: 1, mb: 0.5 }}
                                slotProps={{ textField: { margin: 'dense' } }}
                            />
                        </LocalizationProvider>
                        <TextField
                            fullWidth
                            margin="dense"
                            id="sexo"
                            select
                            label="Sexo"
                            value={modifyData.sexo}
                            onChange={(e) => setModifyData(prev => ({...prev, sexo: e.target.value}))}
                        >
                            {SexoPersona.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField fullWidth margin="dense" id="telefono" label="Teléfono" value={modifyData.telefono} onChange={handleModifyInputChange} />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleActualizar}
                            >
                                Actualizar
                            </Button>
                        </Box>
                    </Box>
                )}

                {/* Vista para Cambiar Contraseña */}
                {view === 'password' && (
                    <Box component="form" noValidate autoComplete="off">
                        <Typography variant="subtitle1" gutterBottom>Cambiar Contraseña</Typography>
                        <TextField
                            fullWidth
                            margin="dense"
                            id="newPassword"
                            label="Nueva Contraseña"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={handlePasswordInputChange}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            id="confirmPassword"
                            label="Confirmar Contraseña"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordInputChange}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleCambiarContrasena}
                            >
                                Cambiar contraseña
                            </Button>
                        </Box>
                    </Box>
                )}

                {/* Vista para Eliminar Cuenta */}
                {view === 'delete' && (
                    <Box>
                        <Typography align="center" sx={{ mt: 2 }}>
                            ¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleEliminar}
                            >
                                Eliminar
                            </Button>
                        </Box>
                    </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, pt: 2, borderTop: '1px solid #ccc' }}>
                    <Button onClick={onClose}>Cerrar</Button>
                </Box>
            </Box>
        </Modal>
    );
}