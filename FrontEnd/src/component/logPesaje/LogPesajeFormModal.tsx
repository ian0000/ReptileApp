import { useForm } from "react-hook-form";
import type { LogPesajeId, ReptilId } from "../../api/ids";
import { useCreateLogPesaje } from "../../hooks/useCreateLogPesaje";
import { useLogPesaje } from "../../hooks/useLogPesaje";
import { useUpdateLogPesaje } from "../../hooks/useUpdateLogPesaje";
import type { LogPesajeFormData } from "../../types";
import { useEffect } from "react";
import LogPesajeForm from "./LogPesajeForm";

type LogPesajeFormModalProps = {
  reptilId: ReptilId;
  logId?: LogPesajeId;
  onClose: () => void;
};

export default function LogPesajeFormModal({ reptilId, logId, onClose }: LogPesajeFormModalProps) {
  const isEdit = Boolean(logId);
  const { data: log, isLoading } = useLogPesaje(reptilId, logId, {
    enabled: isEdit,
  });

  const createMutation = useCreateLogPesaje(reptilId, onClose);
  const updateMutation = useUpdateLogPesaje(reptilId, logId!, onClose);

  const initialValues: LogPesajeFormData = {
    peso: 1,
    unidad: undefined,
    contexto: undefined,
    observaciones: "",
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LogPesajeFormData>({ defaultValues: initialValues });

  useEffect(() => {
    if (!logId) {
      reset(initialValues);
      return;
    }
    if (log) {
      reset({
        peso: log.peso,
        unidad: log.unidad,
        contexto: log.contexto,
        observaciones: log.observaciones,
      });
    }
  }, [logId, log, reset]);
  const handleForm = (formData: LogPesajeFormData) => {
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
              <LogPesajeForm register={register} errors={errors} />

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
