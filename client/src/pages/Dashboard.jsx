import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { generarPDF } from "@/lib/utils"
import { useNavigate } from "react-router-dom"

export default function App() {


  const navigate = useNavigate()

  const handleDashboard = () => {
    navigate("/")
  }

  const [form, setForm] = useState({
    origen: "",
    destino: "",
    unidad: "",
    peso: "",
    capacidad: "",
    prioridad: "",
  })

  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState(null)

  const handleChange = (name, value) => {
    if (value == null)return;
    setForm({ ...form, [name]: value })
  }

  const generarPlan = async () => {
    setLoading(true)
    setAnalysis(null)

    const payload = {
      origen: form.origen,
      destino: form.destino,
      unidad: form.unidad,
      capacidad: form.capacidad,
      peso: form.peso,
      prioridad: form.prioridad,
    }


    try {
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origen: form.origen,
          destino: form.destino,
          unidad: form.unidad,
          peso: form.peso,
          capacidad: form.capacidad,
          prioridad: form.prioridad,
        }),
      })

      const data = await res.json()
      setAnalysis(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1d4d] to-[#020617] p-8 text-white">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-semibold underline">
          Logistica-IA
        </h1>
        <div className="flex gap-6 text-sm">
          <span className="cursor-pointer" onClick={handleDashboard}>Salir</span>
        </div>
      </header>

      {/* MAIN */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FORMULARIO */}
        <Card className="bg-white text-black rounded-2xl">
          <CardHeader>
            <CardTitle className="text-blue-700">
              Nueva Ruta Operativa
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div>
              <Label>Origen</Label>
              <Input
                value={form.origen}
                placeholder="Ej: Monterrey"
                onChange={(e) =>
                  handleChange("origen", e.target.value)
                }
              />
            </div>

            <div>
              <Label>Destino</Label>
              <Input
                value={form.destino}
                placeholder="Ej: CDMX"
                onChange={(e) =>
                  handleChange("destino", e.target.value)
                }
              />
            </div>

            <div>
              <Label>Tipo de unidad</Label>
              <Select
                value={form.unidad || ""}
                onValueChange={(v) =>
                  handleChange("unidad", v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona unidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tráiler 53'">
                    Tráiler 53'
                  </SelectItem>
                  <SelectItem value="Torton">
                    Torton
                  </SelectItem>
                  <SelectItem value="Camioneta">
                    Camioneta
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Peso de carga (tons)</Label>
              <Input
                value={form.peso}
                type="number"
                placeholder="Ej: 20"
                onChange={(e) =>
                  handleChange("peso", e.target.value)
                }
              />
            </div>

            <div>
              <Label>Capacidad de carga del vehiculo (tons)</Label>
              <Input
                value={form.capacidad}
                type="number"
                placeholder="Ej: 20"
                onChange={(e) =>
                  handleChange("capacidad", e.target.value)
                }
              />
            </div>

            <div>
              <Label>Prioridad</Label>
              <Select
                value={form.prioridad || ""}
                onValueChange={(v) =>
                  handleChange("prioridad", v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Menor costo">
                    Menor costo (Ruta óptima)
                  </SelectItem>
                  <SelectItem value="Menor tiempo">
                    Menor tiempo
                  </SelectItem>
                  <SelectItem value="Mayor seguridad">
                    Mayor seguridad
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
              onClick={generarPlan}
              disabled={loading}
            >
              {loading
                ? "Analizando con IA..."
                : "Generar Plan con IA"}
            </Button>
          </CardContent>
        </Card>

        {/* ANALISIS IA */}
        <Card className="bg-slate-50 text-black rounded-2xl">
          <CardHeader>
            <CardTitle className="text-blue-700">
              Análisis del Asistente IA
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {!analysis && (
              <p className="text-sm text-muted-foreground italic">
                Esperando datos para análisis...
              </p>
            )}

            {analysis && (
              <>
                <p className="italic text-sm">
                  {analysis.analysis}
                </p>

                {/* RESUMEN DEL VIAJE */}
                {analysis.summary && (
                  <Card className="bg-gray-100 text-black rounded-lg p-4 mb-4">
                    <p className="font-semibold mb-2">Resumen del viaje</p>
                    <ul className="text-sm list-disc pl-5">
                      <li>Total distancia: {analysis.summary.total_distance_km} km</li>
                      <li>Tiempo estimado: {analysis.summary.estimated_time_hours} horas</li>
                      <li>Paradas requeridas: {analysis.summary.stops_required}</li>
                      <li>Combustible estimado: {analysis.summary.fuel_estimated_liters ?? "N/A"} L</li>
                      <li>Costo aproximado: ${analysis.summary.cost_estimated_mxn ?? "N/A"} MXN</li>
                    </ul>
                  </Card>
                )}

                {/* LÍNEA DE TIEMPO */}
                <div className="border-l-2 border-blue-600 ml-2 pl-4">
                  <p className="font-semibold mb-2">Línea de tiempo</p>
                  {analysis.route_details.map((step) => (
                    <div key={step.step} className="mb-4 relative">
                      <div className="absolute -left-4 w-3 h-3 bg-blue-600 rounded-full top-1.5"></div>
                      <p className="font-semibold">
                        Paso {step.step}: {step.location}
                      </p>
                      <p className="text-sm text-gray-700">{step.action}</p>
                    </div>
                  ))}
                </div>

                {analysis.route_details.map((step) => (
                  <div
                    key={step.step}
                    className="border rounded-lg p-3 bg-white"
                  >
                    <p className="font-semibold">
                      Paso {step.step}: {step.location}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {step.action}
                    </p>
                  </div>
                ))}

                <div>
                  <p className="font-semibold mt-4">
                    Recomendaciones
                  </p>
                  <ul className="list-disc pl-5 text-sm">
                    {analysis.recommendations.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="text-sm font-medium">
                  Vehículo sugerido:{" "}
                  <span className="text-blue-600">
                    {analysis.vehicle_suggested}
                  </span>
                </div>
              </>
            )}
            <Button
              className="w-full mt-2 bg-green-600 hover:bg-green-700"
              onClick={() => generarPDF(analysis)}
              disabled={!analysis}
            >
              Descargar PDF
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
