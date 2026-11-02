"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as store from "@/lib/store";
import { createClient } from "@/lib/supabase/server";

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

function parseAmount(v: FormDataEntryValue | null) {
  const n = Number(String(v ?? "").replace(/\./g, "").replace(",", "."));
  if (!Number.isFinite(n) || n <= 0) throw new Error("Valor inválido");
  return Math.round(n * 100) / 100;
}

function month(v: FormDataEntryValue | null) {
  const s = String(v ?? "");
  if (!MONTH_RE.test(s)) throw new Error("Mês inválido");
  return s;
}

function parseFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const dueDay = Number(formData.get("dueDay"));
  if (!name || !Number.isInteger(dueDay) || dueDay < 1 || dueDay > 31) {
    throw new Error("Dados inválidos");
  }
  return {
    name,
    amount: parseAmount(formData.get("amount")),
    dueDay,
    category: String(formData.get("category") ?? "").trim() || "Outros",
  };
}

export async function addExpenseAction(formData: FormData) {
  await store.addExpense({
    ...parseFields(formData),
    startMonth: month(formData.get("month")),
  });
  revalidatePath("/", "layout");
}

export async function editExpenseAction(formData: FormData) {
  await store.editExpense(
    String(formData.get("id")),
    month(formData.get("month")),
    parseFields(formData),
  );
  revalidatePath("/", "layout");
}

export async function togglePaidAction(formData: FormData) {
  const paid = formData.get("paid") === "true";
  await store.setPaid(String(formData.get("id")), month(formData.get("month")), paid);
  revalidatePath("/", "layout");
}

export async function deleteExpenseAction(formData: FormData) {
  await store.endExpense(String(formData.get("id")), month(formData.get("month")));
  revalidatePath("/", "layout");
}
