import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { LogComidasId, ReptilId } from "../../api/ids";
import type { LogComidasFormData } from "../../types";
import { useLogComida } from "../../hooks/useLogComidas";
import { useCreateLogComidas } from "../../hooks/useCreateLogComidas";
import { useUpdateLogComidas } from "../../hooks/useUpdateLogComidas";
import Dialog from "../../design-system/Dialog";
import { FormNotice, SubmitButton } from "../../design-system/forms";
import { recordError } from "../note/recordError";
import LogComidaForm from "./LogComidaForm";
type Props = { reptilId: ReptilId; logId?: LogComidasId; onClose: () => void };
const initialValues: LogComidasFormData = {
  cantidad: 1,
  unidad: undefined,
  tipoAlimento: "otro",
  suplemento: undefined,
  metodo: undefined,
  observaciones: "",
  excreto: false,
  apetito: undefined,
  nextFeeding: 1,
};
export default function LogComidaFormModal({
  reptilId,
  logId,
  onClose,
}: Props) {
  const isEdit = Boolean(logId);
  const query = useLogComida(reptilId, logId, { enabled: isEdit });
  const createMutation = useCreateLogComidas(reptilId, onClose);
  const updateMutation = useUpdateLogComidas(reptilId, logId!, onClose);
  const mutation = isEdit ? updateMutation : createMutation;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<LogComidasFormData>({ defaultValues: initialValues });
  useEffect(() => {
    if (!isEdit) return;
    if (query.data && !isDirty)
      reset({
        cantidad: query.data.cantidad,
        unidad: query.data.unidad,
        tipoAlimento: query.data.tipoAlimento,
        suplemento: query.data.suplemento,
        metodo: query.data.metodo,
        observaciones: query.data.observaciones,
        excreto: query.data.excreto,
        apetito: query.data.apetito,
        nextFeeding: query.data.nextFeeding,
      });
  }, [isEdit, query.data, isDirty, reset]);
  const handleForm = (formData: LogComidasFormData) => {
    if (!mutation.isPending) mutation.mutate(formData);
  };
  return (
    <Dialog
      open
      onClose={() => {
        if (!mutation.isPending) onClose();
      }}
      title={isEdit ? "Editar comida" : "Registrar comida"}
      description="Los cambios se guardarán en el historial de este ejemplar."
    >
      {isEdit && query.isLoading ? (
        <p role="status">Cargando registro…</p>
      ) : isEdit && query.isError ? (
        <FormNotice tone="error">
          {recordError(query.error)}{" "}
          <button
            type="button"
            className="ra-history-retry"
            onClick={() => void query.refetch()}
            disabled={query.isFetching}
          >
            Reintentar
          </button>
        </FormNotice>
      ) : (
        <form className="ra-form" onSubmit={handleSubmit(handleForm)}>
          {mutation.isError && (
            <FormNotice tone="error">{recordError(mutation.error)}</FormNotice>
          )}
          <fieldset
            disabled={mutation.isPending}
            className="ra-history-fieldset"
          >
            <legend className="sr-only">Datos del registro</legend>
            <LogComidaForm register={register} errors={errors} />
          </fieldset>
          <div className="ra-record-dialog-actions">
            <button
              className="ra-record-cancel"
              type="button"
              onClick={onClose}
              disabled={mutation.isPending}
            >
              Cancelar
            </button>
            <SubmitButton
              pending={mutation.isPending}
              pendingLabel="Guardando…"
            >
              Guardar comida
            </SubmitButton>
          </div>
        </form>
      )}
    </Dialog>
  );
}
