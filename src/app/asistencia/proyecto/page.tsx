'use client'

import React from 'react';

import { Typography, Grid,  ThemeProvider, CssBaseline } from "@mui/material";
import NavBar from "@/components/NavBar";
// Tema Custom
import { theme } from '@/ts/customTheme';
import AssistanceProject from '@/components/forms/assistance-project';

export default function Page() {
  // Estado para saber si estamos en el cliente (Evitar error de hidratación)
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <ThemeProvider theme={theme} >
      <CssBaseline />
      <header>
        <NavBar/>
      </header>
      <section>
        <Grid container spacing={2} marginX={{xs: 2, md: 10}} marginTop={2} bgcolor="white" padding={2} borderRadius={2}>
          <Grid size={12} display="flex" justifyContent="center" p={1}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }} textAlign="center">Registro de asistencia</Typography>
          </Grid>
          <Grid size={12} minHeight={300}>
            <AssistanceProject />
          </Grid>
        </Grid>
      </section>
    </ThemeProvider>
  )
  }