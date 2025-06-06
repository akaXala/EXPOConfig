import React from "react";
import { Box } from "@mui/material";

// Barra lateral
import MiniDrawer from '@/components/MiniDrawer';

// Iconos MUI
import HomeIcon from '@mui/icons-material/Home';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import AssignmentAddIcon from '@mui/icons-material/AssignmentAdd';


export default function OrganizadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const drawerItems = [
        { text: "Inicio", url: "/organizador", icon: <HomeIcon /> },
        { text: "Subir cartel", url: "/organizador/subir-cartel", icon: <FileUploadIcon />},
        { text: "Asignar proyectos a profesor", url: "/organizador/asignar-proyecto", icon: <AssignmentAddIcon /> },
    ]

    return (
        <div>
            <MiniDrawer items={drawerItems} title="Organizador" />
            <Box>
                {children}
            </Box>
        </div>
    );
}