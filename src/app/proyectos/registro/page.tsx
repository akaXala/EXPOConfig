"use client";

import * as React from 'react';

// Componentes MUI
import { Box, Grid, TextField, Typography, ThemeProvider, CssBaseline, Button, Stack, IconButton, LinearProgress } from '@mui/material';

// Iconos MUI
import { AttachFile, UploadFile as UploadFileIcon, Clear as ClearIcon } from '@mui/icons-material';

// Tema Custom
import { theme } from '@/ts/customTheme';

// Alertas SweetAlert
import { mostrarAlerta } from '@/components/sweetAlert/modalAlerts';

interface FormData {
  nombre_proyecto: string;
  unidad_academica: string;
  grupo: string;
  academia: string;
  descripcion: string;
  cartel: string;
}

export default function Home() {
    // Estados para el archivo
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

    // Estados para cada campo del formulario
    const [formData, setFormData] = React.useState<FormData>({
        nombre_proyecto: "",
        unidad_academica: "",
        grupo: "",
        academia: "",
        descripcion: "",
        cartel: "Prueba",
    });

    // Estado para controlar si el formulario ha sido enviado
    const [formSubmitted, setFormSubmitted] = React.useState(false);

    // Manejador para campos de texto normales
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setFormData((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    };

    // Manejador del botón de envio
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setFormSubmitted(true);

        if (!file) {
            setError('Por favor, selecciona un archivo');
            setMessage('');
            return;
        }

        setUploading(true);
        setError('');
        setMessage('Subiendo...');
        setUploadProgress(0);       // Reseteamos cada subida de archivo

        const formDataFile = new FormData();
        // Agregamos el archivo y el nombre del proyecto
        formDataFile.append('file', file);
        formDataFile.append('registro', formData.nombre_proyecto);

        let filePath = "";

        // Primero se sube el archivo
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

            const res = await fetch('/api/cartel/subir-proyecto', {
                method: 'POST',
                body: formDataFile,
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
                filePath = data.filePath;
            } else {
                mostrarAlerta("Error", `Error al subir el archivo: ${data.error || 'Error desconocido'}`, "Aceptar", "error");
                setError(`Error al subir el archivo: ${data.error || 'Error desconocido'}`);
                setMessage('');
                setUploading(false);
                return;
            }
        } catch (err: any) {
            if (progressInterval) clearInterval(progressInterval);
            setUploadProgress(0);
            console.error('Error en la subida: ', err);
            mostrarAlerta("Error", `Error en el servidor al subir el archivo: ${err.message}`, "Aceptar", "error");
            setError(`Error en el servidor al subir el archivo: ${err.message}`);
            setMessage('');
            setUploading(false);
            return;
        } finally {
            setUploading(false);
            if (progressInterval) {
                clearInterval(progressInterval);
            }
            setTimeout(() => setUploadProgress(0), 2000);
        }

        const proyecto = {
            nombre: formData.nombre_proyecto,
            ua: formData.unidad_academica,
            grupo: formData.grupo,
            academia: formData.academia,
            descripcion: formData.descripcion,
            cartel: filePath,
        }


        try {
            const response = await fetch("/api/proyectos/registro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(proyecto),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData);
                mostrarAlerta("Error al registrar", `${errorData.error}`, "Aceptar", "error");
                return;
            }

            const data = await response.json();

            if (data.success) {
                mostrarAlerta("¡Proyecto registrado correctamente!", `Proyecto: ${proyecto.nombre}`, "Aceptar", "success");
            } else {
                mostrarAlerta("Error al registrar", `${data.error}`, "Aceptar", "error");
            }
        } catch (error) {
            console.error("Error al registrar: ", error);
            mostrarAlerta("Hubo un problema con el registro", "Inténtalo de nuevo", "Aceptar", "error");
        }
    }

    return(
        <div>
            <ThemeProvider theme={theme} >
                <CssBaseline />
                <Grid container spacing={5} alignItems="center" justifyContent="center" className="text-center" marginX={5}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2} marginTop={2}>
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                                <TextField 
                                    id="nombre_proyecto"
                                    label="Nombre del proyecto"
                                    size="small"
                                    value={formData.nombre_proyecto}
                                    onChange={handleInputChange}
                                    className='text-field'
                                    required
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                                <TextField 
                                    id="unidad_academica"
                                    label="Unidad Academica"
                                    size="small"
                                    value={formData.unidad_academica}
                                    onChange={handleInputChange}
                                    className='text-field'
                                    required
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                                <TextField 
                                    id="grupo"
                                    label="Grupo"
                                    size="small"
                                    value={formData.grupo}
                                    onChange={handleInputChange}
                                    className='text-field'
                                    required
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                                <TextField 
                                    id="academia"
                                    label="Academia"
                                    size="small"
                                    value={formData.academia}
                                    onChange={handleInputChange}
                                    className='text-field'
                                    required
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField 
                                    id="descripcion"
                                    label="Descripción"
                                    multiline
                                    rows={4}
                                    value={formData.descripcion}
                                    onChange={handleInputChange}
                                    className='text-field'
                                    required
                                />
                            </Grid>
                        </Grid>
                        <Stack spacing={2} alignItems="center">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                style = {{ display: 'none '}}
                                id="fileInput"
                                accept=".pdf"    // ONLY PDF
                            />
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

                            {uploading && (
                                <Box sx={{ width: '100%', mt: 1}}>
                                    <LinearProgress variant={uploadProgress > 0 && uploadProgress < 100 ? "determinate" : "indeterminate"} value={uploadProgress} />
                                    <Typography variant="body2" color="text.secondary">{`${Math.round(uploadProgress)}%`}</Typography>
                                </Box>
                            )}
                            
                        </Stack>
                        <Grid container spacing={2} alignItems="center" justifyContent="center" marginTop={3} marginBottom={3}>
                            <Button
                                className="px-4 py-2 rounded"
                                variant="contained"
                                type="submit"
                            >
                                Registrar proyecto
                            </Button>
                        </Grid>
                    </form>
                </Grid>
            </ThemeProvider>
        </div>
    );
}