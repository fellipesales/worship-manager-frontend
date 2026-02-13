import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDate(date: string | Date, pattern = "dd/MM/yyyy") {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, pattern, { locale: ptBR });
}

export function formatDateLong(date: string | Date) {
  return formatDate(date, "EEEE, dd 'de' MMMM 'de' yyyy");
}

export function formatDateTime(date: string | Date) {
  return formatDate(date, "dd/MM/yyyy HH:mm");
}
