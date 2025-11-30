import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { 
  Container, Grid, Paper, Typography, Box, Button, FormControl, 
  InputLabel, Select, MenuItem, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, LinearProgress, Alert 
} from '@mui/material';

// Date Pickers
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

// Icons
import TableChartIcon from '@mui/icons-material/TableChart';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';

// Internal
import axiosInstance from '../api/axiosInstance';
import { getAuthToken } from '../utils/auth';
import { DEVICES, getDeviceConfig } from '../config/devices';

const HistoryPage = () => {
  const [selectedDeviceId, setSelectedDeviceId] = useState(DEVICES[0].id);
  const [startDate, setStartDate] = useState(dayjs().subtract(24, 'hour'));
  const [endDate, setEndDate] = useState(dayjs());
  
  const [data, setData] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentConfig = getDeviceConfig(selectedDeviceId);

  useEffect(() => {
    setData([]);
    setHasSearched(false);
    setError(null);
  }, [selectedDeviceId]);

  const fetchHistory = async () => {
    if (!startDate || !endDate) {
      alert("Por favor seleccione fecha de inicio y fin");
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const token = getAuthToken();
      const response = await axiosInstance.get(`/data/telemetry/${selectedDeviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          measurement: currentConfig.measurement,
          start: startDate.toISOString(),
          end: endDate.toISOString()
        }
      });
      setData(response.data.data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar el historial. Verifique la conexión.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (data.length === 0) return;
    const headers = ["Time", ...currentConfig.kpis.map(k => k.label)].join(",");
    const rows = data.map(row => {
      const time = new Date(row.time).toLocaleString();
      const values = currentConfig.kpis.map(k => row[k.key]).join(",");
      return `${time},${values}`;
    }).join("\n");
    
    const blob = new Blob([headers + "\n" + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historial_${selectedDeviceId}.csv`;
    a.click();
  };

  return (
    // CAMBIO IMPORTANTE: maxWidth={false} para ocupar el 100% de la pantalla
    <Container maxWidth={false} sx={{ pb: 4 }}>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, mt: 2 }}>
        <TableChartIcon color="primary" fontSize="large" />
        <Typography variant="h5" color="primary.dark" fontWeight="bold">
           Registro Histórico Detallado
        </Typography>
      </Box>

      {/* BARRA DE FILTROS */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Equipo</InputLabel>
                <Select
                  value={selectedDeviceId}
                  label="Equipo"
                  onChange={(e) => setSelectedDeviceId(e.target.value)}
                >
                  {DEVICES.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <DateTimePicker
                label="Desde"
                value={startDate}
                onChange={setStartDate}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
                maxDate={dayjs()}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <DateTimePicker
                label="Hasta"
                value={endDate}
                onChange={setEndDate}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
                maxDate={dayjs()}
                minDate={startDate}
              />
            </Grid>
            <Grid item xs={12} md={3} display="flex" gap={1}>
              <Button 
                variant="contained" fullWidth startIcon={<SearchIcon />}
                onClick={fetchHistory}
                disabled={loading || !startDate || !endDate}
                size="large"
              >
                {loading ? "..." : "BUSCAR DATOS"}
              </Button>
              <Button variant="outlined" color="success" onClick={downloadCSV} disabled={data.length === 0}>
                <DownloadIcon />
              </Button>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Paper>

      {loading && <LinearProgress sx={{ mb: 2 }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {!hasSearched && !loading && (
        <Paper sx={{ p: 8, textAlign: 'center', bgcolor: '#fafafa', border: '1px dashed #ccc' }}>
          <InfoIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            Seleccione un rango de fechas y presione <strong>BUSCAR DATOS</strong> para generar el reporte.
          </Typography>
        </Paper>
      )}

      {!loading && hasSearched && data.length === 0 && !error && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography>No hay datos registrados para este rango de fechas.</Typography>
        </Paper>
      )}

      {/* TABLA DE DATOS (Ocupando todo) */}
      {!loading && data.length > 0 && (
        <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden' }}>
          <Box sx={{ p: 2, bgcolor: '#e3f2fd', display: 'flex', justifyContent: 'space-between' }}>
             <Typography variant="h6" fontWeight="bold" color="primary.dark">
                📋 Tabla de Registros
             </Typography>
             <Typography variant="subtitle1" color="textSecondary">
                Total: <strong>{data.length}</strong> eventos
             </Typography>
          </Box>
          
          {/* Aumentamos maxHeight a 75vh para que aproveche la pantalla verticalmente */}
          <TableContainer sx={{ maxHeight: '75vh' }}> 
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5', fontSize: '1.1rem' }}>Fecha / Hora</TableCell>
                  {currentConfig.kpis.map(kpi => (
                    <TableCell key={kpi.key} sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5', fontSize: '1.1rem' }}>
                      {kpi.label} ({kpi.unit})
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index} hover sx={{ '&:nth-of-type(odd)': { bgcolor: '#fafafa' } }}>
                    <TableCell>{new Date(row.time).toLocaleString()}</TableCell>
                    {currentConfig.kpis.map(kpi => (
                      <TableCell key={kpi.key}>
                        {row[kpi.key] !== undefined ? row[kpi.key].toFixed(2) : '-'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

    </Container>
  );
};

export default HistoryPage;