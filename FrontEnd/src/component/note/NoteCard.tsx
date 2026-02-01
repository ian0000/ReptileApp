import type { Note, NoteId } from "../../api/ids";

type NoteCardProps = {
  note: Pick<Note, "_id" | "name" | "type" | "createdAt">;
  onClick?: () => void;

  onDelete?: (noteId: NoteId) => void;
};

export default function NoteCard({ note, onClick, onDelete }: NoteCardProps) {
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
                   bg-emerald-400/10 rounded-full blur-3xl
                   opacity-70 group-hover:opacity-100 transition"
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-gray-800 text-lg leading-snug">{note.name}</h3>

            <p className="text-sm text-gray-500 capitalize mt-1">{note.type ?? "Sin tipo"}</p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : ""}
            </span>

            {/* Botón eliminar */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // 🔥 clave
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
      </div>
    </div>
  );
}
