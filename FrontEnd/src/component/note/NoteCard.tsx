import type { NoteId } from "../../api/ids";
import type { NoteListItem } from "../../api/NotesApi";

type NoteCardProps = {
  note: NoteListItem;
  onClick?: () => void;

  onDelete?: (noteId: NoteId) => void;
};
function isRecent(date?: string) {
  if (!date) return false;
  const ONE_DAY = 1000 * 60 * 60 * 24;
  return Date.now() - new Date(date).getTime() < ONE_DAY;
}

export default function NoteCard({ note, onClick, onDelete }: NoteCardProps) {
  const recent = isRecent(note.createdAt);

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer relative rounded-2xl bg-white p-5
                  shadow-sm hover:shadow-lg transition
                  border group
                  ${recent ? "border-emerald-300 ring-1 ring-emerald-200" : "border-gray-100"}`}
    >
      {/* Glow */}
      <div
        className={`absolute -top-16 -right-16 w-32 h-32
                    rounded-full blur-3xl transition
                    ${recent ? "bg-emerald-400/20" : "bg-emerald-400/10"}`}
      />

      <div className="relative space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-gray-800 text-lg leading-snug">{note.name}</h3>

            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {/* Tipo */}
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full
                               bg-emerald-100 text-emerald-700 capitalize"
              >
                {note.type ?? "sin tipo"}
              </span>

              {/* Tag */}
              {note.tags && (
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full
                                 bg-sky-100 text-sky-700"
                >
                  {note.tags}
                </span>
              )}

              {/* Reciente */}
              {recent && (
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full
                                 bg-emerald-500 text-white"
                >
                  Nueva
                </span>
              )}
            </div>
          </div>

          {/* Fecha + eliminar */}
          <div className="flex flex-col items-end gap-2">
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : ""}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(note._id);
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

        {/* Métricas */}
        {(note.temp || note.humidity || note.weight) && (
          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
            {note.temp !== undefined && <span>🌡️ {note.temp}°C</span>}
            {note.humidity !== undefined && <span>💧 {note.humidity}%</span>}
            {note.weight !== undefined && <span>⚖️ {note.weight}</span>}
          </div>
        )}

        {/* Autor */}
        {note.createdBy?.name && (
          <div className="text-xs text-gray-400">
            Creado por <span className="font-semibold">{note.createdBy.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
