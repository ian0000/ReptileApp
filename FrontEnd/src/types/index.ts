import { z } from "zod";
// reptil

const UnidadesSchema = z.enum(["g", "kg", "ml", "unidad"]);
export type unidades = z.infer<typeof UnidadesSchema>;

export const generoFormSchema = z.enum(["macho", "hembra", "indefinido"]);
export const generoSchema = z
  .union([z.enum(["macho", "hembra", "indefinido"]), z.literal(1), z.literal(2), z.literal(3)])
  .transform((val) => {
    console.log("Transform genero:", val);
    if (val === 1 || val === "macho") return "macho";
    if (val === 2 || val === "hembra") return "hembra";
    return "indefinido";
  });
export type genero = z.infer<typeof generoFormSchema>;

const contextoPesajeSchema = z.enum([
  "Control rutinario",
  "Post muda",
  "Pre cría",
  "Post cría",
  "Revisión por enfermedad",
  "Cambio de dieta",
  "Nuevo ejemplar",
  "Otro",
]);

export type contextoPesaje = z.infer<typeof contextoPesajeSchema>;

const tipoAlimentoSchema = z.enum([
  "grillo",
  "gusano de harina",
  "gusano de coco",
  "gusano rey",
  "cucaracha dubia",
  "cucaracha roja",
  "ratón pinky",
  "ratón adulto",
  "otro",
]);

export type tipoAlimento = z.infer<typeof tipoAlimentoSchema>;

const metodoAlimentacionSchema = z.enum(["manual", "pinzas", "libre", "forzada", "otro"]);
export type metodoAlimentacion = z.infer<typeof metodoAlimentacionSchema>;

const tipoSchema = z.enum(["comida", "suplemento", "comportamiento", "otro"]);
export type tipo = z.infer<typeof tipoSchema>;

const tagsSchema = z.enum(["calcio", "multivitaminico", "muda", "comportamiento normal", "fruta"]);
export type tags = z.infer<typeof tagsSchema>;

export const logPesajeSchema = z.object({
  _id: z.string(),
  peso: z.number(),
  unidad: UnidadesSchema.optional(),
  contexto: contextoPesajeSchema.optional(),
  observaciones: z.string().optional(),
  diferencia: z.number().optional(),
  reptil: z.string(),
});
export type LogPesaje = z.infer<typeof logPesajeSchema>;

export const logComidaSchema = z.object({
  _id: z.string(),
  cantidad: z.number(),
  unidad: UnidadesSchema.optional(),
  tipoAlimento: tipoAlimentoSchema,
  suplemento: z.string().optional(),
  metodo: metodoAlimentacionSchema.optional(),
  observaciones: z.string().optional(),
  excreto: z.boolean().optional(),
  apetito: z.number().min(1).max(5).optional(),
  reptil: z.string(),
});
export type LogComida = z.infer<typeof logComidaSchema>;

export const notaSchema = z.object({
  _id: z.string(),
  title: z.string(),
  content: z.string(),
  tipo: tipoSchema,
  tags: z.array(tagsSchema).optional(),
  reptil: z.string(),
});

export type Nota = z.infer<typeof notaSchema>;

export const reptilSchema = z.object({
  _id: z.string(),
  name: z.string(),
  birthDate: z.coerce.date().optional(),
  description: z.string().optional(),

  genre: generoSchema,
  // //   obtener ultimos de estos datos
  notas: z.array(z.any()).default([]),
  // logPesaje: z.array(logPesajeSchema).optional().nullable(),
  // logComida: z.array(logComidaSchema).optional().nullable(),
});

export const dashboardReptilSchema = z.array(
  reptilSchema.pick({ _id: true, name: true, birthDate: true })
);

export type Reptil = z.infer<typeof reptilSchema>;
export type ReptilFormData = Pick<Reptil, "name" | "birthDate" | "description" | "genre">;
