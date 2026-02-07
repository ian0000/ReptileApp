import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { LogComidasFormData } from "../../types";
import { schemas } from "../../api/client";

type LogComidaFormProps = {
  register: UseFormRegister<LogComidasFormData>;
  errors: FieldErrors<LogComidasFormData>;
};

const UNIDAD_OPTIONS = schemas.Unidad.options;
const TIPO_ALIMENTO_OPTIONS = schemas.TipoAlimento.options;
const METODO_OPTIONS = schemas.MetodoAlimentacion.options;

export default function LogComidaForm({ register, errors }: LogComidaFormProps) {
  return (
    <div className="space-y-6">
      {/* Cantidad */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Cantidad</label>
        <input
          type="number"
          step="0.01"
          {...register("cantidad", {
            required: "La cantidad es obligatoria",
            valueAsNumber: true,
          })}
          className="w-full rounded-xl border border-gray-200
                     px-4 py-2.5 text-gray-800
                     focus:outline-none focus:ring-2
                     focus:ring-emerald-500/30
                     focus:border-emerald-500
                     transition"
        />
        {errors.cantidad && <p className="text-red-500 text-sm mt-1">{errors.cantidad.message}</p>}
      </div>

      {/* Grid 2 columnas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Unidad */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Unidad</label>
          <select
            {...register("unidad")}
            className="w-full rounded-xl border border-gray-200
                       px-4 py-2.5 text-gray-800 bg-white
                       focus:outline-none focus:ring-2
                       focus:ring-emerald-500/30
                       focus:border-emerald-500
                       transition"
          >
            <option value="">Sin unidad</option>
            {UNIDAD_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de alimento */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de alimento</label>
          <select
            {...register("tipoAlimento", {
              required: "Selecciona el alimento",
            })}
            className="w-full rounded-xl border border-gray-200
                       px-4 py-2.5 text-gray-800 bg-white
                       focus:outline-none focus:ring-2
                       focus:ring-emerald-500/30
                       focus:border-emerald-500
                       transition"
          >
            {TIPO_ALIMENTO_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.tipoAlimento && (
            <p className="text-red-500 text-sm mt-1">{errors.tipoAlimento.message}</p>
          )}
        </div>
      </div>

      {/* Grid 3 columnas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Método */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Método</label>
          <select
            {...register("metodo")}
            className="w-full rounded-xl border border-gray-200
                       px-4 py-2.5 text-gray-800 bg-white
                       focus:outline-none focus:ring-2
                       focus:ring-emerald-500/30
                       focus:border-emerald-500
                       transition"
          >
            <option value="">Sin método</option>
            {METODO_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Apetito */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Apetito</label>
          <select
            {...register("apetito", { valueAsNumber: true })}
            className="w-full rounded-xl border border-gray-200
                       px-4 py-2.5 text-gray-800 bg-white
                       focus:outline-none focus:ring-2
                       focus:ring-emerald-500/30
                       focus:border-emerald-500
                       transition"
          >
            <option value="">No especificado</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Excretó */}
        <div className="flex items-center gap-3 mt-7">
          <input
            type="checkbox"
            {...register("excreto")}
            className="h-4 w-4 rounded border-gray-300
                       text-emerald-600 focus:ring-emerald-500"
          />
          <label className="text-sm font-semibold text-gray-700">Excretó</label>
        </div>
      </div>

      {/* Suplemento */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Suplemento</label>
        <input
          type="text"
          {...register("suplemento")}
          className="w-full rounded-xl border border-gray-200
                     px-4 py-2.5 text-gray-800
                     focus:outline-none focus:ring-2
                     focus:ring-emerald-500/30
                     focus:border-emerald-500
                     transition"
          placeholder="Ej: calcio, multivitamínico"
        />
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
          placeholder="Ej: rechazó parte del alimento"
        />
      </div>
    </div>
  );
}
