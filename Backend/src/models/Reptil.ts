import mongoose, { Date, Document, Schema, Types } from "mongoose";
import Nota from "./Nota";

export interface IReptil extends Document {
  name: string;
  birthDate: Date;
  description: string;
  genre: number;
  notas: Types.ObjectId[];
  logPesaje: Types.ObjectId[];
  logComida: Types.ObjectId[];
}
const ReptilSchema: Schema = new Schema<IReptil>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    birthDate: {
      type: Date,
    },
    description: {
      type: String,
      trim: true,
    },
    genre: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
    },
    notas: [
      {
        type: Types.ObjectId,
        ref: "Nota",
      },
    ],
    logPesaje: [
      {
        type: Types.ObjectId,
        ref: "LogPesaje",
      },
    ],
    logComida: [
      {
        type: Types.ObjectId,
        ref: "LogComida",
      },
    ],
  },
  { timestamps: true }
);

//middleware
// cuando borra uno borre lo que esta conectado (cascada)
ReptilSchema.pre("deleteOne", { document: true, query: false }, async function () {
  const reptilId = this._id;
  if (!reptilId) return;
  await Nota.deleteMany({});
});
const Reptil = mongoose.model<IReptil>("Reptil", ReptilSchema);
export default Reptil;
