import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
type Props = { data: { date?: string; peso: number; unidad?: string }[] };
export default function LogPesajeChart({ data }: Props) {
  if (data.length < 2) return null;
  const units = new Set(data.map((item) => item.unidad));
  if (units.size !== 1 || data.some((item) => !item.unidad))
    return (
      <p className="ra-history-chart-note">
        El historial contiene unidades diferentes o sin especificar. Se muestran
        los registros con su unidad original; no se combinan en un gráfico ni se
        convierten automáticamente.
      </p>
    );
  const unit = data[0].unidad;
  const chartData = [...data]
    .sort(
      (a, b) =>
        new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime(),
    )
    .map((item) => ({
      date:
        item.date && !Number.isNaN(new Date(item.date).getTime())
          ? new Date(item.date).toLocaleDateString("es")
          : "Sin fecha",
      peso: item.peso,
    }));
  return (
    <figure
      className="ra-history-chart"
      aria-label={
        "Evolución del peso en " +
        unit +
        ". Los valores también están en la lista de registros."
      }
    >
      <figcaption>
        <h2>Evolución del peso</h2>
        <p>
          Unidad original: {unit}. Consulta el valor y la fecha de cada pesaje
          en los registros.
        </p>
      </figcaption>
      <div className="ra-history-chart-canvas">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 300, height: 256 }}>
          <LineChart data={chartData} accessibilityLayer>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--ra-border)" />
            <XAxis dataKey="date" stroke="var(--ra-muted)" />
            <YAxis stroke="var(--ra-muted)" domain={[0, "auto"]} width={50} />
            <Tooltip
              formatter={(value) => [String(value) + " " + unit, "Peso"]}
            />
            <Line
              type="linear"
              dataKey="peso"
              stroke="var(--ra-petrol)"
              strokeWidth={2}
              dot={{ r: 4 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}
