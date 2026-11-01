import type { NoteId } from "../../api/ids";
import type { NoteListItem } from "../../api/NotesApi";
import { RecordActions, RecordDate } from "./HistoryShared";
type Props = {
  note: NoteListItem;
  onClick?: () => void;
  onDelete?: (id: NoteId) => void;
};
export default function NoteCard({ note, onClick, onDelete }: Props) {
  return (
    <article className="ra-record">
      <p className="ra-record-date">
        <RecordDate value={note.createdAt} />
      </p>
      <h2>{note.name}</h2>
      <div className="ra-record-tags">
        <span>{note.type ?? "Sin tipo"}</span>
        {note.tags && <span>{note.tags}</span>}
      </div>
      {note.description && <p>{note.description}</p>}
      <div className="ra-record-metrics">
        {note.temp !== undefined && <span>Temperatura: {note.temp} °C</span>}
        {note.humidity !== undefined && <span>Humedad: {note.humidity} %</span>}
        {note.weight !== undefined && (
          <span>Peso registrado: {note.weight}</span>
        )}
      </div>
      {note.createdBy?.name && (
        <p className="ra-record-author">Creado por {note.createdBy.name}</p>
      )}
      <RecordActions
        name={"nota " + note.name}
        onEdit={onClick}
        onDelete={onDelete ? () => onDelete(note._id) : undefined}
      />
    </article>
  );
}
