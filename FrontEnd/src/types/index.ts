import { z } from "zod";
// reptil
export const genreSchema = z.number().transform((value) => {
  if (value === 1) return "macho";
  if (value === 2) return "hembra";
  return "indefinido";
});

export const reptilSchema = z.object({
  _id: z.string(),
  name: z.string(),
  birthDate: z.coerce.date().optional(),
  description: z.string().optional(),

  genre: genreSchema,
  // //   obtener ultimos de estos datos
  notas: z.array(z.any()).default([]),
  // logPesaje: z.array(logPesajeSchema).optional().nullable(),
  // logComida: z.array(logComidaSchema).optional().nullable(),
});

export const reptilFormSchema = z.object({
  name: z.string().min(1),
  birthDate: z.string().optional(),
  description: z.string().optional(),
  genre: z.number(), // 1 | 2 | 3
});

export const dashboardReptilSchema = z.array(
  reptilSchema.pick({ _id: true, name: true, birthDate: true }),
);

export type Reptil = z.infer<typeof reptilFormSchema>;
export type ReptilFormData = Pick<Reptil, "name" | "birthDate" | "description" | "genre">;
