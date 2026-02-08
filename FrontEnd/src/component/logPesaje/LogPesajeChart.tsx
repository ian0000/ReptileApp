import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type LogPesajeChartProps = {
  data: { date: string; peso: number }[];
};

export default function LogPesajeChart({ data }: LogPesajeChartProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-12">
      <h2 className="text-xl font-extrabold text-gray-900 mb-1">Evolución de peso</h2>
      <p className="text-sm text-gray-500 mb-6">Peso del reptil a lo largo del tiempo</p>

      <div className="w-full h-64">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={["dataMin - 5", "dataMax + 5"]} />

            <Tooltip formatter={(value) => [`${value} g`, "Peso"]} />
            <Line
              type="monotone"
              dataKey="peso"
              stroke="#10b981" // emerald-500
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
