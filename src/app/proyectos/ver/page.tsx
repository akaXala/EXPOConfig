'use client'

import * as React from 'react';
import { Typography, Grid, TextField, Container, ThemeProvider, CssBaseline } from "@mui/material";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import EnhancedTable from "@/components/table/ViewProjects"
import NavBar from "@/components/NavBar";
// Tema Custom
import { theme } from '@/ts/customTheme';


export default function Page() {
    return (
      <ThemeProvider theme={theme} >
        <CssBaseline />
        <header>
          <NavBar/>
        </header>
        <section>
          <Grid container  spacing={2} marginX={{xs:10, md:20}}>
            <Grid size={12} display="flex" justifyContent="center" p={5}>
              <Typography variant="h3">Proyectos</Typography>
            </Grid>
            <Grid  size='grow'>
              <TextField fullWidth id="TextSearching" label="Poject" variant="outlined" size='small'/>
            </Grid>
            <Grid  size='auto' display="flex" alignItems="center">
              <Button variant="contained" size='large' color="primary">Buscar</Button>
            </Grid>
            <Grid size={12}>
              <Box bgcolor="lightblue">Filtros</Box>
            </Grid>
            <Grid size={12} minHeight={300}>
              <EnhancedTable/>
            </Grid>
          </Grid>
        </section>
      </ThemeProvider>
    )
  }