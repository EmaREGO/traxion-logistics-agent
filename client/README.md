# Traxión-Logistics-Agent

Sistema inteligente de logística para planeación de rutas operativas, con integración de IA generativa y dashboard interactivo.

## Características principales

- Interfaz web moderna con React y TailwindCSS.
- Formularios dinámicos para registrar rutas: origen, destino, tipo de unidad, peso, capacidad y prioridad.
- Generación de planes de ruta optimizados usando Google Generative AI (Gemini).
- Cálculo de resumen del viaje: distancia, tiempo estimado, paradas requeridas, combustible y costo aproximado.
- Línea de tiempo interactiva para los pasos de la ruta.
- Descarga de información generada en PDF.
- Dashboard con análisis y recomendaciones de la IA.

## Tecnologías usadas

- Frontend: React, TailwindCSS, Radix UI, React Router
- Backend: Node.js, Express, CORS, dotenv
- IA: Google Generative AI (Gemini 2.5 Flash)
- Utilidades: jsPDF para exportar PDF

## Instalación

**Clona el repositorio:**

```
git clone https://github.com/ElEmmaENP/traxion-logistics-agent.git
cd traxion-logistics-agent
```

**Instala dependencias en backend:**

```
cd server
npm install
```

**Instala dependencias en frontend:**

```
cd ../client
npm install
```

**Crea un archivo .env en el backend con tu API key de Gemini:**

```
GEMINI_API_KEY=tu_api_key_aqui
PORT=3001
```

## Uso

**Levanta el backend:**

```
cd server
npm start
```

**Levanta el frontend:**

```
cd client
npm start
```

- Abre el navegador en http://localhost:3000
- Ingresa los datos de la ruta y haz clic en “Generar Plan con IA”.
- Visualiza resumen del viaje, línea de tiempo y recomendaciones.
- Descarga el plan en PDF con el botón “Descargar PDF”.

## Estructura del proyecto
```
traxion-logistics-agent/
├─ client/           # Frontend React
├─ server/           # Backend Express
│  ├─ index.js       # Servidor principal
│  └─ .env           # Variables de entorno
├─ lib/utils.js      # Funciones de utilidad (PDF, etc)
└─ README.md
```