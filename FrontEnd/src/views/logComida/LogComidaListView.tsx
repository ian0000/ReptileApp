import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { getLogComidas } from "../../api/LogComidasApi";
import type { LogComidasId } from "../../api/ids";
import { useDeleteLogComidas } from "../../hooks/useDeleteLogComidas";
import LogComidaCard from "../../component/logComida/LogComidaCard";
import LogComidaFormModal from "../../component/logComida/logComidaFormModal";
import {
  HistoryFrame,
  DeleteRecordDialog,
} from "../../component/note/HistoryShared";
import { recordError } from "../../component/note/recordError";
import { FormNotice } from "../../design-system/forms";

export default function LogComidaListView() {
  const reptilId = useParams().id!;
  const query = useQuery({
    queryKey: ["logComidas", reptilId],
    queryFn: () => getLogComidas(reptilId),
  });
  const deleteMutation = useDeleteLogComidas(reptilId);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<LogComidasId | null>(null);
  const [toDelete, setToDelete] = useState<LogComidasId | null>(null);
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
      title="Comidas"
      description="Alimentos, cantidades y próximos registros por ejemplar."
      createLabel="Registrar comida"
      onCreate={() => {
        setSelected(null);
        setOpen(true);
      }}
    >
      {query.isLoading ? (
        <p className="ra-history-loading" role="status">
          Cargando comidas…
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
            {rows.map((log, index) => (
              <li key={log._id}>
                <LogComidaCard
                  log={log}
                  isLatest={index === 0}
                  onClick={() => {
                    setSelected(log._id);
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
          Todavía no hay comidas registradas. Añade el primer registro.
        </p>
      )}
      {open && (
        <LogComidaFormModal
          reptilId={reptilId}
          logId={selected ?? undefined}
          onClose={close}
        />
      )}
      <DeleteRecordDialog
        open={Boolean(toDelete)}
        title="Eliminar comida"
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
