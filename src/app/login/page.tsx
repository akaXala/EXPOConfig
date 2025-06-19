"use client";

import * as React from "react";

// Componentes MUI
import { Box, TextField, Button, Typography, ThemeProvider, CssBaseline } from "@mui/material";

// Iconos
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import KeyIcon from '@mui/icons-material/Key';

// Tema Custom
import { theme } from '@/ts/customTheme';

const primaryColor = "#003366";
const buttonColor = "#6699CC";

export default function Home() {
    // Estado para saber si estamos en el cliente (Evitar error de hidratación)
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {setMounted(true); }, []);

    const [formData, setFormData] = React.useState({
        email: "",
        contrasena: "",
    });

    const [error, setError] = React.useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Para reiniciar el error si las credenciales no son correctas

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                window.location.href = data.redirectUrl;
            } else {
                setError(data.error || "Error desconocido");
            }

        } catch (error) {
            console.error("Error al conectar al servidor: ", error);
            setError("Error de conexión. Inténtalo de nuevo.");
        }
    }

    // Estilos reutilizables para los TextFields
    const textFieldStyles = {
        '& .MuiOutlinedInput-root': {
            paddingLeft: 0,
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: primaryColor,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: primaryColor,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: primaryColor,
            },
        },
        '& .MuiInputLabel-root': {
            color: primaryColor,
            '&.Mui-focused': {
                color: primaryColor,
            }
        },
    };

    if (!mounted) return null;
    
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1, // Espacio entre elementos
                        mb: 4, // Margen inferior para separar del formulario
                    }}
                >
                    <Box>
                        {/* Reemplaza '#' con la ruta a tu imagen del logo */}
                        <img
                            src="/IconEXPOConfig.webp"
                            alt="Logo EXPOConfig"
                            width={100}
                            height={100}
                        />
                    </Box>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                        EXPOConfig
                    </Typography>
                </Box>

                <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '350px' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingX: 2 }}>
                        <TextField
                            id="email"
                            placeholder="Ingresa un correo"
                            variant="outlined"
                            fullWidth
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            sx={textFieldStyles} // Aplicamos los estilos
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <Box sx={{ backgroundColor: primaryColor, display: 'flex', alignSelf: 'stretch', alignItems: 'center', paddingX: '12px', marginRight: '8px', borderTopLeftRadius: (theme) => theme.shape.borderRadius + 'px', borderBottomLeftRadius: (theme) => theme.shape.borderRadius + 'px' }}>
                                            <AlternateEmailIcon sx={{ color: 'white' }} />
                                        </Box>
                                    ), 
                                }
                            }}
                        />
                        <TextField
                            id="contrasena"
                            placeholder="Ingresa tu contraseña"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={formData.contrasena}
                            onChange={handleInputChange}
                            required
                            sx={textFieldStyles} // Aplicamos los estilos
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <Box sx={{ backgroundColor: primaryColor, display: 'flex', alignSelf: 'stretch', alignItems: 'center', paddingX: '12px', marginRight: '8px', borderTopLeftRadius: (theme) => theme.shape.borderRadius + 'px', borderBottomLeftRadius: (theme) => theme.shape.borderRadius + 'px' }}>
                                            <KeyIcon sx={{ color: 'white' }} />
                                        </Box>
                                    ),
                                }
                                
                            }}
                        />

                        {error && (
                            <Typography color="error" textAlign="center">
                                {error}
                            </Typography>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                backgroundColor: buttonColor,
                                '&:hover': {
                                    backgroundColor: primaryColor, // Color al pasar el mouse
                                },
                                borderRadius: '25px', // Bordes redondeados
                                paddingY: '12px',
                                fontWeight: 'bold',
                                textTransform: 'none', // Para que el texto no se ponga en mayúsculas
                                fontSize: '1rem',
                                marginTop: 2
                            }}
                        >
                            Ingresar
                        </Button>
                    </Box>
                </form>
            </Box>
        </ThemeProvider>
    );
}