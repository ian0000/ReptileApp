import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { ReptilFormData } from "../../types";
import { FormField } from "../../design-system/forms";
export default function ReptilForm({
  register,
  errors,
}: {
  register: UseFormRegister<ReptilFormData>;
  errors: FieldErrors<ReptilFormData>;
}) {
  return (
    <>
      <FormField id="reptile-name" label="Nombre" error={errors.name?.message}>
        <input
          className="ra-input"
          id="reptile-name"
          autoComplete="off"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "reptile-name-error" : undefined}
          {...register("name", { required: "El nombre es obligatorio" })}
        />
      </FormField>
      <FormField
        id="reptile-birth"
        label="Fecha de nacimiento"
        hint="Opcional. Puedes completarla más adelante."
      >
        <input
          className="ra-input"
          type="date"
          id="reptile-birth"
          aria-describedby="reptile-birth-hint"
          {...register("birthDate")}
        />
      </FormField>
      <FormField
        id="reptile-description"
        label="Descripción"
        hint="Opcional. Anota lo que hace único a tu reptil."
      >
        <textarea
          className="ra-input"
          id="reptile-description"
          rows={3}
          aria-describedby="reptile-description-hint"
          {...register("description")}
        />
      </FormField>
      <FormField
        id="reptile-genre"
        label="Género"
        error={errors.genre?.message}
      >
        <select
          className="ra-input"
          id="reptile-genre"
          aria-invalid={!!errors.genre}
          aria-describedby={errors.genre ? "reptile-genre-error" : undefined}
          {...register("genre", { required: "El género es obligatorio" })}
        >
          <option value="">Selecciona un género</option>
          <option value="1">Macho</option>
          <option value="2">Hembra</option>
          <option value="3">Indefinido</option>
        </select>
      </FormField>
    </>
  );
}
