import mongoose, { Document, Schema, Types } from "mongoose";
import { ContextoPesaje, unidad } from "../utils/Common";
import { NextFunction } from "express";

export interface ILogPesaje extends Document {
  peso: number; // Peso medido
  unidad?: unidad; // "g", "kg", etc.
  contexto?: string; // Ej: "antes de comer", "después de mudar"
  observaciones?: string; // Notas libres
  diferencia?: number; // Cambio respecto al peso anterior
  reptil: Types.ObjectId;
}

const LogPesajeSchema: Schema = new Schema<ILogPesaje>(
  {
    peso: {
      type: Number,
      required: true,
      min: 0,
    },
    unidad: {
      type: String,
      enum: Object.values(unidad),
    },
    contexto: {
      type: String,
      enum: Object.values(ContextoPesaje),
      default: ContextoPesaje.Control_Rutina,
    },
    observaciones: {
      type: String,
      trim: true,
    },
    diferencia: {
      type: Number,
      default: 0,
    },
    reptil: {
      type: Schema.Types.ObjectId,
      ref: "Reptil",
      required: true,
    },
  },
  { timestamps: true }
);

LogPesajeSchema.pre("save", async function (next: NextFunction) {
  try {
    // Evitar recalcular si el documento no es nuevo o no cambió el peso
    if (!this.isNew && !this.isModified("peso")) {
      return next();
    }

    const ultimoPesaje = await mongoose
      .model<ILogPesaje>("LogPesaje")
      .findOne({ reptil: this.reptil })
      .sort({ createdAt: -1 });

    if (ultimoPesaje) {
      const diferencia = Number(this.peso ?? 0) - Number(ultimoPesaje.peso ?? 0);

      this.diferencia = Math.round(diferencia * 100) / 100;
    } else {
      this.diferencia = 0; // primer pesaje
    }

    next();
  } catch (error) {
    next(error);
  }
});
const LogPesaje = mongoose.model<ILogPesaje>("LogPesaje", LogPesajeSchema);
export default LogPesaje;
