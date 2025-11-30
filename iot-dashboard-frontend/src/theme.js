import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // Puedes cambiar a 'dark' fácilmente después
    primary: {
      main: '#0d47a1', // Azul Industrial Profundo
    },
    secondary: {
      main: '#ff6f00', // Naranja de Seguridad (Alertas)
    },
    background: {
      default: '#f4f6f8', // Gris muy claro para el fondo
      paper: '#ffffff',
    },
    success: {
      main: '#2e7d32', // Verde semáforo
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h6: { fontWeight: 500 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Botones más modernos
          textTransform: 'none', // Evitar TODO MAYÚSCULAS
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Tarjetas redondeadas
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', // Sombra suave
        },
      },
    },
  },
});

export default theme;