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
  createdBy: Types.ObjectId;
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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const LogPesaje = mongoose.model<ILogPesaje>("LogPesaje", LogPesajeSchema);
export default LogPesaje;
