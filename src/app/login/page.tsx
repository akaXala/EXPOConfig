"use client";

import * as React from "react";
import { Box, TextField, Button } from "@mui/material";

export default function Home() {
    const [formData, setFormData] = React.useState({
        email: "",
        contrasena: "",
    });

    const [error, setError] = React.useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
        ...prev,
        [id]: value,
        }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);     // Para reiniciar el error si las credenciales no son correctas

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                window.location.href = data.redirectUrl;
            } else {
                setError(data.error || "Error desconocido");
            }

        } catch (error) {
            console.error("Error al conectar al servidor: ", error);
            setError("Error de conexión. Inténtalo de nuevo.");
        }
    }

    return(
        <div>
            <form onSubmit={handleLogin}>
                <Box margin={2}>
                    <TextField
                        id="email"
                        label="Correo Electrónico"
                        variant="outlined"
                        size="small"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                    </Box>
                    <Box margin={2}>
                    <TextField
                        id="contrasena"
                        label="Contraseña"
                        type="password"
                        variant="outlined"
                        size="small"
                        value={formData.contrasena}
                        onChange={handleInputChange}
                        required
                    />
                    </Box>
                    {error && (
                    <Box margin={2} color="red">
                        {error}
                    </Box>
                    )}
                    <Box margin={2}>
                    <Button type="submit" variant="contained" className="button">
                        Ingresar
                    </Button>
                    </Box>
            </form>
        </div>
    );
}