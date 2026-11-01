import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { LogPesajeId, ReptilId } from "../../api/ids";
import type { LogPesajeFormData } from "../../types";
import { useLogPesaje } from "../../hooks/useLogPesaje";
import { useCreateLogPesaje } from "../../hooks/useCreateLogPesaje";
import { useUpdateLogPesaje } from "../../hooks/useUpdateLogPesaje";
import Dialog from "../../design-system/Dialog";
import { FormNotice, SubmitButton } from "../../design-system/forms";
import { recordError } from "../note/recordError";
import LogPesajeForm from "./LogPesajeForm";
type Props = { reptilId: ReptilId; logId?: LogPesajeId; onClose: () => void };
const initialValues: LogPesajeFormData = {
  peso: 1,
  unidad: undefined,
  contexto: undefined,
  observaciones: "",
};
export default function LogPesajeFormModal({
  reptilId,
  logId,
  onClose,
}: Props) {
  const isEdit = Boolean(logId);
  const query = useLogPesaje(reptilId, logId, { enabled: isEdit });
  const createMutation = useCreateLogPesaje(reptilId, onClose);
  const updateMutation = useUpdateLogPesaje(reptilId, logId!, onClose);
  const mutation = isEdit ? updateMutation : createMutation;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<LogPesajeFormData>({ defaultValues: initialValues });
  useEffect(() => {
    if (!isEdit) return;
    if (query.data && !isDirty)
      reset({
        peso: query.data.peso,
        unidad: query.data.unidad,
        contexto: query.data.contexto,
        observaciones: query.data.observaciones,
      });
  }, [isEdit, query.data, isDirty, reset]);
  const handleForm = (formData: LogPesajeFormData) => {
    if (!mutation.isPending) mutation.mutate(formData);
  };
  return (
    <Dialog
      open
      onClose={() => {
        if (!mutation.isPending) onClose();
      }}
      title={isEdit ? "Editar pesaje" : "Registrar pesaje"}
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
            <LogPesajeForm register={register} errors={errors} />
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
              Guardar pesaje
            </SubmitButton>
          </div>
        </form>
      )}
    </Dialog>
  );
}
