import { isAxiosError } from "axios";

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (error && typeof error === "object" && "issues" in error && Array.isArray(error.issues)) {
    const messages = error.issues.map((issue: { path?: unknown[]; message?: string }) =>
      [issue.path?.join("."), issue.message].filter(Boolean).join(": "),
    ).filter(Boolean);
    if (messages.length) return new ApiError(messages.join(". "));
  }
  if (isAxiosError(error)) {
    const body = error.response?.data;
    const messages = Array.isArray(body?.errors)
      ? body.errors
          .map((item: { msg?: unknown }) => item?.msg)
          .filter((msg: unknown) => typeof msg === "string")
      : [];
    const message =
      typeof body?.error === "string" && body.error.trim()
        ? body.error
        : messages.length
          ? messages.join(". ")
          : error.response
            ? "No pudimos completar la solicitud. Vuelve a intentarlo."
            : "No pudimos conectar con el servidor. Comprueba tu conexión y vuelve a intentarlo.";
    return new ApiError(message, error.response?.status);
  }
  return new ApiError("No pudimos procesar la respuesta. Vuelve a intentarlo.");
}
