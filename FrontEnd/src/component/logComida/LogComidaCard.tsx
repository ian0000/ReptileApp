import type { LogComidas, LogComidasId } from "../../api/ids";
import { RecordActions, RecordDate } from "../note/HistoryShared";
type Props = {
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
function remainingDays(createdAt?: string, interval?: number) {
  if (!createdAt || !interval) return null;
  const due = new Date(createdAt);
  due.setDate(due.getDate() + interval);
  return Math.ceil((due.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}
export default function LogComidaCard({
  log,
  isLatest,
  onClick,
  onDelete,
}: Props) {
  const days = isLatest ? remainingDays(log.createdAt, log.nextFeeding) : null;
  return (
    <article className="ra-record">
      <p className="ra-record-date">
        <RecordDate value={log.createdAt} />
      </p>
      <h2>
        {log.cantidad} {log.unidad ?? ""} · {log.tipoAlimento}
      </h2>
      <div className="ra-record-metrics">
        {log.metodo && <span>Método: {log.metodo}</span>}
        {log.apetito !== undefined && <span>Apetito: {log.apetito} de 5</span>}
        {log.excreto && <span>Excretó</span>}
        {log.suplemento && <span>Suplemento: {log.suplemento}</span>}
      </div>
      {days !== null && Number.isFinite(days) && (
        <p className="ra-record-tags">
          <span>
            {days < 0
              ? "Próxima comida: retrasada " +
                Math.abs(days) +
                (Math.abs(days) === 1 ? " día" : " días")
              : days === 0
                ? "Próxima comida: hoy"
                : "Próxima comida en " + days + (days === 1 ? " día" : " días")}
          </span>
        </p>
      )}
      {log.observaciones && <p>{log.observaciones}</p>}
      <RecordActions
        name={"comida de " + log.tipoAlimento}
        onEdit={onClick}
        onDelete={onDelete ? () => onDelete(log._id) : undefined}
      />
    </article>
  );
}
