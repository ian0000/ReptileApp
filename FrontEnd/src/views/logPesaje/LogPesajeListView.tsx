import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLogPesajes } from "../../api/LogPesajeApi";
import type { LogPesajeId } from "../../api/ids";
import LogPesajeFormModal from "../../component/logPesaje/LogPesajeFormModal";
import { useDeleteLogPesaje } from "../../hooks/useDeleteLogPesaje";
import LogPesajeCard from "../../component/logPesaje/LogPesajeCard";
import LogPesajeChart from "../../component/logPesaje/LogPesajeChart";

export default function LogPesajeListView() {
  const params = useParams();
  const reptilId = params.id!;
  const navigate = useNavigate();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["logPesajes", reptilId],
    queryFn: () => getLogPesajes(reptilId),
  });

  const deleteMutation = useDeleteLogPesaje(reptilId);

  const [open, setOpen] = useState(false);
  const [selectedLogPesaje, setSelectedLogPesaje] = useState<LogPesajeId | null>(null);
  const [logPesajeToDelete, setLogPesajeToDelete] = useState<LogPesajeId | null>(null);
  useEffect(() => {
    if (isError) {
      navigate("/404", { replace: true });
    }
  }, [isError, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-gray-400 text-lg animate-pulse">Cargando rept3il...</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }
  const chartData = [...data]
    .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime())
    .map((log) => ({
      date: new Date(log.createdAt!).toLocaleDateString(),
      peso: log.peso,
    }));
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
          <button
            onClick={() => {
              setSelectedLogPesaje(null);
              setOpen(true);
            }}
            className="mt-6 sm:mt-0 inline-flex items-center gap-2
               bg-gradient-to-r from-emerald-500 to-sky-500
               hover:from-emerald-600 hover:to-sky-600
               text-white font-bold
               px-6 py-3 rounded-xl
               shadow-lg transition-all
               transform hover:-translate-y-0.5"
          >
            + Nuevo Log
          </button>
        </div>
        {/* Chart */}
        {data.length > 1 && <LogPesajeChart data={chartData} />}
        {/* GRID */}
        {data.length ? (
          <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((log) => (
              <li key={log._id}>
                {/* Glow */}
                <LogPesajeCard
                  log={log}
                  onClick={() => {
                    setSelectedLogPesaje(log._id);
                    setOpen(true);
                  }}
                  onDelete={(id) => setLogPesajeToDelete(id)}
                ></LogPesajeCard>
              </li>
            ))}
          </ul>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-14 text-center">
            <p className="text-gray-500 text-xl">Este reptil no tiene logs</p>
            <button
              onClick={() => {
                setSelectedLogPesaje(null);
                setOpen(true);
              }}
              className="inline-block mt-6 font-bold text-emerald-600 hover:underline"
            >
              Agrega la primera nota 📝
            </button>
          </div>
        )}
        {/* Modal */}
        {open && (
          <LogPesajeFormModal
            reptilId={reptilId}
            logId={selectedLogPesaje ?? undefined}
            onClose={() => {
              setOpen(false);
              setSelectedLogPesaje(null);
            }}
          />
        )}
        {/* Log */}
        {logPesajeToDelete && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm
                  flex items-center justify-center px-4"
          >
            <div className="bg-white rounded-2xl max-w-sm w-full shadow-xl">
              <div className="p-6">
                <h3 className="text-lg font-extrabold text-gray-900">Eliminar Log</h3>

                <p className="text-sm text-gray-600 mt-2">
                  Esta acción no se puede deshacer. ¿Deseas continuar?
                </p>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setLogPesajeToDelete(null)}
                    className="px-4 py-2 rounded-lg
                       text-gray-600 font-semibold
                       hover:bg-gray-100 transition"
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={async () => {
                      deleteMutation.mutate(logPesajeToDelete!);
                      setLogPesajeToDelete(null);
                    }}
                    className="px-4 py-2 rounded-xl
                       bg-red-600 hover:bg-red-700
                       text-white font-bold transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
