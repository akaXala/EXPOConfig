"use client";

import * as React from 'react';

// Componentes MUI
import { Box, Grid, TextField, Typography, ThemeProvider, CssBaseline, Button, Stack, IconButton, LinearProgress, Accordion, AccordionActions, AccordionDetails, AccordionSummary, MenuItem } from '@mui/material';

// Iconos MUI
import { AttachFile, UploadFile as UploadFileIcon, Clear as ClearIcon } from '@mui/icons-material';

// Tema Custom
import { theme, primaryColor, buttonColor } from '@/ts/customTheme';

// Alertas SweetAlert
import { mostrarAlerta } from '@/components/sweetAlert/modalAlerts';

// Componenetes custom
import NavBar from '@/components/NavBar';

interface FormDataIntegrantes {
    no_boleta: string;
    nombre: string;
    ap_paterno: string;
    ap_materno: string;
    carrera: string;
}

interface FormData {
    nombre_proyecto: string;
    unidad_academica: string;
    grupo: string;
    academia: string;
    descripcion: string;
    cartel: string;
    profesor?: string;
}

const Cantidad = [
    { numero: 1},
    { numero: 2},
    { numero: 3},
    { numero: 4},
    { numero: 5},
];

const Carreras = [
    { carrera: "Ingeniería en Sistemas Computacionales" },
    { carrera: "Ingeniería en Inteligencia Artificial" },
    { carrera: "Licenciatura en Ciencia de Datos" }
];

