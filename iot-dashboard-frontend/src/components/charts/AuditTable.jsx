import React from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Typography, Box 
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';

const AuditTable = ({ logs }) => {
  return (
    <Paper elevation={3} sx={{ p: 2, overflow: 'hidden' }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <HistoryIcon color="primary" />
        <Typography variant="h6" color="primary">Registro de Auditoría (Últimas Acciones)</Typography>
      </Box>
      
      <TableContainer sx={{ maxHeight: 300 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Hora</strong></TableCell>
              <TableCell><strong>Usuario</strong></TableCell>
              <TableCell><strong>Máquina</strong></TableCell>
              <TableCell><strong>Acción</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No hay registros recientes</TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                  <TableCell>{log.username}</TableCell>
                  <TableCell>{log.machine_id}</TableCell>
                  <TableCell>
                    <Chip 
                      label={log.action} 
                      size="small" 
                      color={log.action === 'STOP' ? 'error' : 'success'} 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                     <Chip label={log.status} size="small" color="default" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default AuditTable;