import { Link } from "react-router-dom";
import ErrorMessage from "../ErrorMessage";

type ReptilFormProps = {
  register: any;
  errors: any;
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
          Fecha de Nacimiento:
        </label>
        <input
          type="date"
          id="reptileBirthDate"
          className="w-full p-3 border border-gray-200"
          placeholder="Fecha de nacimiento del reptil"
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
          {...register("genre", { required: "El género es obligatorio" })}
          id="reptileGenre"
          className="w-full p-3 border border-gray-200"
        >
          <option value="1">Macho</option>
          <option value="2">Hembra</option>
          <option value="3">Indefinido</option>
        </select>

        {errors.genre && <ErrorMessage> {errors.genre.message}</ErrorMessage>}
      </div>
    </>
  );
}
