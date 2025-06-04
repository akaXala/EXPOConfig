"use client";

import { Button, Box } from "@mui/material";
import { useRouter } from 'next/navigation';

// Componente SweetAlert
import { mostrarAlerta } from '@/components/sweetAlert/modalAlerts';
import MiniDrawer from '@/components/MiniDrawer';

// Iconos MUI
import HomeIcon from '@mui/icons-material/Home';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AssignmentAddIcon from '@mui/icons-material/AssignmentAdd';

export default function Home() {
    const router = useRouter();

    const drawerItems = [
        { text: "Inicio", url: "/organizador", icon: <HomeIcon /> },
        { text: "Subir cartel", url: "/organizador/subir-cartel", icon: <FileUploadIcon />},
        { text: "Asignar proyectos a profesor", url: "/organizador/asignar-proyectos", icon: <AssignmentAddIcon /> },
    ]

    const logout = async() => {
        try {
            const response = await fetch("/api/logout", { method: "POST" });
            if (response.ok) {
                router.push('/'); // Redirigir al login
            } else {
                mostrarAlerta("Error al cerrar sesión", "No sabemos que ha pasado", "Aceptar", "error");
            }
        } catch (err) {
            mostrarAlerta("Error al conectar con el servidor", `${err}`, "Aceptar", "error");
        }
    }

    return(
        <>
            <MiniDrawer items={drawerItems} title="Organizador" />
            <Box marginLeft={9} marginTop={9}>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium facilis exercitationem maiores minus. Ullam error incidunt delectus cum facere, sapiente provident totam, suscipit hic animi, ipsam saepe voluptatum ex. Necessitatibus?</p>
                <Button onClick={logout} variant="contained" color="error">Cerrar sesión Organizador</Button>
            </Box>
        </>
    );
}