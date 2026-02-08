import mongoose, { Document, Schema, Types } from "mongoose";
import { metodoAlimentacion, tipoAlimento, unidad } from "../utils/Common";

export interface ILogComidas extends Document {
  cantidad: number; // Número o cantidad de presas
  unidad?: unidad; // "g", "unidades", etc.
  tipoAlimento: tipoAlimento; // Grillo, gusano, ratón...
  suplemento?: string; // Calcio, vitamina D3...
  metodo?: metodoAlimentacion; // Manual, pinzas, suelto, etc.
  observaciones?: string; // Notas adicionales
  excreto?: boolean; // Si hubo deposición luego
  apetito?: number;
  nextFeeding?: number; // Cambio respecto al peso anterior
  reptil: Types.ObjectId;
  createdBy: Types.ObjectId;
}

const LogComidasSchema: Schema = new Schema<ILogComidas>(
  {
    cantidad: {
      type: Number,
      required: true,
      min: 0,
    },
    unidad: {
      type: String,
      enum: Object.values(unidad),
    },
    tipoAlimento: {
      type: String,
      enum: Object.values(tipoAlimento),
      required: true,
    },
    suplemento: {
      type: String,
      trim: true,
    },
    metodo: {
      type: String,
      enum: Object.values(metodoAlimentacion),
    },
    observaciones: {
      type: String,
      trim: true,
    },
    excreto: {
      type: Boolean,
      default: false,
    },
    apetito: {
      type: Number,
      min: 1,
      max: 5,
    },
    nextFeeding: {
      type: Number,
      default: 1,
    },
    reptil: {
      type: Schema.Types.ObjectId,
      ref: "Reptil",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const LogComidas = mongoose.model<ILogComidas>("LogComidas", LogComidasSchema);
export default LogComidas;
