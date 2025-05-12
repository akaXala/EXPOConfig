"use client";

// Componentes MUI
import { Box, Grid, Typography, Divider } from '@mui/material';

// Componente custom
import HoverMenu from '@/components/HoverMenu';

// DOM de Next.js
import Image from 'next/image';
import Link from 'next/link';

export default function NavBar() {
    const proyectoItems = [{ text: 'Registro', url: '/proyectos/registros' }, { text: 'Ver', url: '/proyectos/ver' }, { text: 'Plantilla', url: '/proyectos/plantilla' }];
    const asistenciaItems = [{ text: 'Proyecto', url: '/asistencia/proyecto' }, { text: 'Evento', url: '/asistencia/evento' }];
    const eventosItems = [{ text: 'Postular', url: '/eventos/postular' }, { text: 'Ver', url: '/eventos/ver' }];
    const constanciaItems = [{ text: 'Asistencia', url: '/constancia/asistencia' }, { text: 'Participacion', url: '/constancia/participacion' }, { text: 'Justificante', url: '/constancia/justificante' }];
    
    return(
        <>
            <Box sx={{ flexGrow: 1 }} marginTop={1} >
                <Grid container spacing={2} alignItems="center" justifyContent="center" marginTop={1}>
                <Typography variant='h3'>EXPOConfig 25/2</Typography>
                <Image
                    src="/IconEXPOConfig.webp"
                    alt="Logo EXPOConfig"
                    width={50}
                    height={50}
                    priority
                />
                </Grid>
            </Box>
            <Box marginY={2} bgcolor={"#6699CC"} paddingY={2}>
                <Grid container spacing={2} alignItems="center" justifyContent="center" marginX={5}>
                    <Grid size={{ xs: 4, md: 2}}>
                        <HoverMenu triggerText='Proyectos' menuItems={proyectoItems} />
                        <Divider orientation="vertical" flexItem />
                    </Grid>
                    <Grid size={{ xs: 4, md: 2}}>
                        <HoverMenu triggerText='Asistencia' menuItems={asistenciaItems} />
                    </Grid>
                    <Grid size={{ xs: 4, md: 2}}>
                        <HoverMenu triggerText='Eventos' menuItems={eventosItems} />
                    </Grid>
                    <Grid size={{ xs: 4, md: 2}} textAlign="center">
                        <Link
                        href='/agenda'
                        >
                        Agenda
                        </Link>
                    </Grid>
                    <Grid size={{ xs: 4, md: 2}}>
                        <HoverMenu triggerText='Constancia' menuItems={constanciaItems} />
                    </Grid>
                    <Grid size={{ xs: 4, md: 2}} textAlign="center">
                        <Link
                        href='/login'
                        >
                        Log In
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}