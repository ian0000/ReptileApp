import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { getLogPesajes } from "../../api/LogPesajeApi";
import type { LogPesajeId } from "../../api/ids";
import { useDeleteLogPesaje } from "../../hooks/useDeleteLogPesaje";
import LogPesajeCard from "../../component/logPesaje/LogPesajeCard";
import LogPesajeFormModal from "../../component/logPesaje/LogPesajeFormModal";
import {
  HistoryFrame,
  DeleteRecordDialog,
} from "../../component/note/HistoryShared";
import { recordError } from "../../component/note/recordError";
import { FormNotice } from "../../design-system/forms";
import LogPesajeChart from "../../component/logPesaje/LogPesajeChart";
export default function LogPesajeListView() {
  const reptilId = useParams().id!;
  const query = useQuery({
    queryKey: ["logPesajes", reptilId],
    queryFn: () => getLogPesajes(reptilId),
  });
  const deleteMutation = useDeleteLogPesaje(reptilId);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<LogPesajeId | null>(null);
  const [toDelete, setToDelete] = useState<LogPesajeId | null>(null);
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
      title="Pesajes"
      description="Consulta el peso y su unidad original en cada registro."
      createLabel="Registrar pesaje"
      onCreate={() => {
        setSelected(null);
        setOpen(true);
      }}
    >
      {query.isLoading ? (
        <p className="ra-history-loading" role="status">
          Cargando pesajes…
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
          <LogPesajeChart
            data={rows.map((log) => ({
              date: log.createdAt,
              peso: log.peso,
              unidad: log.unidad,
            }))}
          />
          <ul className="ra-history-grid">
            {rows.map((log) => (
              <li key={log._id}>
                <LogPesajeCard
                  log={log}
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
          Todavía no hay pesajes. Registra el primero cuando lo necesites.
        </p>
      )}
      {open && (
        <LogPesajeFormModal
          reptilId={reptilId}
          logId={selected ?? undefined}
          onClose={close}
        />
      )}
      <DeleteRecordDialog
        open={Boolean(toDelete)}
        title="Eliminar pesaje"
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
