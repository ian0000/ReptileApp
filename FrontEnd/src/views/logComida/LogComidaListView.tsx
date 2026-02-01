import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getLogComidas } from "../../api/LogComidasApi";
import { useEffect } from "react";

export default function LogComidaListView() {
  const params = useParams();
  const reptilId = params.id!;
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["logComidas", reptilId],
    queryFn: () => getLogComidas(reptilId),
  });
  useEffect(() => {
    if (isError) {
      navigate("/404", { replace: true });
    }
  }, [isError, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-gray-400 text-lg animate-pulse">Cargando reptil...</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }
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
              Historial Comidas del Reptil 📝
            </h1>
            <p className="text-gray-500 mt-2 text-lg">Registra y administra</p>
            {/* GRID */}
            {data.length ? (
              <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.map((log) => (
                  <li key={log._id}></li>
                ))}
              </ul>
            ) : (
              <p>Sin datos</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
