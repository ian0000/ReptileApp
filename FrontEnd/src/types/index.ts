import { z } from "zod";
import { schemas } from "../api/client";
// reptil
// export const genreSchema = z.number().transform((value) => {
//   if (value === 1) return "macho";
//   if (value === 2) return "hembra";
//   return "indefinido";
// });

export const reptilFormSchema = z.object({
  name: z.string().min(1),
  birthDate: z.string().optional(),
  description: z.string().optional(),
  genre: z.preprocess((val) => Number(val), schemas.Genre),
});

export type ReptilForm = z.infer<typeof reptilFormSchema>;
export type ReptilFormData = Pick<ReptilForm, "name" | "birthDate" | "description" | "genre">;

export const noteFormSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  type: z.preprocess((val) => (val === "" ? null : val), schemas.TipoNota.optional()),
  tags: z.preprocess((val) => (val === "" ? null : val), schemas.TagsNota.optional()),
  humidity: z.number().min(0).max(100).optional(),
  temp: z.number().min(0).max(60).optional(),
  weight: z.number().min(0).optional(),
  reptil: z.string(),
});
export type NoteForm = z.infer<typeof noteFormSchema>;
export type NoteFormData = Pick<
  NoteForm,
  "name" | "description" | "type" | "tags" | "weight" | "humidity" | "temp" | "reptil"
>;

export const logPesajeFormSchema = z.object({
  peso: z.number().gte(0),
  unidad: schemas.Unidad.optional(),
  contexto: schemas.ContextoPesaje.optional(),
  observaciones: z.string().optional(),
  diferencia: z.number().optional(),
  reptil: z.string(),
});

export type LogPesajeForm = z.infer<typeof logPesajeFormSchema>;
export type LogPesajeFormData = Pick<
  LogPesajeForm,
  "peso" | "unidad" | "contexto" | "observaciones" | "diferencia" | "reptil"
>;

export const logComidasFormSchema = z.object({
  cantidad: z.number().gte(0),
  unidad: z.preprocess((val) => (val === "" ? null : val), schemas.Unidad.optional()),
  tipoAlimento: z.preprocess((val) => (val === "" ? null : val), schemas.TipoAlimento),
  suplemento: z.string().optional(),
  metodo: z.preprocess((val) => (val === "" ? null : val), schemas.MetodoAlimentacion.optional()),
  observaciones: z.string().optional(),
  excreto: z.boolean().optional(),
  apetito: z.number().gte(1).lte(5).optional(),
  reptil: z.string(),
});

export type LogComidasForm = z.infer<typeof logComidasFormSchema>;
export type LogComidasFormData = Pick<
  LogComidasForm,
  | "cantidad"
  | "unidad"
  | "tipoAlimento"
  | "suplemento"
  | "metodo"
  | "observaciones"
  | "excreto"
  | "apetito"
  | "reptil"
>;
