import type { LogComidas, LogComidasId } from "../../api/ids";

type LogComidaCardProps = {
  log: Pick<
    LogComidas,
    "_id" | "cantidad" | "unidad" | "tipoAlimento" | "metodo" | "apetito" | "excreto" | "createdAt"
  >;
  onClick?: () => void;
  onDelete?: (id: LogComidasId) => void;
};

export default function LogComidaCard({ log, onClick, onDelete }: LogComidaCardProps) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer relative rounded-2xl bg-white p-5
                 shadow-sm hover:shadow-lg transition
                 border border-gray-100 group"
    >
      {/* Glow */}
      <div
        className="absolute -top-16 -right-16 w-32 h-32
                   bg-amber-400/10 rounded-full blur-3xl
                   opacity-70 group-hover:opacity-100 transition"
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-gray-800">
              {log.cantidad} {log.unidad ?? ""} · {log.tipoAlimento}
            </h3>

            <div className="text-sm text-gray-500 mt-1 space-x-2">
              {log.metodo && <span>{log.metodo}</span>}
              {log.apetito && <span>⭐ {log.apetito}</span>}
            </div>

            {log.excreto && (
              <span
                className="inline-block mt-2
                               text-xs font-semibold
                               text-emerald-700
                               bg-emerald-100
                               px-2 py-0.5 rounded-full"
              >
                Excretó
              </span>
            )}
          </div>

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
      </div>
    </div>
  );
}
