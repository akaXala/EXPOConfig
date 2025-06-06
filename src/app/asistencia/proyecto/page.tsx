'use client'

import React from 'react';

import { Typography, Grid,  ThemeProvider, CssBaseline } from "@mui/material";
import NavBar from "@/components/NavBar";
// Tema Custom
import { theme } from '@/ts/customTheme';
import AssistanceProject from '@/components/forms/assistance-project';

export default function Page() {
    
    return (
      <ThemeProvider theme={theme} >
        <CssBaseline />
        <header>
          <NavBar/>
        </header>
        <section>
          <Grid container  spacing={2} marginX={{xs:10, md:20}}>
            <Grid size={12} display="flex" justifyContent="center" p={1}>
              <Typography variant="h4">Registro de asistencia</Typography>
            </Grid>
            <Grid size={12} minHeight={300}>
              <AssistanceProject />
            </Grid>
          </Grid>
        </section>
      </ThemeProvider>
    )
  }