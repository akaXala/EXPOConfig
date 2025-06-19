"use client";

// React
import * as React from 'react';

// Componentes MUI
import { Box, Typography, ThemeProvider, CssBaseline, Grid } from '@mui/material';

// Tema Custom
import { theme } from '@/ts/customTheme';
import Image from 'next/image';

export default function Home() {
    // Estado para saber si estamos en el cliente (Evitar error de hidratación)
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => { setMounted(true); }, []);

    if (!mounted) return null;

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
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
            >
                <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                    Bienvenido administrador
                </Typography>
                <Image
                    src="/LogoEXPOConfig.webp"
                    alt="Logo EXPOConfig"
                    width={400}
                    height={400}
                    priority
                />
            </Box>
        </ThemeProvider>
    );
}