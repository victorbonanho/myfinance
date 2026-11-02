export const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function fmtMonth(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export const currentMonth = () => fmtMonth(new Date());

export function shiftMonth(month: string, delta: number) {
  const [y, m] = month.split("-").map(Number);
  return fmtMonth(new Date(y, m - 1 + delta, 1));
}

export function monthLabel(month: string) {
  const [y, m] = month.split("-").map(Number);
  const s = new Date(y, m - 1, 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function parseMonth(raw: string | string[] | undefined) {
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v && /^\d{4}-(0[1-9]|1[0-2])$/.test(v) ? v : currentMonth();
}

export type ExpenseStatus = "paid" | "overdue" | "pending";

export function expenseStatus(
  month: string,
  dueDay: number,
  paid: boolean,
): ExpenseStatus {
  if (paid) return "paid";
  const cur = currentMonth();
  const overdue =
    month < cur || (month === cur && dueDay < new Date().getDate());
  return overdue ? "overdue" : "pending";
}
