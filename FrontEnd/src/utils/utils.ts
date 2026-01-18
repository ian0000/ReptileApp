export function formatDate(dateString: string): string {
  if (!dateString) return "";

  const [datePart] = dateString.split("T"); // YYYY-MM-DD
  const [year, month, day] = datePart.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
// Convierte genre numérico a texto
export function formatGenre(genre?: number): string {
  switch (genre) {
    case 1:
      return "Macho";
    case 2:
      return "Hembra";
    case 3:
      return "Indefinido";
    default:
      return "No especificado";
  }
}
export function formatDateForInput(date?: string | Date): string {
  if (!date) return "";

  // 🔥 SIEMPRE tratar como string
  if (typeof date === "string") {
    return date.split("T")[0];
  }

  // ⚠️ Date → string SIN UTC
  return date.toISOString().split("T")[0];
}
