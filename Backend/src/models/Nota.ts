import mongoose, { Document, Schema, Types } from "mongoose";
import { tags, tipo } from "../utils/Common";

export interface INota extends Document {
  name: string;
  description: string;
  type: tipo;
  tags?: tags;
  weight?: number;
  humidity?: number;
  temp?: number;
  reptil: Types.ObjectId;
  createdBy: Types.ObjectId;
}

const NotaSchema: Schema = new Schema<INota>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(tipo),
      required: true,
    },
    tags: {
      type: String,
      enum: Object.values(tags),
      required: false,
    },
    weight: {
      type: Number,
    },
    humidity: {
      type: Number,
    },
    temp: {
      type: Number,
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

const Nota = mongoose.model<INota>("Nota", NotaSchema);
export default Nota;
