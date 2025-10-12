import mongoose, { Date, Document, Schema } from "mongoose";

export interface IReptil extends Document {
  name: string;
  birthDate: Date;
  description: string;
}
const ReptilSchema: Schema = new Schema(
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
  },
  { timestamps: true }
);

const Reptil = mongoose.model<IReptil>("Reptil", ReptilSchema);
export default Reptil;
