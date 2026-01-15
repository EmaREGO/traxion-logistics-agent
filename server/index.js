require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración 
app.use(cors());
app.use(express.json());

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// EL CEREBRO
// Definir la personalidad y reglas de negocio para la rúbrica.
const SYSTEM_INSTRUCTION = `
Eres el "Coordinador de Logística Senior" de Traxión. Tu misión es estandarizar la planeación de rutas.
NO des solo una respuesta, RAZONA paso a paso.

TUS REGLAS DE ORO (Business Logic):
1. **Eficiencia:** Si la ocupación del vehículo es < 60%, sugiere consolidar carga o cambiar a un vehículo más pequeño (Van/Camioneta).
2. **Seguridad:** Si el tiempo de conducción > 4 horas, OBLIGATORIAMENTE añade una parada de "Descanso Operador (30 min)".
3. **Contexto:** Pregunta siempre si hay restricciones (horarios, carga peligrosa) si el usuario no lo especificó.

TU SALIDA DEBE SER SIEMPRE UN JSON ESTRUCTURADO ASÍ:
{
    "analysis": "Texto breve explicando tu decisión lógica al usuario.",
    "route_details": [
        {"step": 1, "location": "Origen", "action": "Carga - 08:00 AM"},
        {"step": 2, "location": "Punto de Control", "action": "Revisión - 10:00 AM"},
        {"step": 3, "location": "Destino", "action": "Entrega - 13:00 PM"}
    ],
    "recommendations": ["Tip 1 de ahorro", "Alerta de seguridad"],
    "vehicle_suggested": "Nombre del vehículo (ej: Nissan NP300)"
}
`;

app.get('/', (req, res) => res.send('Servidor Traxión AI Online'));

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        console.log("Usuario dice:", message);

        // Construir el prompt combinando las reglas con el mensaje del usuario
        const prompt = `${SYSTEM_INSTRUCTION}\n\nUsuario: ${message}\n\nRespuesta JSON:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        // Limpiar texto por si la IA pone ```json al principio
        let text = response.text();
        text = text.replace(/```json/g, '').replace(/```/g, '');

        const jsonResponse = JSON.parse(text);
        res.json(jsonResponse);

    } catch (error) {
            console.error("Error con la IA:", error);
            res.status(500).json({ 
            analysis: "Hubo un error conectando con el sistema central.", 
            route_details: [], 
            recommendations: ["Intenta de nuevo"] 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor Inteligente corriendo en http://localhost:${PORT}`);
});