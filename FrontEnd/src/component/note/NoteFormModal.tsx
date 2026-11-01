import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { NoteId, ReptilId } from "../../api/ids";
import type { NoteFormData } from "../../types";
import { useNote } from "../../hooks/useNote";
import { useCreateNote } from "../../hooks/useCreateNote";
import { useUpdateNote } from "../../hooks/useUpdateNote";
import Dialog from "../../design-system/Dialog";
import { FormNotice, SubmitButton } from "../../design-system/forms";
import { recordError } from "../note/recordError";
import NoteForm from "./NoteForm";
type Props = { reptilId: ReptilId; noteId?: NoteId; onClose: () => void };
const initialValues: NoteFormData = {
  name: "",
  description: "",
  type: undefined,
  tags: undefined,
  weight: undefined,
  humidity: undefined,
  temp: undefined,
};
export default function NoteFormModal({ reptilId, noteId, onClose }: Props) {
  const isEdit = Boolean(noteId);
  const query = useNote(reptilId, noteId, { enabled: isEdit });
  const createMutation = useCreateNote(reptilId, onClose);
  const updateMutation = useUpdateNote(reptilId, noteId!, onClose);
  const mutation = isEdit ? updateMutation : createMutation;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<NoteFormData>({ defaultValues: initialValues });
  useEffect(() => {
    if (!isEdit) return;
    if (query.data && !isDirty)
      reset({
        name: query.data.name,
        description: query.data.description,
        type: query.data.type,
        tags: query.data.tags,
        weight: query.data.weight,
        humidity: query.data.humidity,
        temp: query.data.temp,
      });
  }, [isEdit, query.data, isDirty, reset]);
  const handleForm = (formData: NoteFormData) => {
    if (!mutation.isPending) mutation.mutate(formData);
  };
  return (
    <Dialog
      open
      onClose={() => {
        if (!mutation.isPending) onClose();
      }}
      title={isEdit ? "Editar nota" : "Registrar nota"}
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
            <NoteForm register={register} errors={errors} />
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
              Guardar nota
            </SubmitButton>
          </div>
        </form>
      )}
    </Dialog>
  );
}
