import { useForm } from "react-hook-form";
import type { LogComidasId, ReptilId } from "../../api/ids";
import type { LogComidasFormData } from "../../types";
import { useEffect } from "react";
import { useLogComida } from "../../hooks/useLogComidas";
import { useCreateLogComidas } from "../../hooks/useCreateLogComidas";
import { useUpdateLogComidas } from "../../hooks/useUpdateLogComidas";
import LogComidaForm from "./LogComidaForm";

type LogComidaFormModalProps = {
  reptilId: ReptilId;
  logId?: LogComidasId;
  onClose: () => void;
};

export default function LogComidaFormModal({ reptilId, logId, onClose }: LogComidaFormModalProps) {
  const isEdit = Boolean(logId);
  const { data: log, isLoading } = useLogComida(reptilId, logId, {
    enabled: isEdit,
  });

  const createMutation = useCreateLogComidas(reptilId, onClose);
  const updateMutation = useUpdateLogComidas(reptilId, logId!, onClose);

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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LogComidasFormData>({ defaultValues: initialValues });

  useEffect(() => {
    if (!logId) {
      reset(initialValues);
      return;
    }
    if (log) {
      reset({
        cantidad: log.cantidad,
        unidad: log.unidad,
        tipoAlimento: log.tipoAlimento,
        suplemento: log.suplemento,
        metodo: log.metodo,
        observaciones: log.observaciones,
        excreto: log.excreto,
        apetito: log.apetito,
        nextFeeding: log.nextFeeding,
      });
    }
  }, [logId, log, reset]);
  const handleForm = (formData: LogComidasFormData) => {
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
            {isEdit ? "Editar Comida" : "Nueva Comida"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isEdit ? "Actualiza la información del log" : "Registra un nuevo log"}
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {isEdit && isLoading ? (
            <p className="text-center py-10 text-gray-500">Cargando logs</p>
          ) : (
            <form onSubmit={handleSubmit(handleForm)}>
              <LogComidaForm register={register} errors={errors} />

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
