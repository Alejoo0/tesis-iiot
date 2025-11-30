import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Paper, Typography } from '@mui/material';

// Recibimos 'config' como prop nueva
const TempVibChart = ({ data, config }) => {
  
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, height: 400 }}>
      <Typography variant="h6" color="primary" gutterBottom>
         Tendencia: {config.name}
      </Typography>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
          <XAxis dataKey="time" tickFormatter={formatTime} stroke="#666" />
          <YAxis />
          <Tooltip labelFormatter={(l) => new Date(l).toLocaleString()} />
          <Legend />

          {/* GENERACIÓN DINÁMICA DE LÍNEAS */}
          {config.kpis.map((kpi, index) => (
            <Line
              key={kpi.key}
              type="monotone"
              dataKey={kpi.key}
              name={`${kpi.label} (${kpi.unit})`}
              stroke={kpi.color}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          ))}

        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default TempVibChart;