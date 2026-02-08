import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { NoteFormData } from "../../types";
import { schemas } from "../../api/client";

type NoteFormProps = {
  register: UseFormRegister<NoteFormData>;
  errors: FieldErrors<NoteFormData>;
};

const TAG_OPTIONS = schemas.TagsNota.options;
const TYPE_OPTIONS = schemas.TipoNota.options;
export default function NoteForm({ register, errors }: NoteFormProps) {
  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Título</label>
        <input
          type="text"
          {...register("name", { required: "El nombre es obligatorio" })}
          className="w-full rounded-xl border border-gray-200
                   px-4 py-2.5 text-gray-800
                   focus:outline-none focus:ring-2
                   focus:ring-emerald-500/30
                   focus:border-emerald-500
                   transition"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full rounded-xl border border-gray-200
                   px-4 py-2.5 text-gray-800
                   focus:outline-none focus:ring-2
                   focus:ring-emerald-500/30
                   focus:border-emerald-500
                   transition resize-none"
        />
      </div>

      {/* Grid 2 columnas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Tipo */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo</label>
          <select
            {...register("type")}
            className="w-full rounded-xl border border-gray-200
                     px-4 py-2.5 text-gray-800
                     bg-white
                     focus:outline-none focus:ring-2
                     focus:ring-emerald-500/30
                     focus:border-emerald-500
                     transition"
          >
            <option value="">Seleccionar tipo</option>
            {TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Tag */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tag</label>
          <select
            {...register("tags")}
            className="w-full rounded-xl border border-gray-200
                     px-4 py-2.5 text-gray-800
                     bg-white
                     focus:outline-none focus:ring-2
                     focus:ring-emerald-500/30
                     focus:border-emerald-500
                     transition"
          >
            <option value="">Sin tag</option>
            {TAG_OPTIONS.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid 3 columnas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Peso */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Peso (opcional)</label>
          <input
            type="number"
            step=".1"
            {...register("weight", { valueAsNumber: true })}
            className="w-full rounded-xl border border-gray-200
                     px-4 py-2.5 text-gray-800
                     focus:outline-none focus:ring-2
                     focus:ring-emerald-500/30
                     focus:border-emerald-500
                     transition"
          />
        </div>

        {/* Temperatura */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Temperatura (°C)</label>
          <input
            type="number"
            step="1"
            max={60}
            {...register("temp", { valueAsNumber: true })}
            className="w-full rounded-xl border border-gray-200
                     px-4 py-2.5 text-gray-800
                     focus:outline-none focus:ring-2
                     focus:ring-emerald-500/30
                     focus:border-emerald-500
                     transition"
          />
        </div>

        {/* Humedad */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Humedad (%)</label>
          <input
            type="number"
            step="1"
            max={100}
            {...register("humidity", { valueAsNumber: true })}
            className="w-full rounded-xl border border-gray-200
                     px-4 py-2.5 text-gray-800
                     focus:outline-none focus:ring-2
                     focus:ring-emerald-500/30
                     focus:border-emerald-500
                     transition"
          />
        </div>
      </div>
    </div>
  );
}
