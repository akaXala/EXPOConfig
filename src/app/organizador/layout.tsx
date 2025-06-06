import React from "react";

// Barra lateral
import MiniDrawer from '@/components/MiniDrawer';

// Iconos MUI
import HomeIcon from '@mui/icons-material/Home';
import FileUploadIcon from '@mui/icons-material/FileUpload';

export default function OrganizadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const drawerItems = [
        { text: "Inicio", url: "/organizador", icon: <HomeIcon /> },
        { text: "Subir cartel", url: "/organizador/subir-cartel", icon: <FileUploadIcon />},
    ]

    return (
        <div>
            <MiniDrawer items={drawerItems} title="Organizador" />
            <main>
                {children}
            </main>
        </div>
    );
}