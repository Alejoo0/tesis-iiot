import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, 
  ListItemIcon, ListItemText, IconButton, Avatar, Divider, useTheme, useMediaQuery 
} from '@mui/material';

// Iconos
import DashboardIcon from '@mui/icons-material/Dashboard';
import HistoryIcon from '@mui/icons-material/History'; // Asegúrate de tener este icono o usa otro
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { removeAuthToken } from '../../utils/auth';

const drawerWidth = 240;

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Hook para detectar si la pantalla es mayor a "sm" (Tablet/Escritorio)
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    removeAuthToken();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    // Si estamos en móvil, cerramos el menú al hacer clic
    if (!isDesktop) setMobileOpen(false);
  };

  // Contenido del Menú (para reutilizar)
  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
         <Typography variant="h6" color="primary" fontWeight="bold">
            IIoT System
         </Typography>
      </Toolbar>
      <Divider />
      
      <List sx={{ flexGrow: 1 }}>
        <ListItem button onClick={() => handleNavigation('/dashboard')}>
          <ListItemIcon><DashboardIcon color="primary" /></ListItemIcon>
          <ListItemText primary="Monitor Tiempo Real" />
        </ListItem>
        <ListItem button onClick={() => handleNavigation('/history')}>
          <ListItemIcon><HistoryIcon color="secondary" /></ListItemIcon>
          <ListItemText primary="Datos Históricos" />
        </ListItem>
      </List>
      
      <Divider />
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
          <ListItemText primary="Cerrar Sesión" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* 1. BARRA SUPERIOR (APPBAR) */}
      <AppBar 
        position="fixed" 
        sx={{ 
          width: { md: `calc(100% - ${drawerWidth}px)` }, // En escritorio se encoge
          ml: { md: `${drawerWidth}px` }, // En escritorio se mueve a la derecha
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          {/* Botón Hamburguesa (Solo visible en Móvil 'md' hacia abajo) */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
             🏭 Sistema SCADA
          </Typography>
          
          <Box display="flex" alignItems="center" gap={1}>
             <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>Admin User</Typography>
             <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>A</Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 2. BARRA LATERAL (DRAWER) - LÓGICA DOBLE */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* A. Drawer Móvil (Temporal) */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} // Mejor rendimiento en móvil
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* B. Drawer Escritorio (Permanente) */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* 3. CONTENIDO PRINCIPAL */}
      <Box 
        component="main" 
        sx={{ 
            flexGrow: 1, 
            p: { xs: 2, md: 3 }, // Padding más pequeño en móvil (2) que en escritorio (3)
            bgcolor: '#f4f6f8', 
            minHeight: '100vh',
            width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` } // Ancho ajustable
        }}
      >
        <Toolbar /> {/* Espaciador */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;