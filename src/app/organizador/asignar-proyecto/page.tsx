"use client";

import { theme } from "@/ts/customTheme";
import { Button, CssBaseline, Grid, ThemeProvider, Typography } from "@mui/material";
import { useRouter } from 'next/navigation'
import ViewTeachers from "@/components/table/ViewTeachers";



export default function Home() {
    const router = useRouter();
    return(
        <ThemeProvider theme={theme} >
            <CssBaseline />
            <section>
            <Grid container  spacing={2} marginX={{ xs:4,sm:10, md:20}} marginTop={6}>
                <Grid size={12} display="flex" justifyContent="center" pt={4}>
                <Typography variant="h4">Asignar los profesores a los proyectos</Typography>
                </Grid>
                <Grid size={12}>
                    <ViewTeachers />
                </Grid>
            </Grid>
            </section>
      </ThemeProvider>
    );
}