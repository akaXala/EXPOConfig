"use client";

import * as React from 'react';

// Componentes MUI
import { Button, Typography, Container, Box, LinearProgress, Alert, Stack, IconButton } from '@mui/material';
// Iconos MUI
import { AttachFile, UploadFile as UploadFileIcon, Clear as ClearIcon } from '@mui/icons-material';

export default function Home(){
    const [file, setFile] = React.useState<File | null>(null);
    const [message, setMessage] = React.useState<string>('');
    const [error, setError] = React.useState<string>('');
    const [uploading, setUploading] = React.useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = React.useState<number>(0);

    // Referencia al input de archivo oculto
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Declaramos el intervalo del progreso
    let progressInterval: NodeJS.Timeout | null = null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setMessage(`Archivo seleccionado: ${e.target.files[0].name}`);
            setError('');
        } else {
            setFile(null);
            setMessage('');
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleFileClear = () => {
        setFile(null);
        setMessage('');
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) {
            setError('Por favor, selecciona un archivo');
            setMessage('');
            return;
        }

        setUploading(true);
        setError('');
        setMessage('Subiendo...');
        setUploadProgress(0);       // Reseteamos cada subida de archivo

        const formData = new FormData();
        formData.append('file', file);

        try {
            let currentProgress = 0;
            progressInterval = setInterval(() => {
                currentProgress += 10;
                if (currentProgress <= 90) {
                    setUploadProgress(currentProgress);
                } else {
                    if (progressInterval) clearInterval(progressInterval);
                }
            }, 200);

            const res = await fetch('/api/cartel/subir', {
                method: 'POST',
                body: formData,
            });

            if (progressInterval) clearInterval(progressInterval);
            setUploadProgress(100);

            const data = await res.json();

            if (res.ok) {
                setMessage(`Archivo subido exitosamente: ${data.fileName} (Ruta: ${data.filePath})`);
                setError('');
                setFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } else {
                setError(`Error al subir el archivo: ${data.error || 'Error desconocido'}`);
                setMessage('');
            }
        } catch (err: any) {
            if (progressInterval) clearInterval(progressInterval);
            setUploadProgress(0);
            console.error('Error en la subida: ', err);
            setError(`Error en el servidor al subir el archivo: ${err.message}`);
            setMessage('');
        } finally {
            setUploading(false);
            if (progressInterval) {
                clearInterval(progressInterval);
            }
            setTimeout(() => setUploadProgress(0), 2000);
        }
    }

    return(
        <Container maxWidth="sm">
            <Box sx={{ my: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Subir plantilla del cartel
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={2} alignItems="center">
                        {/* Input de archivo oculto */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style = {{ display: 'none '}}
                            id="fileInput"
                            accept=".pdf,.docx,.pptx"    // PDF, WORD o POWERPOINT
                        />

                        {/* Botón para activar el input */}
                        <Button
                            variant="outlined"
                            onClick={triggerFileInput}
                            startIcon={<AttachFile />}
                            disabled={uploading}
                        >
                            Seleccionar archivo
                        </Button>

                        {file && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, p:1, border: '1px dashed grey', borderRadius:1 }}>
                                <UploadFileIcon sx={{ mr: 1 }} />
                                <Typography variant="body1" sx={{ flexGrow: 1 }}>
                                    {file.name} ({(file.size / (1024 * 10)).toFixed(2)} MB)
                                </Typography>
                                <IconButton onClick={handleFileClear} size="small" disabled={uploading}>
                                    <ClearIcon />
                                </IconButton>
                            </Box>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={uploading || !file}
                            fullWidth
                            sx={{ mt: 2}}
                            startIcon={<UploadFileIcon />}
                        >
                            {uploading ? 'Subiendo...' : 'Subir archivo'}
                        </Button>

                        {uploading && (
                            <Box sx={{ width: '100%', mt: 1}}>
                                <LinearProgress variant={uploadProgress > 0 && uploadProgress < 100 ? "determinate" : "indeterminate"} value={uploadProgress} />
                                <Typography variant="body2" color="text.secondary">{`${Math.round(uploadProgress)}%`}</Typography>
                            </Box>
                        )}

                        {message && (
                            <Alert severity="success" sx={{ mt: 2, width: '100%' }}>{message}</Alert>
                        )}
                        {error && (
                            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>
                        )}
                    </Stack>
                </form>
            </Box>
        </Container>
    );
}