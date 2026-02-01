import { useNavigate, useParams } from "react-router-dom";

export default function LogPesajeListView() {
  const params = useParams();
  const reptilId = params.id!;
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-3 inline-flex items-center gap-2
                   text-sm font-semibold text-gray-500
                   hover:text-emerald-600 transition"
            >
              ← Volver
            </button>

            <h1 className="text-4xl font-extrabold text-gray-900">
              Historial Pesajes del Reptil 📝
            </h1>

            <p className="text-gray-500 mt-2 text-lg">Registra cuando se pese al reptil</p>
          </div>
        </div>
      </div>
    </div>
  );
}
