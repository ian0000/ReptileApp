import mongoose, { Date, Document, PopulatedDoc, Schema, Types } from "mongoose";
import Nota from "./Nota";
import { IUser } from "./User";

export interface IReptil extends Document {
  name: string;
  birthDate: Date;
  description: string;
  genre: number;
  notas: Types.ObjectId[];
  logPesaje: Types.ObjectId[];
  logComida: Types.ObjectId[];
  owner: PopulatedDoc<IUser & Document>;
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
      enum: [1, 2, 3], // 1: macho, 2: hembra, 3: indefinido
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
    owner: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
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
