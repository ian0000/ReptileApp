import { z } from "zod";

const Genre = z.union([z.literal(1), z.literal(2), z.literal(3)]);
const UserBasic = z.object({ _id: z.string(), name: z.string() }).partial().passthrough();
const Reptil = z
  .object({
    _id: z.string().optional(),
    name: z.string(),
    birthDate: z.string().optional(),
    description: z.string().optional(),
    genre: Genre,
    notas: z.array(z.string()).optional(),
    logPesaje: z.array(z.string()).optional(),
    logComida: z.array(z.string()).optional(),
    owner: UserBasic.optional(),
    createdAt: z.string().datetime({ offset: true }).optional(),
    updatedAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();
const TipoNota = z.enum(["comida", "suplemento", "comportamiento", "otro"]);
const TagsNota = z.enum(["calcio", "multivitaminico", "muda", "comportamiento normal", "fruta"]);
const Note = z
  .object({
    _id: z.string().optional(),
    name: z.string(),
    description: z.string().optional(),
    type: TipoNota,
    tags: TagsNota.optional(),
    weight: z.number().optional(),
    humidity: z.number().optional(),
    temp: z.number().optional(),
    reptil: z.string(),
    createdBy: UserBasic.optional(),
    createdAt: z.string().datetime({ offset: true }).optional(),
    updatedAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();
const Unidad = z.enum(["g", "kg", "ml", "unidad"]);
const ContextoPesaje = z.enum([
  "Control rutinario",
  "Post muda",
  "Pre cría",
  "Post cría",
  "Revisión por enfermedad",
  "Cambio de dieta",
  "Nuevo ejemplar",
  "Otro",
]);
const LogPesaje = z
  .object({
    _id: z.string().optional(),
    peso: z.number().gte(0),
    unidad: Unidad.optional(),
    contexto: ContextoPesaje.optional(),
    observaciones: z.string().optional(),
    diferencia: z.number().optional(),
    reptil: z.string(),
    createdBy: UserBasic.optional(),
    createdAt: z.string().datetime({ offset: true }).optional(),
    updatedAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();
const TipoAlimento = z.enum([
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
const MetodoAlimentacion = z.enum(["manual", "pinzas", "libre", "forzada", "otro"]);
const LogComidas = z
  .object({
    _id: z.string().optional(),
    cantidad: z.number().gte(0),
    unidad: Unidad.optional(),
    tipoAlimento: TipoAlimento,
    suplemento: z.string().optional(),
    metodo: MetodoAlimentacion.optional(),
    observaciones: z.string().optional(),
    excreto: z.boolean().optional(),
    apetito: z.number().gte(1).lte(5).optional(),
    nextFeeding: z.number().gte(1).optional(),
    reptil: z.string(),
    createdBy: UserBasic.optional(),
    createdAt: z.string().datetime({ offset: true }).optional(),
    updatedAt: z.string().datetime({ offset: true }).optional(),
  })
  .passthrough();

export const schemas = {
  Genre,
  UserBasic,
  Reptil,
  TipoNota,
  TagsNota,
  Note,
  Unidad,
  ContextoPesaje,
  LogPesaje,
  TipoAlimento,
  MetodoAlimentacion,
  LogComidas,
};
