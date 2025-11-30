export const DEVICES = [
  {
    id: 'bomba01',
    name: 'Bomba de Riego',
    measurement: 'BombaAgua',
    kpis: [
      { 
        key: 'flow_rate', 
        label: 'Caudal', 
        unit: 'L/min', 
        color: '#0288d1',
        // Umbrales: Si baja de 10 es crítico (bomba seca), si baja de 20 es warning
        // Nota: Para este ejemplo usaré lógica de "Mayor que" para simplificar, 
        // pero puedes adaptar la lógica luego.
        thresholds: { warning: 50, critical: 60 } 
      },
      { 
        key: 'current', 
        label: 'Corriente', 
        unit: 'A', 
        color: '#ed6c02',
        thresholds: { warning: 5, critical: 7 } // Si sube mucho, el motor está atascado
      }
    ],
    controlTopic: 'campo/bomba01/cmd'
  },
  {
    id: 'linea_envasado_01',
    name: 'Planta Embotelladora',
    measurement: 'PlantaIndustrial',
    kpis: [
      { 
        key: 'bottles_per_min', 
        label: 'Producción', 
        unit: 'Bot/min', 
        color: '#2e7d32',
        thresholds: { warning: 130, critical: 150 } // Sobrecarga de línea
      },
      { 
        key: 'motor_temp', 
        label: 'Temp. Motor', 
        unit: '°C', 
        color: '#d32f2f',
        thresholds: { warning: 70, critical: 85 } // ¡El más importante!
      },
    ],
    controlTopic: 'planta/embotelladora/cmd'
  }
];

export const getDeviceConfig = (id) => DEVICES.find(d => d.id === id) || DEVICES[0];