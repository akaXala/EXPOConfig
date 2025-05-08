// Uso del cliente para renderizado de algunos componentes
"use client";

// React
import * as React from 'react';

// Componentes MUI
import { Box, Grid, Typography, ThemeProvider, CssBaseline } from '@mui/material';

// Tema Custom
import { theme } from '@/ts/customTheme';

// Componente custom
import NavBar from '@/components/NavBar';

// DOM de Next.js
import Image from 'next/image';

export default function Home() {
  return (
    <ThemeProvider theme={theme} >
      <CssBaseline />
        <header>
          <NavBar />
        </header>
        <main>
          <Box>
            <Grid container>
              <Grid size={8}>
                <Box marginY={1}>
                  <Typography variant='h4'>¿Qué es EXPOConfig?</Typography>
                  <Typography>EXPOConfig es un sistema el cual nos ayuda a hacer más sencillo el registro de proyectos para la EXPOESCOM, además de hacer más fácil la administración de todos los recursos que necesitan tanto las personas administradoras como los mismos alumnos interesados en participar.</Typography>
                </Box>
                <Box marginY={1}>
                  <Typography variant='h4'>Objetivo</Typography>
                  <Typography>Incentivar a los alumnos a participar en la EXPOESCOM ofrenciendo una manera sencilla de registrarse y de obtener todos los recursos necesarios para la participación.<br/>Además de agilizar el proceso de aceptación de trabajos así como su propia evaluación.</Typography>
                </Box>
                <Box marginY={1}>
                  <Typography variant='h4'>EXPOESCOM</Typography>
                  <Typography>La EXPOESCOM se llevará acabo los dias 25, 26 y 27 de Junio, cualquier tipo de proyecto es aceptado para su presentación.</Typography>
                </Box>
              </Grid>
              <Grid size={4}>
                <Image 
                  src="/LogoEXPOConfig.webp"
                  alt="EXPOConfig 25/2"
                  width={400}
                  height={400}
                  priority
                />
              </Grid>
            </Grid>
          </Box>
        </main>
        <footer>

        </footer>
    </ThemeProvider>
  );
}
