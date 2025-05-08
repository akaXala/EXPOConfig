'use client'
import { Typography, Grid, Box, Button, TextField, Container, ThemeProvider, CssBaseline } from "@mui/material";
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
              <Typography variant="h1">Proyectos</Typography>
            </Grid>
            <Grid  size='grow'>
              <TextField fullWidth id="TextSearching" label="Poject" variant="outlined"/>
            </Grid>
            <Grid  size='auto'>
              <Button>Buscar</Button>
            </Grid>
            <Grid size={12}>
              <Box bgcolor="lightblue">Filtros</Box>
            </Grid>
            <Grid size={12} bgcolor='lightgreen' minHeight={300}>
              <Container>
                <EnhancedTable/>
              </Container>
            </Grid>
          </Grid>
        </section>
      </ThemeProvider>
    )
  }