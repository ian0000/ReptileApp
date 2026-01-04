import type { FieldErrors, UseFormRegister } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import type { ReptilFormData } from "../../types";

type ReptilFormProps = {
  register: UseFormRegister<ReptilFormData>;
  errors: FieldErrors<ReptilFormData>;
};

export default function ReptilForm({ register, errors }: ReptilFormProps) {
  return (
    <>
      <div className="mb-5 space-y-3">
        <label htmlFor="reptileName" className="text-sm font-bold uppercase">
          Nombre Reptil:
        </label>
        <input
          type="text"
          id="reptileName"
          className="w-full p-3 border border-gray-200"
          placeholder="Nombre del reptil"
          {...register("name", { required: "El nombre es obligatorio" })}
        />
        {errors.name && <ErrorMessage> {errors.name.message}</ErrorMessage>}
      </div>
      <div className="mb-5 space-y-3">
        <label htmlFor="reptileBirthDate" className="text-sm font-bold uppercase">
          Fecha de Nacimiento
        </label>
        <input
          type="date"
          id="reptileBirthDate"
          className="w-full p-3 border border-gray-200 rounded-lg"
          {...register("birthDate")}
        />
      </div>

      <div className="mb-5 space-y-3">
        <label htmlFor="reptileDescription" className="text-sm font-bold uppercase">
          Descripción:
        </label>
        <input
          type="text"
          id="reptileDescription"
          className="w-full p-3 border border-gray-200"
          placeholder="Descripción del reptil"
          {...register("description")}
        />
      </div>
      <div className="mb-5 space-y-3">
        <label htmlFor="reptileGenre" className="text-sm font-bold uppercase">
          Género:
        </label>

        <select
          id="reptileGenre"
          className="w-full p-3 border border-gray-200 rounded-lg"
          {...register("genre", { required: "El género es obligatorio" })}
        >
          <option value="">Selecciona un género</option>
          <option value="macho">Macho</option>
          <option value="hembra">Hembra</option>
          <option value="indefinido">Indefinido</option>
        </select>

        {errors.genre && <ErrorMessage> {errors.genre.message}</ErrorMessage>}
      </div>
    </>
  );
}
