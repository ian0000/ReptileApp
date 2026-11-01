export function recordError(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "issues" in error &&
    Array.isArray(error.issues)
  ) {
    return error.issues
      .map((issue: { path?: unknown[]; message?: string }) =>
        [issue.path?.join("."), issue.message].filter(Boolean).join(": "),
      )
      .join(". ");
  }
  return error instanceof Error && error.message
    ? error.message
    : "No se pudo completar la solicitud. Inténtalo de nuevo.";
}
