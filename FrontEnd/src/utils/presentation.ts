/** Convert response messages to display text without rendering response objects. */
export function successMessage(value: unknown, fallback: string): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (value && typeof value === "object") {
    for (const key of ["message", "msg"] as const) {
      if (key in value) {
        const message = (value as Record<string, unknown>)[key];
        if (typeof message === "string" && message.trim())
          return message.trim();
      }
    }
  }
  return fallback;
}
