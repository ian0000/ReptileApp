import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { useReptil } from "../../hooks/useReptil";
import Dialog from "../../design-system/Dialog";
import { FormNotice, SubmitButton } from "../../design-system/forms";
import "./histories.css";
import { recordError } from "./recordError";
export function RecordDate({ value }: { value?: string }) {
  if (!value || Number.isNaN(new Date(value).getTime()))
    return <span>Fecha no disponible</span>;
  return (
    <time dateTime={value}>
      {new Date(value).toLocaleString("es", {
        dateStyle: "medium",
        timeStyle: "short",
      })}
    </time>
  );
}
export function RecordActions({
  onEdit,
  onDelete,
  name,
}: {
  onEdit?: () => void;
  onDelete?: () => void;
  name: string;
}) {
  return (
    <div className="ra-record-actions">
      {onEdit && (
        <button type="button" onClick={onEdit} aria-label={"Editar " + name}>
          Editar
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          className="ra-record-delete"
          onClick={onDelete}
          aria-label={"Eliminar " + name}
        >
          Eliminar
        </button>
      )}
    </div>
  );
}
export function HistoryFrame({
  reptilId,
  title,
  description,
  onCreate,
  createLabel,
  children,
}: {
  reptilId: string;
  title: string;
  description: string;
  onCreate: () => void;
  createLabel: string;
  children: ReactNode;
}) {
  const reptile = useReptil(reptilId);
  return (
    <section className="ra-history" aria-labelledby="history-title">
      <Link className="ra-history-back" to={"/reptiles/" + reptilId}>
        Volver a la ficha del reptil
      </Link>
      <div className="ra-history-heading">
        <div>
          <p className="ra-history-animal">
            {reptile.data?.name ??
              (reptile.isLoading
                ? "Cargando ejemplar…"
                : "Historial del ejemplar")}
          </p>
          <h1 id="history-title">{title}</h1>
          <p>{description}</p>
        </div>
        <button type="button" className="ra-submit" onClick={onCreate}>
          {createLabel}
        </button>
      </div>
      <nav className="ra-history-nav" aria-label="Historiales del reptil">
        <NavLink to={"/reptiles/" + reptilId + "/comidas"}>Comidas</NavLink>
        <NavLink to={"/reptiles/" + reptilId + "/pesajes"}>Pesajes</NavLink>
        <NavLink to={"/reptiles/" + reptilId + "/notas"}>Notas</NavLink>
      </nav>
      {children}
    </section>
  );
}
export function DeleteRecordDialog({
  open,
  title,
  pending,
  error,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  pending: boolean;
  error: unknown;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!pending) onClose();
      }}
      title={title}
      description="Esta acción elimina el registro y no se puede deshacer. Los demás registros se conservarán."
    >
      {Boolean(error) && (
        <FormNotice tone="error">{recordError(error)}</FormNotice>
      )}
      <div className="ra-record-dialog-actions">
        <button
          type="button"
          className="ra-record-cancel"
          disabled={pending}
          onClick={onClose}
          data-autofocus
        >
          Cancelar
        </button>
        <SubmitButton
          type="button"
          className="ra-record-danger"
          pending={pending}
          pendingLabel="Eliminando…"
          onClick={onConfirm}
        >
          Eliminar registro
        </SubmitButton>
      </div>
    </Dialog>
  );
}
