"use client";

import * as React from 'react';

import { useRouter } from 'next/navigation';

import { Box, Typography } from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

export default function NotFound() {
    const router = useRouter();

    React.useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/");
        }, 3000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                height: '100%', // Ocupa toda la altura del contenedor padre
                minHeight: '100vh', // Asegura una altura mínima para la visualización
                p: 3, // Añade un poco de padding
            }}
        >
            <SentimentVeryDissatisfiedIcon
                sx={{ fontSize: '4rem', color: 'text.secondary', mb: 2 }}
            />
            <Typography variant="h5" component="h1" gutterBottom>
                La página no ha sido implementada
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Lamentamos las molestias.
            </Typography>
        </Box>
    );
}