export default function Home() {
    // Estado para saber si estamos en el cliente (Evitar error de hidratación)
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {setMounted(true); }, []);

    // Estados para el archivo
    const [file, setFile] = React.useState<File | null>(null);
    const [message, setMessage] = React.useState<string>('');
    const [error, setError] = React.useState<string>('');
    const [uploading, setUploading] = React.useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = React.useState<number>(0);

    // Estado para los Accordiones
    const [expanded, setExpanded] = React.useState(true);

    // Array de boletas
    const [boletasRegistradas, setBoletasRegistradas] = React.useState<string[]>([]);

    // Estado para los profesores
    const [profesores, setProfesores] = React.useState<{ notrabajador: number, nombre_completo: string }[]>([]);

    // Referencia al input de archivo oculto
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Declaramos el intervalo del progreso
    let progressInterval: NodeJS.Timeout | null = null;

    React.useEffect(() => {
        const fetchProfesores = async () => {
            try {
                const res = await fetch('/api/proyectos/consultar-profesores');
                const data = await res.json();
                if (data.success) {
                    setProfesores(data.data);
                }
            } catch (error) {
                console.error("Error al cargar profesores:", error);
            }
        };
        fetchProfesores();
    }, []);

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

    // --- LÓGICA PARA FORMULARIOS DINÁMICOS ---

    // Estados para el formulario de integrantes
    const [numIntegrantes, setNumIntegrantes] = React.useState(1);
    const [integrantesData, setIntegrantesData] = React.useState<FormDataIntegrantes[]>([
        { no_boleta: "", nombre: "", ap_paterno: "", ap_materno: "", carrera: "" }
    ]);

    // Manejador para el campo de selección de número de integrantes
    const handleIntegrantesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const count = Number(e.target.value) || 1;
        setNumIntegrantes(count);

        const nuevosIntegrantes = Array.from({ length: count }, (_, i) => {
            return integrantesData[i] || { no_boleta: "", nombre: "", ap_paterno: "", ap_materno: "", carrera: "" };
        });
        setIntegrantesData(nuevosIntegrantes);
    };

    // Manejador para el campo de selección de carrera
    const handleCarreraChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        const { value } = e.target;
        const list = [...integrantesData];
        list[index] = { ...list[index], carrera: value };
        setIntegrantesData(list);
    };

    // Manejador para los campos de texto de cada integrante
    const handleInputChangeI = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        const { name, value } = e.target;
        const list = [...integrantesData];
        list[index] = { ...list[index], [name]: value };
        setIntegrantesData(list);
    };
    
    // --- FIN DE LA LÓGICA DINÁMICA ---


    const [formData, setFormData] = React.useState<FormData>({
        nombre_proyecto: "",
        unidad_academica: "",
        grupo: "",
        academia: "",
        descripcion: "",
        cartel: "",
        profesor: "",
    });

    // Estado para controlar si el formulario ha sido enviado
    const [formSubmitted, setFormSubmitted] = React.useState(false);
    const [formSubmittedI, setFormSubmitedI] = React.useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
    const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: String(value), // fuerza a string
        }));
    };

    const handleSubmitI = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setFormSubmitedI(true);

        const boletas: string[] = [];

        try {
            for (const integrante of integrantesData) {
                // Convertimos las boletas a string
                const noboletaStr = String(integrante.no_boleta);

                const response = await fetch("/api/proyectos/registro-alumno", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        noboleta: noboletaStr,
                        nombre: integrante.nombre,
                        appaterno: integrante.ap_paterno,
                        apmaterno: integrante.ap_materno,
                        carrera: integrante.carrera,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    mostrarAlerta("Error al registrar", `${errorData.error}`, "Aceptar", "error");
                    return;
                }

                // Guardar la boleta registrada
                boletas.push(noboletaStr);
            }

            // Guardamos las boletas en el estado
            setBoletasRegistradas(boletas);

            // Cambiamos de acordion
            setExpanded(false);  
        } catch (error) {
            console.error("Error al registrar: ", error);
            mostrarAlerta("Hubo un problema con el registro", "Inténtalo de nuevo", "Aceptar", "error");
        }
    }

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
        setUploadProgress(0);

        const formDataFile = new FormData();
        formDataFile.append('file', file);
        formDataFile.append('registro', formData.nombre_proyecto);

        let filePath = "";

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
                // Relacionamos los integrantes con el proyecto
                const noproyecto = data.id;

                // For para relacionar a todos los integrantes
                for (const noboleta of boletasRegistradas) {
                    await fetch("/api/proyectos/proyecto-alumno", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            noboleta,
                            noproyecto,
                        }),
                    });
                }

                // Relacionar el profesor tutor con el proyecto
                if (formData.profesor) {
                    await fetch("/api/proyectos/proyecto-tutor", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            noproyecto,
                            notrabajador: formData.profesor,
                        }),
                    });
                }

                mostrarAlerta("¡Proyecto registrado correctamente!", `Proyecto: ${proyecto.nombre}`, "Aceptar", "success");
            } else {
                mostrarAlerta("Error al registrar", `${data.error}`, "Aceptar", "error");
            }
        } catch (error) {
            console.error("Error al registrar: ", error);
            mostrarAlerta("Hubo un problema con el registro", "Inténtalo de nuevo", "Aceptar", "error");
        }
    }

    if (!mounted) return null;

    return(
        <ThemeProvider theme={theme} >
            <CssBaseline />
            <header>
                <NavBar />
            </header>
            <Grid container spacing={2} alignItems="center" justifyContent="center" className="text-center" marginX={{xs: 2, md: 10}} marginTop={2} bgcolor="white" padding={2} borderRadius={2}>
                <Grid size={12} display="flex" justifyContent="center" p={1} textAlign="center" alignContent="center">
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Registro</Typography>
                </Grid>
                <Box sx={{ width: '100%' }}>
                    <Accordion
                        expanded={expanded}
                        sx={{ width: '100%', marginBottom: 0 }}
                    >
                        <AccordionSummary>
                            <Typography variant='h5' sx={{ fontWeight: 'bold' }}>Registro de alumnos</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <form onSubmit={handleSubmitI}>
                                <Grid container spacing={2}>
                                    <Grid size={12} alignItems="start" justifyContent="start" className="text-left">
                                        <Typography>Seleccione el número de integrantes</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                                        <TextField
                                            id="noIntegrantes"
                                            label="Número de integrantes"
                                            select
                                            size="small"
                                            value={numIntegrantes}
                                            onChange={handleIntegrantesChange}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    paddingLeft: 0,
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: primaryColor,
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: primaryColor,
                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: primaryColor,
                                                    },
                                                },
                                                '& .MuiInputLabel-root': {
                                                    color: primaryColor,
                                                    '&.Mui-focused': {
                                                        color: primaryColor,
                                                    }
                                                },
                                            }}
                                            className='text-field'
                                            required
                                        >
                                            {Cantidad.map((item) => (
                                                <MenuItem key={item.numero} value={item.numero}>
                                                    {item.numero}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>

                                {/* --- INICIO DE RENDERIZADO DINÁMICO CON GRID ORIGINAL --- */}
                                {integrantesData.map((integrante, index) => (
                                <Grid container spacing={2} marginTop={2} key={index}>
                                    <Grid size={12} alignItems="start" justifyContent="start" className="text-left">
                                        <Typography>Integrante {index + 1}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                                        <TextField
                                            name="no_boleta"
                                            label="Número de boleta"
                                            size="small"
                                            value={integrante.no_boleta}
                                            onChange={(e) => handleInputChangeI(e, index)}
                                            className='text-field'
                                            type="number"
                                            required
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                                        <TextField
                                            name="nombre"
                                            label="Nombres"
                                            size="small"
                                            value={integrante.nombre}
                                            onChange={(e) => handleInputChangeI(e, index)}
                                            className='text-field'
                                            required
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                                        <TextField
                                            name="ap_paterno"
                                            label="Apellido Paterno"
                                            size="small"
                                            value={integrante.ap_paterno}
                                            onChange={(e) => handleInputChangeI(e, index)}
                                            className='text-field'
                                            required
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                                        <TextField
                                            name="ap_materno"
                                            label="Apellido materno"
                                            size="small"
                                            value={integrante.ap_materno}
                                            onChange={(e) => handleInputChangeI(e, index)}
                                            className='text-field'
                                            required
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                                        <TextField
                                            name="carrera"
                                            label="Carrera"
                                            size="small"
                                            value={integrante.carrera}
                                            onChange={(e) => handleCarreraChange(e, index)}
                                            className='text-field'
                                            select
                                            required
                                        >
                                            {Carreras.map((item) => (
                                                <MenuItem key={item.carrera} value={item.carrera}>
                                                    {item.carrera}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>
                                ))}
                                <Grid container spacing={2} alignItems="center" justifyContent="center" marginTop={3} marginBottom={3}>
                                    <Button
                                        className="px-4 py-2 rounded"
                                        variant="contained"
                                        type="submit"
                                    >
                                        Registrar alumnos
                                    </Button>
                                </Grid>
                                {/* --- FIN DE RENDERIZADO DINÁMICO --- */}
                            </form>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion
                        expanded={!expanded}
                        sx={{ width: '100%', marginTop: 0 }}
                    >
                        <AccordionSummary>
                            <Typography variant='h5' sx={{ fontWeight: 'bold' }}>Registro de cartel</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2} marginTop={2}>
                                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                                        <TextField 
                                            name="nombre_proyecto"
                                            label="Nombre del proyecto"
                                            size="small"
                                            value={formData.nombre_proyecto}
                                            onChange={handleInputChange}
                                            className='text-field'
                                            required
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                                        <TextField 
                                            name="unidad_academica"
                                            label="Unidad Academica"
                                            size="small"
                                            value={formData.unidad_academica}
                                            onChange={handleInputChange}
                                            className='text-field'
                                            required
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                                        <TextField 
                                            name="grupo"
                                            label="Grupo"
                                            size="small"
                                            value={formData.grupo}
                                            onChange={handleInputChange}
                                            className='text-field'
                                            required
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                                        <TextField 
                                            name="academia"
                                            label="Academia"
                                            size="small"
                                            value={formData.academia}
                                            onChange={handleInputChange}
                                            className='text-field'
                                            required
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                                        <TextField 
                                            name="profesor"
                                            label="Profesor tutor"
                                            size="small"
                                            value={formData.profesor || ""}
                                            onChange={handleInputChange}
                                            className='text-field'
                                            select
                                            required
                                        >
                                            {profesores.map((prof) => (
                                                <MenuItem key={prof.notrabajador} value={String(prof.notrabajador)}>
                                                    {prof.nombre_completo.trim()}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField 
                                            name="descripcion"
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
                                <Stack spacing={2} alignItems="center" sx={{mt: 3}}>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        style = {{ display: 'none' }}
                                        id="fileInput"
                                        accept=".pdf"
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
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, p:1, border: '1px dashed grey', borderRadius:1, width: '100%', maxWidth: '400px' }}>
                                            <UploadFileIcon sx={{ mr: 1 }} />
                                            <Typography variant="body1" sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
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
                                        disabled={uploading}
                                    >
                                        Registrar proyecto
                                    </Button>
                                </Grid>
                            </form>
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Grid>
        </ThemeProvider>
    );
}