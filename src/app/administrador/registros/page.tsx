"use client";

import * as React from 'react';

// Componentes MUI
import { Box, Grid, Typography, Button, TextField, MenuItem, ThemeProvider, CssBaseline } from '@mui/material'

// Componente SweetAlert
import { mostrarAlerta } from '@/components/sweetAlert/modalAlerts';

// Validaciones
import { expresiones, mensajesError } from "@/ts/validationsSpecial";

// Tema Custom
import { theme } from '@/ts/customTheme';

// Componentes MUI X
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

// Opciones para sexo
const SexoPersona = [
    { value: "Femenino", label: "Femenino" },
    { value: "Masculino", label: "Masculino" },
    { value: "Indefinido", label: "Prefiero no decirlo" },
];

// Opciones para el tipo de usuario
const TipoUsuario = [
    { value: "Profesor", label: "Profesor" },
    { value: "Organizador", label: "Organizardor" },
    { value: "Impresiones", label: "Impresiones" },
    { value: "Administrador", label: "Administrador" },
];

// Campos
interface FormData {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    email: string;
    telefono: string;
    contrasena: string;
    sexo: string;
    usuario: string;
}

// DOM de Next.js
import Image from 'next/image';

export default function Home() {
    // Estados para cada campo del formulario
    const [formData, setFormData] = React.useState<FormData>({
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        email: "",
        telefono: "",
        contrasena:"",
        sexo: "",
        usuario: "",
    });

    // Estado para almacenar la fecha seleccionada
    const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(null);

    // Estado para los errores de validación
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    // Estado para controlar si el formulario ha sido enviado
    const [formSubmitted, setFormSubmitted] = React.useState(false);

    // Manejador del calendario
    const handleDateChange = (newDate: Dayjs | null) => {
        setSelectedDate(newDate);
    };

    // Manejador para campos de texto normales
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
        ...prevState,
        [id]: value,
        }));
    };

    // Nuevo manejador para el campo select de sexo
    const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState) => ({
        ...prevState,
        sexo: e.target.value,
        }));
    };

    // Nuevo manejador para el campo select de usuario
    const handleSelectChangeUser = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState) => ({
        ...prevState,
        usuario: e.target.value,
        }));
    };

    // Validar todos los campos del formulario
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        (Object.keys(formData) as Array<keyof typeof formData>).forEach((key) => {
        if (expresiones[key] && !expresiones[key].test(formData[key])) {
            newErrors[key] = mensajesError[key];
        }
        });

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
    };

    // Función para quitar carácteres especiales del nombre
    function quitarCaracteresEspeciales(cadena: string): string {
        // Usamos normalize para transformar los caracteres con diacríticos en su forma base.
        return cadena.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    // Manejador para el registro
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        setFormSubmitted(true);
    
        if (!validateForm()) {
        return;
        }

        let id = 0;

        try {
            const response = await fetch("/api/registro/contar", {
              method: "GET",
            });
      
            if (!response.ok) {
              throw new Error("Error en la solicitud al servidor");
            }
      
            const data = await response.json();
      
            if (data.success) {
              const count = data.count; // Extraer el conteo del JSON
              id = count + 1;
            } else {
              console.error("Error del servidor:", data.error);
            }
          } catch (error) {
            console.error("Error al comunicarse con el servidor:", error);
        }

        const newEmail = formData.nombre.charAt(0).toLocaleLowerCase()+
                         quitarCaracteresEspeciales(formData.apellidoPaterno.toLocaleLowerCase())+
                         formData.apellidoMaterno.charAt(0).toLocaleLowerCase()+
                         id+
                         "@" + formData.usuario.toLocaleLowerCase() + ".expoconfig.mx";

        const newContrasena = formData.nombre+(selectedDate ? selectedDate.toISOString().split("T")[0] : null)+formData.apellidoPaterno;
    
        const usuario = {
        nombre: formData.nombre,
        apellidoPaterno: formData.apellidoPaterno,
        apellidoMaterno: formData.apellidoMaterno || '',
        fechaNacimiento: selectedDate ? selectedDate.toISOString().split("T")[0] : null,
        sexo: formData.sexo || null,
        telefono: formData.telefono || null,
        email: quitarCaracteresEspeciales(newEmail),
        contrasena: quitarCaracteresEspeciales(newContrasena),
        };

        const rol = {
            id: id,
            rol: formData.usuario.toLowerCase(),
        };
        
        try {
            const response = await fetch("/api/registro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(usuario),
            });
        
            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData);
                mostrarAlerta("Error al registrar", `${errorData.error}`, "Aceptar", "error");
                return;
            }
        
            const data = await response.json();
        
            if (data.success) {
                mostrarAlerta("¡Administador registrado exitosamente!", `"Correo: ${newEmail}"`, "Aceptar", "success");
            } else {
                mostrarAlerta("Error al registrar", `${data.error}`, "Aceptar", "error");
            }
        } catch (error) {
            console.error("Error al registrar:", error);
            mostrarAlerta("Hubo un problema con el registro", "Inténtalo de nuevo", "Aceptar", "error");
        }

        try {
            const response = await fetch("/api/registro/tipo-usuario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(rol),
            });

            if (response.ok) {
                const errorData = await response.json();
                // mostrarAlerta("Error al registrar", `${errorData.error}`, "Aceptar", "error");
                return;
            }

            const data = await response.json();
        
            if (data.success) {
                // mostrarAlerta("¡Administador registrado exitosamente!", `"Correo: ${newEmail}"`, "Aceptar", "success");
            } else {
                // mostrarAlerta("Error al registrar", `${data.error}`, "Aceptar", "error");
            }
        } catch (error) {
            console.error("Error al registrar en usuario especifico:", error);
            // mostrarAlerta("Hubo un problema con el registro", "Inténtalo de nuevo", "Aceptar", "error");
        }
    };

    return(
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <main>
                <Box
                    marginX={{ xs: 2, md: 50 }}
                    marginTop={2}
                    bgcolor="white"
                    padding={2}
                    borderRadius={2}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid container spacing={2} alignItems="center" justifyContent="center" margin={1} marginTop={2}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                            Registros usuarios
                        </Typography>
                    </Grid>
                    <Grid container spacing={2} alignItems="center" justifyContent="center" margin={1}>
                        <form onSubmit={handleSubmit}>
                            <Box margin={2}>
                                <TextField
                                id="nombre"
                                label="Nombre"
                                variant="outlined"
                                size="small"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                error={formSubmitted && !!errors.nombre}
                                helperText={formSubmitted ? errors.nombre : ""}
                                className="text-field"
                                required
                                />
                            </Box>
                            <Box margin={2}>
                                <TextField
                                id="apellidoPaterno"
                                label="Apellido Paterno"
                                variant="outlined"
                                size="small"
                                value={formData.apellidoPaterno}
                                onChange={handleInputChange}
                                error={formSubmitted && !!errors.apellidoPaterno}
                                helperText={formSubmitted ? errors.apellidoPaterno : ""}
                                className="text-field"
                                required
                                />
                            </Box>
                            <Box margin={2}>
                                <TextField
                                id="apellidoMaterno"
                                label="Apellido Materno"
                                variant="outlined"
                                size="small"
                                value={formData.apellidoMaterno}
                                onChange={handleInputChange}
                                error={formSubmitted && !!errors.apellidoMaterno}
                                helperText={formSubmitted ? errors.apellidoMaterno : ""}
                                className="text-field"
                                />
                            </Box>
                            <Box margin={2}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Fecha de Nacimiento"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    className="text-field"
                                    slotProps={{
                                    textField: {
                                        size: "small",
                                        required: true,
                                    },
                                    }}
                                />
                                </LocalizationProvider>
                            </Box>
                            <Box margin={2}>
                                <TextField
                                id="genero"
                                select
                                label="Sexo"
                                value={formData.sexo}
                                onChange={handleSelectChange}
                                size="small"
                                className="text-field"
                                required
                                >
                                {SexoPersona.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                    </MenuItem>
                                ))}
                                </TextField>
                            </Box>
                            <Box margin={2}>
                                <TextField
                                id="telefono"
                                label="Teléfono (10 dígitos)"
                                variant="outlined"
                                size="small"
                                value={formData.telefono}
                                onChange={handleInputChange}
                                error={formSubmitted && !!errors.telefono}
                                helperText={formSubmitted ? errors.telefono : ""}
                                className="text-field"
                                required
                                />
                            </Box>
                            <Box margin={2}>
                                <TextField
                                id="tipo-usuario"
                                select
                                label="Tipo de Usuario"
                                value={formData.usuario}
                                onChange={handleSelectChangeUser}
                                size="small"
                                className="text-field"
                                required
                                >
                                {TipoUsuario.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                    </MenuItem>
                                ))}
                                </TextField>
                            </Box>
                            <Box margin={2} className="text-center">
                                <Button
                                type="submit"
                                variant="contained"
                                className="button px-4 py-2 rounded"
                                >
                                    Registrar usuario
                                </Button>
                            </Box>
                        </form>
                    </Grid>
                </Box>
            </main>
        </ThemeProvider>
    );
}