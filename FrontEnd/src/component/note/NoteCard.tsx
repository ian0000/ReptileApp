import type { Note } from "../../api/ids";

type NoteCardProps = {
  note: Pick<Note, "_id" | "name" | "type" | "createdAt">;
  onClick?: () => void;
};

export default function NoteCard({ note, onClick }: NoteCardProps) {
  return (
    <li
      onClick={onClick}
      className="cursor-pointer relative rounded-2xl bg-white p-5
               shadow-sm hover:shadow-lg transition
               border border-gray-100 group"
    >
      {/* Glow sutil */}
      <div
        className="absolute -top-16 -right-16 w-32 h-32
                 bg-emerald-400/10 rounded-full
                 blur-3xl opacity-70
                 group-hover:opacity-100 transition"
      />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-extrabold text-gray-800 text-lg leading-snug">{note.name}</h3>

            <p className="text-sm text-gray-500 capitalize mt-1">{note.type ?? "Sin tipo"}</p>
          </div>

          <span className="text-xs text-gray-400 whitespace-nowrap">
            {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : ""}
          </span>
        </div>
      </div>
    </li>
  );
}
