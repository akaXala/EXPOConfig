import { createTheme } from '@mui/material/styles';
import '@fontsource/quicksand'; // Importar la fuente Quicksand

const theme = createTheme({
    typography: {
        fontFamily: "'Quicksand', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    },
});

export { theme };