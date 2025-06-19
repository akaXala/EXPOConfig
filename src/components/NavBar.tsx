"use client";

// --- React y Next.js ---
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// --- Componentes MUI ---
import {
    Box,
    Grid,
    Typography,
    Divider,
    IconButton,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Collapse
} from '@mui/material';

// --- Iconos MUI ---
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

// --- Componente custom ---
import HoverMenu from '@/components/HoverMenu';

export default function NavBar() {
    const router = useRouter();

    // --- Estado para el Drawer (menú móvil) ---
    const [mobileOpen, setMobileOpen] = useState(false);
    
    // --- Estados para las listas colapsables en el Drawer ---
    const [openProyectos, setOpenProyectos] = useState(false);
    const [openAsistencia, setOpenAsistencia] = useState(false);
    const [openEventos, setOpenEventos] = useState(false);
    const [openConstancia, setOpenConstancia] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // --- Opciones para los menús (sin cambios) ---
    const proyectoItems = [{ text: 'Registro', url: '/proyectos/registro' }, { text: 'Ver', url: '/proyectos/ver' }, { text: 'Plantilla', url: '/proyectos/plantilla' }];
    const asistenciaItems = [{ text: 'Proyecto', url: '/asistencia/proyecto' }, { text: 'Evento', url: '/asistencia/evento' }];
    const eventosItems = [{ text: 'Postular', url: '/eventos/postular' }, { text: 'Ver', url: '/eventos/ver' }];
    const constanciaItems = [{ text: 'Asistencia', url: '/constancia/asistencia' }, { text: 'Participacion', url: '/constancia/participacion' }, { text: 'Justificante', url: '/constancia/justificante' }];

    const homeButton = () => router.push("/");
    const accountButton = () => router.push("/login");

    // Contenido del Drawer (Menú móvil)
    const drawerContent = (
        <Box sx={{ width: 250, padding: 2 }} role="presentation">
            <Typography variant="h6" sx={{ marginBottom: 2 }}>Menú</Typography>
            <Divider />
            <List>
                {/* Proyectos */}
                <ListItemButton onClick={() => setOpenProyectos(!openProyectos)}>
                    <ListItemText primary="Proyectos" />
                    {openProyectos ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openProyectos} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {proyectoItems.map((item) => (
                            <ListItemButton key={item.text} sx={{ pl: 4 }} component={Link} href={item.url} onClick={handleDrawerToggle}>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        ))}
                    </List>
                </Collapse>

                 {/* Asistencia */}
                <ListItemButton onClick={() => setOpenAsistencia(!openAsistencia)}>
                    <ListItemText primary="Asistencia" />
                    {openAsistencia ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openAsistencia} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {asistenciaItems.map((item) => (
                            <ListItemButton key={item.text} sx={{ pl: 4 }} component={Link} href={item.url} onClick={handleDrawerToggle}>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        ))}
                    </List>
                </Collapse>

                {/* Eventos */}
                <ListItemButton onClick={() => setOpenEventos(!openEventos)}>
                    <ListItemText primary="Eventos" />
                    {openEventos ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openEventos} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {eventosItems.map((item) => (
                            <ListItemButton key={item.text} sx={{ pl: 4 }} component={Link} href={item.url} onClick={handleDrawerToggle}>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        ))}
                    </List>
                </Collapse>

                {/* Agenda */}
                <ListItemButton component={Link} href='/agenda' onClick={handleDrawerToggle}>
                    <ListItemText primary="Agenda" />
                </ListItemButton>

                {/* Constancia */}
                <ListItemButton onClick={() => setOpenConstancia(!openConstancia)}>
                    <ListItemText primary="Constancia" />
                    {openConstancia ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openConstancia} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {constanciaItems.map((item) => (
                            <ListItemButton key={item.text} sx={{ pl: 4 }} component={Link} href={item.url} onClick={handleDrawerToggle}>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        ))}
                    </List>
                </Collapse>
            </List>
            <Divider sx={{ marginY: 2 }} />
            <ListItemButton onClick={() => { accountButton(); handleDrawerToggle(); }}>
                <ListItemIcon> <AccountCircleIcon /> </ListItemIcon>
                <ListItemText primary="Cuenta" />
            </ListItemButton>
        </Box>
    );

    return (
        <>
            {/* Se oculta en móvil, se muestra en escritorio */}
            <Box sx={{
                flexGrow: 1,
                paddingTop: 0.5,
                bgcolor: 'white',
                alignContent: "center",
                justifyContent: "center",
                display: { xs: 'none', md: 'block' }
            }}>
                <Grid container alignItems="center" justifyContent="space-between" marginY={2}>
                    {/* Logo y Título a la izquierda */}
                    <Grid>
                        <Grid container spacing={2} alignItems="center">
                            <Grid marginLeft={3}>
                                <Image
                                    src="/IconEXPOConfig.webp"
                                    alt="Logo EXPOConfig"
                                    width={50}
                                    height={50}
                                    priority
                                    onClick={homeButton}
                                    style={{ cursor: 'pointer' }}
                                />
                            </Grid>
                            <Grid>
                                <Typography variant='h4'>EXPOConfig 25/2</Typography>
                            </Grid>
                            <Grid marginLeft={3}>
                                <HoverMenu triggerText='Proyectos' menuItems={proyectoItems} />
                            </Grid>
                            <Grid marginLeft={1}>
                                <HoverMenu triggerText='Asistencia' menuItems={asistenciaItems} />
                            </Grid>
                            <Grid marginLeft={1}>
                                <HoverMenu triggerText='Eventos' menuItems={eventosItems} />
                            </Grid>
                            <Grid textAlign="center" marginLeft={1}>
                                <Link href='/agenda' passHref legacyBehavior>
                                  <Typography
                                    component="span"
                                    sx={{
                                      cursor: 'pointer',
                                      position: 'relative',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      paddingBottom: '5px',
                                      '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        width: '100%',
                                        transform: 'scaleX(0)',
                                        height: '2px',
                                        bottom: 0,
                                        left: 0,
                                        backgroundColor: 'currentColor',
                                        transformOrigin: 'center',
                                        transition: 'transform 0.3s ease-out',
                                      },
                                      '&:hover::after': {
                                        transform: 'scaleX(1)',
                                      },
                                    }}
                                  >
                                    Agenda
                                  </Typography>
                                </Link>
                            </Grid>
                            <Grid marginLeft={1}>
                                <HoverMenu triggerText='Constancia' menuItems={constanciaItems} />
                            </Grid>
                        </Grid>
                    </Grid>
                    {/* Menú a la derecha */}
                    <Grid>
                        <Box>
                            <Grid container spacing={2} alignItems="center" justifyContent="flex-end" paddingRight={5}>
                                <div
                                    onClick={accountButton}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <AccountCircleIcon
                                        sx={{ fontSize: 30 }}
                                    />
                                </div>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{
                display: { xs: 'flex', md: 'none' },
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 1.5,
                bgcolor: 'white'
            }}>
                <Grid container spacing={1.5} alignItems="center">
                    <Grid>
                        <Image src="/IconEXPOConfig.webp" alt="Logo EXPOConfig" width={40} height={40} priority />
                    </Grid>
                    <Grid>
                        <Typography variant='h5' component="div">EXPOConfig</Typography>
                    </Grid>
                </Grid>

                <IconButton color="inherit" aria-label="open drawer" edge="end" onClick={handleDrawerToggle}>
                    <MenuIcon sx={{ fontSize: 35, color: 'black' }} />
                </IconButton>
            </Box>
            
            <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
                {drawerContent}
            </Drawer>
        </>
    );
}