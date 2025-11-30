import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Material UI Components
import { 
  Container, Grid, Paper, Typography, Box, Button, CircularProgress, 
  Alert, MenuItem, Select, FormControl, InputLabel, Card, CardContent, Avatar, Stack 
} from '@mui/material';

// Material UI Icons
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// Internal Components
import axiosInstance from '../api/axiosInstance';
import { getAuthToken, removeAuthToken } from '../utils/auth';
import TempVibChart from '../components/charts/TempVibChart';
import { DEVICES, getDeviceConfig } from '../config/devices';

// --- VERIFICA ESTA RUTA ---
// Si creaste el archivo en 'src/components/AuditTable.jsx', usa esta:
import AuditTable from '../components/charts/AuditTable'; 
// Si lo moviste a 'charts', usa esta otra:
// import AuditTable from '../components/charts/AuditTable'; 

const Dashboard = () => {
  // --- ESTADOS ---
  const [selectedDeviceId, setSelectedDeviceId] = useState(DEVICES[0].id);
  const [machineData, setMachineData] = useState([]);
  const [lastReading, setLastReading] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const currentConfig = getDeviceConfig(selectedDeviceId);

  // --- FUNCIONES ---
  const handleLogout = () => {
    removeAuthToken();
    navigate('/login');
  };

  const fetchData = async () => {
    try {
      const token = getAuthToken();
      const params = { measurement: currentConfig.measurement };
      const response = await axiosInstance.get(`/data/telemetry/${selectedDeviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: params
      });
      const data = response.data.data;
      setMachineData(data);
      if (data.length > 0) setLastReading(data[data.length - 1]);
      setError(null);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const token = getAuthToken();
      const response = await axiosInstance.get('/control/history', {
         headers: { Authorization: `Bearer ${token}` }
      });
      setAuditLogs(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const sendCommand = async (action) => {
    try {
      const token = getAuthToken();
      await axiosInstance.post('/control/send', 
        { machineId: selectedDeviceId, action: action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAuditLogs(); 
      alert(`Orden ${action} enviada a ${currentConfig.name}`);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) handleLogout();
      else alert("Error enviando orden");
    }
  };

  // --- EFECTOS ---
  useEffect(() => {
    setLoading(true);
    setMachineData([]);
    setLastReading(null);
    fetchData();
    fetchAuditLogs();
  }, [selectedDeviceId]);

  useEffect(() => {
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [selectedDeviceId]);

  // --- RENDERIZADO ---
  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f4f6f8', minHeight: '100vh', pb: 4 }}>
      
      {/* HEADER */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h6" color="primary.main" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PrecisionManufacturingIcon /> SCADA Web
            </Typography>
            <FormControl size="small" sx={{ minWidth: 220 }}>
                <InputLabel>Seleccionar Equipo</InputLabel>
                <Select
                    value={selectedDeviceId}
                    label="Seleccionar Equipo"
                    onChange={(e) => setSelectedDeviceId(e.target.value)}
                >
                    {DEVICES.map(device => (
                        <MenuItem key={device.id} value={device.id}>{device.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
        <Button variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={handleLogout}>Salir</Button>
      </Paper>

      <Container maxWidth="xl">
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {loading && !lastReading ? (
          <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>
        ) : (
          /* ======================== LAYOUT PRINCIPAL ======================== */
          <Grid container spacing={3}>
            
            {/* --- COLUMNA IZQUIERDA (40%): Estado, KPIs, Control --- */}
            <Grid item xs={12} md={5} lg={4}>
              <Stack spacing={3}> {/* Stack apila los elementos verticalmente de forma ordenada */}
                
                {/* 1. TARJETA ESTADO */}
                <Card elevation={2} sx={{ borderLeft: `8px solid #4caf50` }}>
                  <CardContent>
                    <Typography color="textSecondary" variant="subtitle2" fontWeight="bold">ESTADO SISTEMA</Typography>
                    <Typography variant="h4" fontWeight="bold" color="success.main" mt={1}>EN LÍNEA</Typography>
                  </CardContent>
                </Card>

                {/* 2. TARJETAS KPI (Dinámicas) */}
                {currentConfig.kpis.map((kpi) => {
                  const value = lastReading?.[kpi.key];
                  let statusColor = kpi.color;
                  let statusIcon = null;
                  let isCritical = false;

                  if (value !== undefined && kpi.thresholds) {
                    if (value >= kpi.thresholds.critical) {
                      statusColor = '#d32f2f'; 
                      statusIcon = <ErrorOutlineIcon sx={{ fontSize: 30, color: statusColor }} />;
                      isCritical = true;
                    } else if (value >= kpi.thresholds.warning) {
                      statusColor = '#ed6c02'; 
                      statusIcon = <WarningAmberIcon sx={{ fontSize: 30, color: statusColor }} />;
                    }
                  }

                  return (
                    <Card key={kpi.key} elevation={isCritical ? 8 : 2} sx={{ borderLeft: `8px solid ${statusColor}` }}>
                        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography color="textSecondary" variant="subtitle2" textTransform="uppercase" fontWeight="bold">
                                {kpi.label}
                            </Typography>
                            <Box display="flex" alignItems="baseline" mt={1}>
                                <Typography variant="h4" fontWeight="bold" sx={{ color: statusColor }}>
                                    {value?.toFixed(1) || '--'}
                                </Typography>
                                <Typography variant="h6" color="textSecondary" ml={1}>
                                    {kpi.unit}
                                </Typography>
                            </Box>
                            {isCritical && <Typography variant="caption" color="error" fontWeight="bold">LÍMITE EXCEDIDO</Typography>}
                          </Box>
                          <Box>{statusIcon}</Box>
                        </CardContent>
                    </Card>
                  );
                })}

                

              </Stack>
            </Grid>

            {/* --- COLUMNA DERECHA (60%): Gráfico, Auditoría --- */}
            <Grid item xs={12} md={7} lg={8}>
              <Stack spacing={3}>
                
                {/* 4. GRÁFICO (Arriba) */}
                <TempVibChart data={machineData} config={currentConfig} />

                {/* 5. TABLA DE AUDITORÍA (Abajo) */}
                <AuditTable logs={auditLogs} />

              </Stack>
            </Grid>

            <Grid item xs={12} md={7} lg={8}>
              {/* 3. PANEL DE CONTROL */}
                <Paper elevation={3} sx={{ p: 3, bgcolor: '#fff3e0', border: '1px solid #ffe0b2' }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      Panel de Control
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      Equipo: <strong>{currentConfig.name}</strong>
                    </Typography>
                    <Stack spacing={2}>
                      <Button variant="contained" color="success" size="large" startIcon={<PlayCircleOutlineIcon />} onClick={() => sendCommand("START")} fullWidth>
                        INICIAR OPERACIÓN
                      </Button>
                      <Button variant="contained" color="error" size="large" startIcon={<StopCircleIcon />} onClick={() => sendCommand("STOP")} fullWidth>
                        PARADA DE EMERGENCIA
                      </Button>
                    </Stack>
                </Paper>
            </Grid>

          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;