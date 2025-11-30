const { InfluxDB } = require('@influxdata/influxdb-client');
require('dotenv').config();

const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;
const url = process.env.INFLUX_URL;

const client = new InfluxDB({ url, token });
const queryApi = client.getQueryApi(org);

exports.getMachineData = async (req, res) => {
  const { machineId } = req.params;
  // 1. LEER PARÁMETROS DE FECHA
  // Si el frontend no envía nada, usamos '-10m' (últimos 10 minutos)
  // Si envía fecha, la usamos tal cual (ej: '2023-11-24T10:00:00Z')
  const start = req.query.start || '-3m';
  const stop = req.query.end || 'now()';
  const measurement = req.query.measurement || 'telemetry'; // Por si acaso

  console.log(`Buscando ${machineId}. Rango: ${start} a ${stop}`);
  console.log(`Buscando: ${machineId} en tabla: ${measurement}`);
  
  const fluxQuery = `
    from(bucket: "${bucket}")
      |> range(start: ${start.startsWith('-') ? start : `time(v: "${start}")`}, stop: ${stop === 'now()' ? 'now()' : `time(v: "${stop}")`})
      |> filter(fn: (r) => r["_measurement"] == "${measurement}") 
      |> filter(fn: (r) => r["device_id"] == "${machineId}")
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> sort(columns: ["_time"], desc: false)
  `;

  try {
    const data = [];
    await queryApi.collectRows(fluxQuery, (row, tableMeta) => {
      const o = tableMeta.toObject(row);
      const cleanRow = { time: o._time };
      
      Object.keys(o).forEach(key => {
        if (!['_time', '_start', '_stop', '_measurement', 'device_id', 'result', 'table'].includes(key)) {
           cleanRow[key] = Number(o[key]);
        }
      });

      data.push(cleanRow);
    });

    res.json({ device: machineId, data: data });

  } catch (error) {
    console.error('Error Influx:', error);
    res.status(500).json({ message: 'Error interno' });
  }
};