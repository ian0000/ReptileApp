import { useId } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { LogPesajeFormData } from "../../types";
import { schemas } from "../../api/client";
import { FormField } from "../../design-system/forms";
type Props = {
  register: UseFormRegister<LogPesajeFormData>;
  errors: FieldErrors<LogPesajeFormData>;
};
export default function LogPesajeForm({ register, errors }: Props) {
  const prefix = useId();
  return (
    <div className="ra-history-fields">
      <FormField
        id={prefix + "-peso"}
        label="Peso"
        error={errors.peso?.message}
      >
        <input
          id={prefix + "-peso"}
          className="ra-input"
          type="number"
          aria-invalid={!!errors.peso}
          aria-describedby={errors.peso ? prefix + "-peso-error" : undefined}
          {...register("peso", {
            required: "El peso es obligatorio",
            valueAsNumber: true,
          })}
          step="0.01"
        />
      </FormField>
      <div className="ra-history-form-grid">
        <FormField
          id={prefix + "-unidad"}
          label="Unidad"
          error={errors.unidad?.message}
        >
          <select
            id={prefix + "-unidad"}
            className="ra-input"
            aria-invalid={!!errors.unidad}
            aria-describedby={
              errors.unidad ? prefix + "-unidad-error" : undefined
            }
            {...register("unidad", {
              setValueAs: (value) => (value === "" ? undefined : value),
              required: "Selecciona una unidad",
            })}
          >
            <option value="">Seleccionar unidad</option>
            {schemas.Unidad.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
        <FormField
          id={prefix + "-contexto"}
          label="Contexto"
          error={errors.contexto?.message}
        >
          <select
            id={prefix + "-contexto"}
            className="ra-input"
            aria-invalid={!!errors.contexto}
            aria-describedby={
              errors.contexto ? prefix + "-contexto-error" : undefined
            }
            {...register("contexto", {
              setValueAs: (value) => (value === "" ? undefined : value),
            })}
          >
            <option value="">Sin contexto</option>
            {schemas.ContextoPesaje.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
      </div>
      <FormField
        id={prefix + "-observaciones"}
        label="Observaciones"
        error={errors.observaciones?.message}
      >
        <textarea
          id={prefix + "-observaciones"}
          className="ra-input"
          rows={3}
          aria-invalid={!!errors.observaciones}
          aria-describedby={
            errors.observaciones ? prefix + "-observaciones-error" : undefined
          }
          {...register("observaciones")}
        />
      </FormField>
    </div>
  );
}
