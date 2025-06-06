import React from "react";

// Barra lateral
import MiniDrawer from '@/components/MiniDrawer';

// Iconos MUI
import HomeIcon from '@mui/icons-material/Home';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PeopleIcon from '@mui/icons-material/People';

export default function OrganizadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const drawerItems = [
        { text: "Inicio", url: "/administrador", icon: <HomeIcon /> },
        { text: "Registar usuario", url: "/administrador/registros", icon: <PersonAddAlt1Icon/>},
        { text: "Administrar usuarios", url: "/administrador/usuarios", icon: <PeopleIcon />}
    ]

    return (
        <div>
            <MiniDrawer items={drawerItems} title="Administrador" />
            <main>
                {children}
            </main>
        </div>
    );
}