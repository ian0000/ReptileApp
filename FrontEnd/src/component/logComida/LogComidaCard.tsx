import type { LogComidas, LogComidasId } from "../../api/ids";

type LogComidaCardProps = {
  log: Pick<
    LogComidas,
    | "_id"
    | "cantidad"
    | "unidad"
    | "tipoAlimento"
    | "metodo"
    | "suplemento"
    | "apetito"
    | "excreto"
    | "observaciones"
    | "nextFeeding"
    | "createdAt"
  >;

  isLatest: boolean;
  onClick?: () => void;
  onDelete?: (id: LogComidasId) => void;
};
function AppetiteStars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < value ? "text-amber-500" : "text-gray-300"}>
          ★
        </span>
      ))}
    </div>
  );
}

function getRemainingFeedingDays(createdAt?: string, nextFeeding?: number) {
  if (!createdAt || !nextFeeding) return null;

  const created = new Date(createdAt);
  const due = new Date(created);
  due.setDate(due.getDate() + nextFeeding);

  const diffMs = due.getTime() - Date.now();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return diffDays; // 👈 ahora puede ser positivo, 0 o negativo
}

export default function LogComidaCard({ log, isLatest, onClick, onDelete }: LogComidaCardProps) {
  const remainingDays = isLatest ? getRemainingFeedingDays(log.createdAt, log.nextFeeding) : null;
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

      <div className="relative space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-gray-800">
              {log.cantidad} {log.unidad ?? ""} · {log.tipoAlimento}
            </h3>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
              {log.metodo && <span className="capitalize">🖐️ {log.metodo}</span>}

              {log.apetito !== undefined && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">Apetito</span>
                  <AppetiteStars value={log.apetito} />
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-2">
              {log.excreto && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Excretó
                </span>
              )}

              {log.suplemento && (
                <span className="text-xs font-semibold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                  🧪 {log.suplemento}
                </span>
              )}

              {/* Próxima comida */}
              {remainingDays !== null && (
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full
      ${
        remainingDays < 0
          ? "bg-red-200 text-red-800"
          : remainingDays === 0
          ? "bg-red-100 text-red-700"
          : remainingDays <= 2
          ? "bg-amber-100 text-amber-700"
          : "bg-emerald-100 text-emerald-700"
      }`}
                >
                  {remainingDays < 0 &&
                    `⚠️ Retrasado ${Math.abs(remainingDays)} día${
                      Math.abs(remainingDays) > 1 ? "s" : ""
                    }`}
                  {remainingDays === 0 && "🍽️ Toca hoy"}
                  {remainingDays > 0 &&
                    `🍽️ Próxima comida en ${remainingDays} día${remainingDays > 1 ? "s" : ""}`}
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

        {log.observaciones && (
          <p className="text-sm text-gray-600 line-clamp-2">{log.observaciones}</p>
        )}
      </div>
    </div>
  );
}
