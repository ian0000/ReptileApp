import type { LogPesaje, LogPesajeId } from "../../api/ids";
import { RecordActions, RecordDate } from "../note/HistoryShared";
type Props = {
  log: Pick<
    LogPesaje,
    | "_id"
    | "peso"
    | "unidad"
    | "contexto"
    | "observaciones"
    | "createdBy"
    | "createdAt"
  >;
  onClick?: () => void;
  onDelete?: (id: LogPesajeId) => void;
};
export default function LogPesajeCard({ log, onClick, onDelete }: Props) {
  return (
    <article className="ra-record">
      <p className="ra-record-date">
        <RecordDate value={log.createdAt} />
      </p>
      <h2>
        {log.peso}{" "}
        <span className="ra-record-unit">
          {log.unidad ?? "Unidad no especificada"}
        </span>
      </h2>
      {log.contexto && <p>{log.contexto}</p>}
      {log.observaciones && <p>{log.observaciones}</p>}
      {log.createdBy?.name && (
        <p className="ra-record-author">Creado por {log.createdBy.name}</p>
      )}
      <RecordActions
        name={"pesaje de " + log.peso + " " + (log.unidad ?? "sin unidad")}
        onEdit={onClick}
        onDelete={onDelete ? () => onDelete(log._id) : undefined}
      />
    </article>
  );
}
