import type { LogPesaje, LogPesajeId } from "../../api/ids";

type LogPesajeCardProps = {
  log: Pick<
    LogPesaje,
    "_id" | "peso" | "unidad" | "contexto" | "observaciones" | "createdBy" | "createdAt"
  >;
  onClick?: () => void;
  onDelete?: (id: LogPesajeId) => void;
};
export default function LogPesajeCard({ log, onClick, onDelete }: LogPesajeCardProps) {
  const recent =
    log.createdAt && Date.now() - new Date(log.createdAt).getTime() < 1000 * 60 * 60 * 24;

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer relative rounded-2xl bg-white p-5
                  shadow-sm hover:shadow-lg transition
                  border group
                  ${recent ? "border-sky-300 ring-1 ring-sky-200" : "border-gray-100"}`}
    >
      {/* Glow */}
      <div
        className={`absolute -top-16 -right-16 w-32 h-32
                    rounded-full blur-3xl transition
                    ${recent ? "bg-sky-400/20" : "bg-sky-400/10"}`}
      />

      <div className="relative space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            {/* Peso */}
            <div className="flex items-end gap-2">
              <span className="text-2xl font-extrabold text-gray-800">{log.peso}</span>
              <span className="text-base font-semibold text-gray-500">{log.unidad}</span>
            </div>

            {/* Contexto */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {log.contexto && (
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full
                                 bg-sky-100 text-sky-700"
                >
                  {log.contexto}
                </span>
              )}

              {recent && (
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full
                                 bg-sky-500 text-white"
                >
                  Nuevo
                </span>
              )}
            </div>
          </div>

          {/* Fecha + eliminar */}
          <div className="flex flex-col items-end gap-2">
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {log.createdAt ? new Date(log.createdAt).toLocaleDateString() : ""}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(log._id);
              }}
              className="opacity-0 group-hover:opacity-100
                         text-xs font-semibold
                         text-red-500 hover:text-red-700
                         transition"
            >
              Eliminar
            </button>
          </div>
        </div>

        {/* Observaciones */}
        {log.observaciones && (
          <p className="text-sm text-gray-600 line-clamp-2">{log.observaciones}</p>
        )}
      </div>
    </div>
  );
}
