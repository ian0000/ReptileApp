import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { getNotes } from "../../api/NotesApi";
import type { NoteId } from "../../api/ids";
import { useDeleteNote } from "../../hooks/useDeleteNote";
import NoteCard from "../../component/note/NoteCard";
import NoteFormModal from "../../component/note/NoteFormModal";
import {
  HistoryFrame,
  DeleteRecordDialog,
} from "../../component/note/HistoryShared";
import { recordError } from "../../component/note/recordError";
import { FormNotice } from "../../design-system/forms";

export default function NoteListView() {
  const reptilId = useParams().id!;
  const query = useQuery({
    queryKey: ["notes", reptilId],
    queryFn: () => getNotes(reptilId),
  });
  const deleteMutation = useDeleteNote(reptilId);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<NoteId | null>(null);
  const [toDelete, setToDelete] = useState<NoteId | null>(null);
  const close = () => {
    setOpen(false);
    setSelected(null);
  };
  const rows = [...(query.data ?? [])].sort(
    (a, b) =>
      new Date(b.createdAt ?? 0).getTime() -
      new Date(a.createdAt ?? 0).getTime(),
  );
  return (
    <HistoryFrame
      reptilId={reptilId}
      title="Notas"
      description="Observaciones y notas del cuidado de este ejemplar."
      createLabel="Registrar nota"
      onCreate={() => {
        setSelected(null);
        setOpen(true);
      }}
    >
      {query.isLoading ? (
        <p className="ra-history-loading" role="status">
          Cargando notas…
        </p>
      ) : query.isError ? (
        <FormNotice tone="error">
          {recordError(query.error)}{" "}
          <button
            className="ra-history-retry"
            type="button"
            onClick={() => void query.refetch()}
            disabled={query.isFetching}
          >
            {query.isFetching ? "Reintentando…" : "Reintentar"}
          </button>
        </FormNotice>
      ) : rows.length ? (
        <>
          <ul className="ra-history-grid">
            {rows.map((note) => (
              <li key={note._id}>
                <NoteCard
                  note={note}
                  onClick={() => {
                    setSelected(note._id);
                    setOpen(true);
                  }}
                  onDelete={(id) => {
                    deleteMutation.reset();
                    setToDelete(id);
                  }}
                />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="ra-history-empty">
          Todavía no hay notas. Registra la primera observación.
        </p>
      )}
      {open && (
        <NoteFormModal
          reptilId={reptilId}
          noteId={selected ?? undefined}
          onClose={close}
        />
      )}
      <DeleteRecordDialog
        open={Boolean(toDelete)}
        title="Eliminar nota"
        pending={deleteMutation.isPending}
        error={deleteMutation.error}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete && !deleteMutation.isPending)
            deleteMutation.mutate(toDelete, {
              onSuccess: () => setToDelete(null),
            });
        }}
      />
    </HistoryFrame>
  );
}
