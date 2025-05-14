"use client";

import { Button } from "@mui/material";
import { useRouter } from 'next/navigation';

// Componente SweetAlert
import { mostrarAlerta } from '@/components/sweetAlert/modalAlerts';

export default function Home() {
    const router = useRouter();

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
            <p>Administrador</p>
            <Button onClick={logout} variant="contained" color="error">Cerrar sesión administrador</Button>
        </>
    );
}