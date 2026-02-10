import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getNotes } from "../../api/NotesApi";
import { useEffect, useState } from "react";
import NoteFormModal from "../../component/note/NoteFormModal";
import type { NoteId } from "../../api/ids";
import NoteCard from "../../component/note/NoteCard";
import { useDeleteNote } from "../../hooks/useDeleteNote";

export default function NoteListView() {
  const params = useParams();
  const reptilId = params.id!;
  const navigate = useNavigate();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["notes", reptilId],
    queryFn: () => getNotes(reptilId),
  });

  const deleteMutation = useDeleteNote(reptilId);

  const [open, setOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<NoteId | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<NoteId | null>(null);

  useEffect(() => {
    if (isError) {
      navigate("/404", { replace: true });
    }
  }, [isError, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-gray-400 text-lg animate-pulse">Cargando reptil...</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }
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

            <h1 className="text-4xl font-extrabold text-gray-900">Notas del Reptil 📝</h1>

            <p className="text-gray-500 mt-2 text-lg">
              Registra y administra observaciones importantes
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedNote(null);
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
            + Nueva Nota
          </button>
        </div>

        {/* Grid */}
        {data.length ? (
          <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((note) => (
              <li key={note._id}>
                {/* Glow */}
                <NoteCard
                  note={note}
                  onClick={() => {
                    setSelectedNote(note._id);
                    setOpen(true);
                  }}
                  onDelete={(id) => setNoteToDelete(id)}
                ></NoteCard>
              </li>
            ))}
          </ul>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-14 text-center">
            <p className="text-gray-500 text-xl">Este reptil no tiene notas</p>
            <button
              onClick={() => {
                setSelectedNote(null);
                setOpen(true);
              }}
              className="inline-block mt-6 font-bold text-emerald-600 hover:underline"
            >
              Agrega la primera nota 📝
            </button>
          </div>
        )}

        {/* Modal */}
        {open && (
          <NoteFormModal
            reptilId={reptilId}
            noteId={selectedNote ?? undefined}
            onClose={() => {
              setOpen(false);
              setSelectedNote(null);
            }}
          />
        )}
        {/* Nota */}
        {noteToDelete && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm
                  flex items-center justify-center px-4"
          >
            <div className="bg-white rounded-2xl max-w-sm w-full shadow-xl">
              <div className="p-6">
                <h3 className="text-lg font-extrabold text-gray-900">Eliminar nota</h3>

                <p className="text-sm text-gray-600 mt-2">
                  Esta acción no se puede deshacer. ¿Deseas continuar?
                </p>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setNoteToDelete(null)}
                    className="px-4 py-2 rounded-lg
                       text-gray-600 font-semibold
                       hover:bg-gray-100 transition"
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={async () => {
                      deleteMutation.mutate(noteToDelete!);
                      setNoteToDelete(null);
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
