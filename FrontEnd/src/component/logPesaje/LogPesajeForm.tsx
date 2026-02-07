import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { LogPesajeFormData } from "../../types";
import { schemas } from "../../api/client";

type LogPesajeFormProps = {
  register: UseFormRegister<LogPesajeFormData>;
  errors: FieldErrors<LogPesajeFormData>;
};

const UNIDAD_OPTIONS = schemas.Unidad.options;
const CONTEXTO_OPTIONS = schemas.ContextoPesaje.options;
export default function LogPesajeForm({ register, errors }: LogPesajeFormProps) {
  return (
    <div className="space-y-6">
      {/* Peso */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Peso</label>
        <input
          type="number"
          step="0.01"
          {...register("peso", {
            required: "El peso es obligatorio",
            valueAsNumber: true,
          })}
          className="w-full rounded-xl border border-gray-200
                     px-4 py-2.5 text-gray-800
                     focus:outline-none focus:ring-2
                     focus:ring-emerald-500/30
                     focus:border-emerald-500
                     transition"
        />
        {errors.peso && <p className="text-red-500 text-sm mt-1">{errors.peso.message}</p>}
      </div>

      {/* Grid 2 columnas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Unidad */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Unidad</label>
          <select
            {...register("unidad", {
              required: "Selecciona una unidad",
            })}
            className="w-full rounded-xl border border-gray-200
                       px-4 py-2.5 text-gray-800 bg-white
                       focus:outline-none focus:ring-2
                       focus:ring-emerald-500/30
                       focus:border-emerald-500
                       transition"
          >
            <option value="">Seleccionar</option>
            {UNIDAD_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.unidad && <p className="text-red-500 text-sm mt-1">{errors.unidad.message}</p>}
        </div>

        {/* Contexto */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Contexto</label>
          <select
            {...register("contexto")}
            className="w-full rounded-xl border border-gray-200
                       px-4 py-2.5 text-gray-800 bg-white
                       focus:outline-none focus:ring-2
                       focus:ring-emerald-500/30
                       focus:border-emerald-500
                       transition"
          >
            <option value="">Sin contexto</option>
            {CONTEXTO_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Observaciones */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Observaciones</label>
        <textarea
          rows={3}
          {...register("observaciones")}
          className="w-full rounded-xl border border-gray-200
                     px-4 py-2.5 text-gray-800 resize-none
                     focus:outline-none focus:ring-2
                     focus:ring-emerald-500/30
                     focus:border-emerald-500
                     transition"
          placeholder="Ej: muda reciente, cambio de dieta, etc."
        />
      </div>
    </div>
  );
}
