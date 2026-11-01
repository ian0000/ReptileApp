import { useId } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { LogComidasFormData } from "../../types";
import { schemas } from "../../api/client";
import { FormField } from "../../design-system/forms";
type Props = {
  register: UseFormRegister<LogComidasFormData>;
  errors: FieldErrors<LogComidasFormData>;
};
export default function LogComidaForm({ register, errors }: Props) {
  const prefix = useId();
  return (
    <div className="ra-history-fields">
      <FormField
        id={prefix + "-cantidad"}
        label="Cantidad"
        error={errors.cantidad?.message}
      >
        <input
          id={prefix + "-cantidad"}
          className="ra-input"
          type="number"
          aria-invalid={!!errors.cantidad}
          aria-describedby={
            errors.cantidad ? prefix + "-cantidad-error" : undefined
          }
          {...register("cantidad", {
            required: "La cantidad es obligatoria",
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
            })}
          >
            <option value="">Sin unidad</option>
            {schemas.Unidad.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
        <FormField
          id={prefix + "-tipoAlimento"}
          label="Tipo de alimento"
          error={errors.tipoAlimento?.message}
        >
          <select
            id={prefix + "-tipoAlimento"}
            className="ra-input"
            aria-invalid={!!errors.tipoAlimento}
            aria-describedby={
              errors.tipoAlimento ? prefix + "-tipoAlimento-error" : undefined
            }
            {...register("tipoAlimento", {
              setValueAs: (value) => (value === "" ? undefined : value),
              required: "Selecciona el alimento",
            })}
          >
            {schemas.TipoAlimento.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
        <FormField
          id={prefix + "-metodo"}
          label="Método"
          error={errors.metodo?.message}
        >
          <select
            id={prefix + "-metodo"}
            className="ra-input"
            aria-invalid={!!errors.metodo}
            aria-describedby={
              errors.metodo ? prefix + "-metodo-error" : undefined
            }
            {...register("metodo", {
              setValueAs: (value) => (value === "" ? undefined : value),
            })}
          >
            <option value="">Sin método</option>
            {schemas.MetodoAlimentacion.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
        <FormField
          id={prefix + "-apetito"}
          label="Apetito"
          error={errors.apetito?.message}
        >
          <select
            id={prefix + "-apetito"}
            className="ra-input"
            aria-invalid={!!errors.apetito}
            aria-describedby={
              errors.apetito ? prefix + "-apetito-error" : undefined
            }
            {...register("apetito", {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
          >
            <option value="">No especificado</option>
            <option value={1}>1 · Muy bajo</option>
            <option value={2}>2 · Bajo</option>
            <option value={3}>3 · Normal</option>
            <option value={4}>4 · Bueno</option>
            <option value={5}>5 · Excelente</option>
          </select>
        </FormField>
      </div>
      <label className="ra-history-check" htmlFor={prefix + "-excreto"}>
        <input
          id={prefix + "-excreto"}
          type="checkbox"
          {...register("excreto")}
        />
        Excretó
      </label>
      <FormField
        id={prefix + "-suplemento"}
        label="Suplemento"
        error={errors.suplemento?.message}
      >
        <input
          id={prefix + "-suplemento"}
          className="ra-input"
          type="text"
          aria-invalid={!!errors.suplemento}
          aria-describedby={
            errors.suplemento ? prefix + "-suplemento-error" : undefined
          }
          {...register("suplemento")}
        />
      </FormField>
      <FormField
        id={prefix + "-nextFeeding"}
        label="Próxima comida (días)"
        error={errors.nextFeeding?.message}
      >
        <input
          id={prefix + "-nextFeeding"}
          className="ra-input"
          type="number"
          aria-invalid={!!errors.nextFeeding}
          aria-describedby={
            errors.nextFeeding ? prefix + "-nextFeeding-error" : undefined
          }
          {...register("nextFeeding", {
            setValueAs: (value) => (value === "" ? undefined : Number(value)),
          })}
          min={1}
          step={1}
        />
      </FormField>
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
