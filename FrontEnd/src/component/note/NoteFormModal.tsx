import type { NoteFormData } from "../../types";
import { useCreateNote } from "../../hooks/useCreateNote";
import type { NoteId, ReptilId } from "../../api/ids";
import { useForm } from "react-hook-form";
import NoteForm from "./NoteForm";
import { useNote } from "../../hooks/useNote";
import { useUpdateNote } from "../../hooks/useUpdateNote";
import { useEffect } from "react";

type NoteFormModalProps = {
  reptilId: ReptilId;
  noteId?: NoteId; // opcional → create vs edit
  onClose: () => void;
};

export default function NoteFormModal({ reptilId, noteId, onClose }: NoteFormModalProps) {
  const isEdit = Boolean(noteId);
  const { data: note, isLoading } = useNote(reptilId, noteId, {
    enabled: isEdit,
  });

  const createMutation = useCreateNote(reptilId, onClose);
  const updateMutation = useUpdateNote(reptilId, noteId!, onClose);

  const initialValues: NoteFormData = {
    name: "",
    description: "",
    type: undefined,
    tags: undefined,
    weight: undefined,
    humidity: undefined,
    temp: undefined,
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormData>({
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (!noteId) {
      reset(initialValues);
      return;
    }

    if (note) {
      reset({
        name: note.name,
        description: note.description,
        type: note.type,
        tags: note.tags,
        weight: note.weight,
        temp: note.temp,
        humidity: note.humidity,
      });
    }
  }, [noteId, note, reset]);

  const handleForm = (formData: NoteFormData) => {
    if (isEdit) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm
                  flex items-center justify-center px-4"
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md
                    shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-extrabold text-gray-900">
            {isEdit ? "Editar Nota" : "Nueva Nota"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isEdit ? "Actualiza la información de la nota" : "Registra una nueva observación"}
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {isEdit && isLoading ? (
            <p className="text-center py-10 text-gray-500">Cargando nota…</p>
          ) : (
            <form onSubmit={handleSubmit(handleForm)}>
              <NoteForm register={register} errors={errors} />

              {/* Footer */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg
                           text-gray-600 font-semibold
                           hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl
                           bg-gradient-to-r from-emerald-500 to-sky-500
                           hover:from-emerald-600 hover:to-sky-600
                           text-white font-bold
                           shadow-md transition"
                >
                  Guardar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
