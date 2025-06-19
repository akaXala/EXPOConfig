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

// DOM de Next.js
import Image from 'next/image';

export default function Home() {
  // Estado para saber si estamos en el cliente (Evitar error de hidratación)
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {setMounted(true); }, []);

  // Esta función maneja el scroll suave hacia la sección de destino.
  const handleScroll = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const targetId = event.currentTarget.href.split('#')[1];
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const themeMUI = useTheme();
  const isDesktop = useMediaQuery(themeMUI.breakpoints.up('md'));

  if (!mounted) return null;

  return (
    <ThemeProvider theme={theme} >
      <CssBaseline />
      <header>
        <NavBar />
      </header>
      <main>
        {/* Sección Hero que ocupa toda la pantalla */}
        <Box sx={{ height: 'calc(100vh - 64px)'}}>
          <Grid container sx={{ height: '100%' }}>
            
            {/* Columna Izquierda: Texto y Botón */}
            <Grid size={{xs: 12, md: 5}} sx={{ 
              backgroundColor: '#f5f5f5',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: { xs: 'center', md: 'flex-start' }, // Centrado en móvil, a la izquierda en desktop
              padding: { xs: 4, sm: 6, md: 8 },
              textAlign: { xs: 'center', md: 'left' }
            }}>
              <Typography variant="h6" color="textSecondary" component="h2">
                EXPOESCOM 2025
              </Typography>
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                EXPOConfig
              </Typography>
              <Typography variant="body1" sx={{ mb: 4 }}>
                Un sistema para simplificar el registro y la administración de proyectos. Incentivamos la participación y agilizamos la evaluación.
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                href="#details-section" // Apunta a la sección de abajo
                onClick={handleScroll} // Activa el scroll suave
                sx={{ 
                  borderRadius: '25px', 
                  paddingX: 4, 
                  paddingY: 1.5,
                  backgroundColor: 'black',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#333'
                  }
                }}
              >
                Ver Más
              </Button>
            </Grid>
            
            {/* Columna Derecha: Imagen SOLO en desktop */}
            {isDesktop && (
              <Grid 
                size={{xs: 12, md: 7}} 
                sx={{ 
                  position: 'relative', 
                  height: '100%',
                  display: {xs: 'none', md: 'block'}
                }}
              >
                <Image 
                  src="/ImagenInicio.jpeg"
                  alt="EXPOConfig 25/2"
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </Grid>
            )}

          </Grid>
        </Box>

        {/* Esta es la sección a la que el botón te llevará. */}
        <Box
          id="details-section"
          sx={{height: '100vh'}}
        >
          <Typography variant='h4' component="h2" gutterBottom sx={{ textAlign: 'center', mb: 5 }} paddingTop={{xs: 5, md: 10}}>
            Más detalles sobre EXPOESCOM
          </Typography>
          <Box
            sx={{ 
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: {xs: 'center', md: 'left'}
            }}
          >
            <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ maxWidth: '1200px' }}>
              <Grid size={{xs: 12, md: 5}} textAlign="center">
                <Typography variant='h5'component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Objetivo
                </Typography>
                <Typography variant="body1">
                  Incentivar a los alumnos a participar en la EXPOESCOM ofreciendo una manera sencilla de registrarse y de obtener todos los recursos necesarios para la participación.<br/>Además de agilizar el proceso de aceptación de trabajos así como su propia evaluación.
                </Typography>
              </Grid>
              <Grid sx={{ display: {xs: 'none', md: 'flex'} }}>
                <Divider orientation='vertical' flexItem sx={{ height: '250px' }}/>
              </Grid>
              <Grid size={10} sx={{ display: {xs: 'flex', md: 'none'} }}>
                <Divider sx={{ my: 3, width: '100%' }}/>
              </Grid>
              <Grid size={{xs: 12, md: 5}} textAlign="center">
                <Typography variant='h5'component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  EXPOESCOM
                </Typography>
                <Typography variant="body1">
                  La EXPOESCOM se llevará a cabo los días 19 y 20 de Junio, cualquier tipo de proyecto es aceptado para su presentación.
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </main>
      <footer>
        {/* Aquí habría un footer, si existiera xd */}
      </footer>
    </ThemeProvider>
  );
}