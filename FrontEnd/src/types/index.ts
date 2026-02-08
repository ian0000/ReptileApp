import { z } from "zod";
import { schemas } from "../api/client";
import { numberOptional } from "../utils/utils";

const authSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  current_password: z.string(),
  password: z.string(),
  password_confirmation: z.string(),
  token: z.string(),
});

type Auth = z.infer<typeof authSchema>;
export type UserLoginForm = Pick<Auth, "email" | "password">;
export type UserRegistrationForm = Pick<
  Auth,
  "name" | "email" | "password" | "password_confirmation"
>;
export type RequestConfirmationCodeForm = Pick<Auth, "email">;

export type ForgotPasswordForm = Pick<Auth, "email">;
export type NewPasswordForm = Pick<Auth, "password" | "password_confirmation">;
export type UpdateCurrentUserPasswordForm = Pick<
  Auth,
  "current_password" | "password" | "password_confirmation"
>;
export type ConfirmToken = Pick<Auth, "token">;
export type CheckPasswordForm = Pick<Auth, "password">;

// USER
export const userSchema = authSchema
  .pick({
    name: true,
    email: true,
  })
  .extend({
    _id: z.string(),
  });
export type User = z.infer<typeof userSchema>;
export type UserProfileForm = Pick<User, "name" | "email">;

export const reptilFormSchema = z.object({
  name: z.string().min(1),
  birthDate: z.string().optional(),
  description: z.string().optional(),
  genre: z.preprocess((val) => Number(val), schemas.Genre),
});
//reptil

export type ReptilForm = z.infer<typeof reptilFormSchema>;
export type ReptilFormData = Pick<ReptilForm, "name" | "birthDate" | "description" | "genre">;

export const noteFormSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  type: z.preprocess((val) => (val === "" ? null : val), schemas.TipoNota.optional()),
  tags: z.preprocess((val) => (val === "" ? null : val), schemas.TagsNota.optional()),

  weight: numberOptional(z.number().min(0)),
  humidity: numberOptional(z.number().min(0).max(100)),
  temp: numberOptional(z.number().min(0).max(60)),
});
export type NoteForm = z.infer<typeof noteFormSchema>;
export type NoteFormData = Pick<
  NoteForm,
  "name" | "description" | "type" | "tags" | "weight" | "humidity" | "temp"
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
  "peso" | "unidad" | "contexto" | "observaciones"
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
  nextFeeding: z.number().gte(1),
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
  | "nextFeeding"
>;
