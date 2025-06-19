// Uso del cliente para renderizado de algunos componentes
"use client";

// React
import * as React from 'react';

// Componentes MUI
import { Box, Grid, Typography, ThemeProvider, CssBaseline, Button, Divider, useMediaQuery, useTheme } from '@mui/material';

// Tema Custom
import { theme } from '@/ts/customTheme';

// Componente custom
import NavBar from '@/components/NavBar';

// Iconos custom
import FileWordIcon from '@/components/icons/FileWordIcon';
import FilePDFIcon from '@/components/icons/FilePDFIcon';
import FilePPIcon from '@/components/icons/FilePPIcon';

export default function Home() {
    // Estado para saber si estamos en el cliente (Evitar error de hidratación)
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {setMounted(true); }, []);

    const buttonStyle = {
        margin: '10px', // Espaciado entre botones
        padding: '12px 24px', // Botones más grandes
        borderRadius: '20px', // Bordes redondeados
        minWidth: '250px', // Ancho mínimo para consistencia
    };

    if (!mounted) return null;
    return(
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <header>
                <NavBar />
            </header>
            <main>
                <Grid container spacing={2} marginX={{xs: 2, md: 10}} marginTop={2} bgcolor="white" padding={2} borderRadius={2}>
                    <Grid size={12} display="flex" justifyContent="center" p={1} textAlign="center" alignContent="center">
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Plantilla</Typography>
                    </Grid>
                    <Grid size={12} textAlign="center">
                        <a
                            href="/uploads/plantilla_cartel_EXPOESCOM.docx"
                            download
                            style={{ textDecoration: 'none' }}
                        >
                            <Button
                                variant='contained'
                                color='primary'
                                startIcon={<FileWordIcon />}
                                sx={{
                                    ...buttonStyle,
                                    backgroundColor: '#1758BB',
                                    '&:hover': {
                                        backgroundColor: '#1758BB',
                                    },
                                }}
                            >
                                Descargar word
                            </Button>
                        </a>
                    </Grid>
                    <Grid size={12} textAlign="center">
                        <a
                            href="/uploads/plantilla_cartel_EXPOESCOM.pdf"
                            download
                            style={{ textDecoration: 'none' }}
                        >
                            <Button
                                variant='contained'
                                color='primary'
                                startIcon={<FilePDFIcon />}
                                sx={{
                                    ...buttonStyle,
                                    backgroundColor: '#B30B00',
                                    '&:hover': {
                                        backgroundColor: '#B30B00',
                                    },
                                }}
                            >
                                Descargar PDF
                            </Button>
                        </a>
                    </Grid>
                    <Grid size={12} textAlign="center">
                        <a
                            href="/uploads/plantilla_cartel_EXPOESCOM.pptx"
                            download
                            style={{ textDecoration: 'none' }}
                        >
                            <Button
                                variant='contained'
                                color='primary'
                                startIcon={<FilePPIcon />}
                                sx={{
                                    ...buttonStyle,
                                    backgroundColor: '#C43E1C',
                                    '&:hover': {
                                        backgroundColor: '#C43E1C',
                                    },
                                }}
                            >
                                Descargar PowerPoint
                            </Button>
                        </a>
                    </Grid>
                </Grid>
            </main>
        </ThemeProvider>
    );
}