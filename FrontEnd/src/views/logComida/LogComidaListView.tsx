import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getLogComidas } from "../../api/LogComidasApi";
import { useEffect, useState } from "react";
import type { LogComidasId } from "../../api/ids";
import LogComidaFormModal from "../../component/logComida/logComidaFormModal";
import { useDeleteLogComidas } from "../../hooks/useDeleteLogComidas";
import LogComidaCard from "../../component/logComida/LogComidaCard";

export default function LogComidaListView() {
  const params = useParams();
  const reptilId = params.id!;
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["logComidas", reptilId],
    queryFn: () => getLogComidas(reptilId),
  });

  const deleteMutation = useDeleteLogComidas(reptilId);

  const [open, setOpen] = useState(false);
  const [selectedLogComida, setSelectedLogComida] = useState<LogComidasId | null>(null);
  const [logComidaToDelete, setLogComidaToDelete] = useState<LogComidasId | null>(null);

  useEffect(() => {
    if (isError) {
      navigate("/404", { replace: true });
    }
  }, [isError, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-gray-400 text-lg animate-pulse">Cargando r5eptil...</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }
  const sortedLogs = [...data].sort(
    (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
  );
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
          </div>
          <button
            onClick={() => {
              setSelectedLogComida(null);
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
        {/* GRID */}
        {data.length ? (
          <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedLogs.map((log, index) => (
              <li key={log._id}>
                {/* Glow */}
                <LogComidaCard
                  log={log}
                  isLatest={index === 0}
                  onClick={() => {
                    setSelectedLogComida(log._id);
                    setOpen(true);
                  }}
                  onDelete={(id) => setLogComidaToDelete(id)}
                ></LogComidaCard>
              </li>
            ))}
          </ul>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-14 text-center">
            <p className="text-gray-500 text-xl">Este reptil no tiene logs</p>
            <button
              onClick={() => {
                setSelectedLogComida(null);
                setOpen(true);
              }}
              className="inline-block mt-6 font-bold text-emerald-600 hover:underline"
            >
              Agrega el primer log 📝
            </button>
          </div>
        )}
        {/* Modal */}
        {open && (
          <LogComidaFormModal
            reptilId={reptilId}
            logId={selectedLogComida ?? undefined}
            onClose={() => {
              setOpen(false);
              setSelectedLogComida(null);
            }}
          />
        )}
        {/* Log */}
        {logComidaToDelete && (
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
                    onClick={() => setLogComidaToDelete(null)}
                    className="px-4 py-2 rounded-lg
                       text-gray-600 font-semibold
                       hover:bg-gray-100 transition"
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={async () => {
                      deleteMutation.mutate(logComidaToDelete!);
                      setLogComidaToDelete(null);
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
