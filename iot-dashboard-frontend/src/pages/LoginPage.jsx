import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button, TextField, Paper, Box, Grid, Typography, Alert, CircularProgress 
} from '@mui/material';
import FactoryIcon from '@mui/icons-material/Factory'; // Icono industrial
import axiosInstance from '../api/axiosInstance';
import { setAuthToken } from '../utils/auth';

// Puedes buscar una imagen real en Unsplash.com y poner la URL aquí
const BG_IMAGE = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80";

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axiosInstance.post('/auth/login', { username, password });
      if (response.data.token) {
        setAuthToken(response.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Credenciales incorrectas o error de servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      
      {/* SECCIÓN IZQUIERDA: IMAGEN */}
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) => t.palette.grey[50],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* SECCIÓN DERECHA: FORMULARIO */}
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '80%'
          }}
        >
          <Box sx={{ mb: 2, bgcolor: 'primary.main', p: 2, borderRadius: '50%' }}>
             <FactoryIcon sx={{ color: 'white', fontSize: 40 }} />
          </Box>
          
          <Typography component="h1" variant="h4" gutterBottom>
            Plataforma de Supervisión Industrial 
          </Typography>
          <Typography variant="body1" color="textSecondary" mb={4}>
            Ingresa tus credenciales para acceder al monitoreo
          </Typography>

          <Box component="form" noValidate onSubmit={handleLogin} sx={{ mt: 1, width: '100%', maxWidth: 400 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Usuario"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, height: 50 }}
            >
              {loading ? <CircularProgress size={24} color="inherit"/> : 'Iniciar Sesión'}
            </Button>
            
            <Typography variant="body2" color="textSecondary" align="center" mt={4}>
              © 2025 Tesis Ingeniería - Sistema de Monitoreo
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginPage;