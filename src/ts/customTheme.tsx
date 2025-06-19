import { createTheme } from '@mui/material/styles';
import '@fontsource/quicksand'; // Importar la fuente Quicksand

const primaryColor = "#003366";
const buttonColor = "#6699CC";

const theme = createTheme({
    palette: {
        primary: {
            main: primaryColor,
        },
        secondary: {
            main: buttonColor,
        },
        background: {
            default: '#f5f5f5', // Color de fondo personalizado
        },
    },
    typography: {
        fontFamily: "'Quicksand', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
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
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                contained: {
                    backgroundColor: buttonColor,
                    '&:hover': {
                        backgroundColor: primaryColor,
                    },
                },
            },
        },
    },
});

export { theme, primaryColor, buttonColor };