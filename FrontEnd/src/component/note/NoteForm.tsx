import { useId } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { NoteFormData } from "../../types";
import { schemas } from "../../api/client";
import { FormField } from "../../design-system/forms";
type Props = {
  register: UseFormRegister<NoteFormData>;
  errors: FieldErrors<NoteFormData>;
};
export default function NoteForm({ register, errors }: Props) {
  const prefix = useId();
  return (
    <div className="ra-history-fields">
      <FormField
        id={prefix + "-name"}
        label="Título"
        error={errors.name?.message}
      >
        <input
          id={prefix + "-name"}
          className="ra-input"
          type="text"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? prefix + "-name-error" : undefined}
          {...register("name", { required: "El nombre es obligatorio" })}
        />
      </FormField>
      <FormField
        id={prefix + "-description"}
        label="Descripción"
        error={errors.description?.message}
      >
        <textarea
          id={prefix + "-description"}
          className="ra-input"
          rows={3}
          aria-invalid={!!errors.description}
          aria-describedby={
            errors.description ? prefix + "-description-error" : undefined
          }
          {...register("description")}
        />
      </FormField>
      <div className="ra-history-form-grid">
        <FormField
          id={prefix + "-type"}
          label="Tipo"
          error={errors.type?.message}
        >
          <select
            id={prefix + "-type"}
            className="ra-input"
            aria-invalid={!!errors.type}
            aria-describedby={errors.type ? prefix + "-type-error" : undefined}
            {...register("type", {
              setValueAs: (value) => (value === "" ? undefined : value),
            })}
          >
            <option value="">Seleccionar tipo</option>
            {schemas.TipoNota.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
        <FormField
          id={prefix + "-tags"}
          label="Etiqueta"
          error={errors.tags?.message}
        >
          <select
            id={prefix + "-tags"}
            className="ra-input"
            aria-invalid={!!errors.tags}
            aria-describedby={errors.tags ? prefix + "-tags-error" : undefined}
            {...register("tags", {
              setValueAs: (value) => (value === "" ? undefined : value),
            })}
          >
            <option value="">Sin etiqueta</option>
            {schemas.TagsNota.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
      </div>
      <div className="ra-history-form-grid">
        <FormField
          id={prefix + "-weight"}
          label="Peso (opcional)"
          error={errors.weight?.message}
        >
          <input
            id={prefix + "-weight"}
            className="ra-input"
            type="number"
            aria-invalid={!!errors.weight}
            aria-describedby={
              errors.weight ? prefix + "-weight-error" : undefined
            }
            {...register("weight", { valueAsNumber: true })}
            step=".1"
          />
        </FormField>
        <FormField
          id={prefix + "-temp"}
          label="Temperatura (°C)"
          error={errors.temp?.message}
        >
          <input
            id={prefix + "-temp"}
            className="ra-input"
            type="number"
            aria-invalid={!!errors.temp}
            aria-describedby={errors.temp ? prefix + "-temp-error" : undefined}
            {...register("temp", { valueAsNumber: true })}
            step="1"
            max={60}
          />
        </FormField>
        <FormField
          id={prefix + "-humidity"}
          label="Humedad (%)"
          error={errors.humidity?.message}
        >
          <input
            id={prefix + "-humidity"}
            className="ra-input"
            type="number"
            aria-invalid={!!errors.humidity}
            aria-describedby={
              errors.humidity ? prefix + "-humidity-error" : undefined
            }
            {...register("humidity", { valueAsNumber: true })}
            step="1"
            max={100}
          />
        </FormField>
      </div>
    </div>
  );
}
