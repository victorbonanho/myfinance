import { createClient } from "@/lib/supabase/server";

export type Expense = {
  id: string;
  name: string;
  amount: number;
  dueDay: number; // 1-31
  category: string;
  startMonth: string; // YYYY-MM
  endMonth?: string | null; // último mês em que cobra
};

type ExpenseRow = {
  id: string;
  name: string;
  amount: number;
  due_day: number;
  category: string;
  start_month: string;
  end_month: string | null;
};

type Fields = Pick<Expense, "name" | "amount" | "dueDay" | "category">;

// O user_id é preenchido pelo banco (auth.uid()) e as políticas RLS isolam os dados.
function check<T>(res: { data: T; error: { message: string } | null }) {
  if (res.error) throw new Error(res.error.message);
  return res.data;
}

function prevMonth(month: string) {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export async function getMonth(month: string) {
  const db = await createClient();
  const [expenses, payments] = await Promise.all([
    db
      .from("expenses")
      .select("id,name,amount,due_day,category,start_month,end_month")
      .lte("start_month", month)
      .or(`end_month.is.null,end_month.gte.${month}`)
      .order("due_day")
      .order("name")
      .then(check),
    db.from("payments").select("expense_id,amount,paid_at").eq("month", month).then(check),
  ]);

  const byExpense = new Map((payments ?? []).map((p) => [p.expense_id, p]));
  return (expenses as ExpenseRow[]).map((e) => {
    const p = byExpense.get(e.id);
    return {
      id: e.id,
      name: e.name,
      amount: Number(e.amount),
      dueDay: e.due_day,
      category: e.category,
      startMonth: e.start_month,
      endMonth: e.end_month,
      payment: p ? { amount: Number(p.amount), paidAt: p.paid_at as string } : null,
    };
  });
}

export async function addExpense(data: Fields & { startMonth: string }) {
  const db = await createClient();
  check(
    await db.from("expenses").insert({
      name: data.name,
      amount: data.amount,
      due_day: data.dueDay,
      category: data.category,
      start_month: data.startMonth,
    }),
  );
}

// Remove a despesa a partir de `month`, preservando o histórico anterior.
export async function endExpense(id: string, month: string) {
  const db = await createClient();
  const e = check(
    await db.from("expenses").select("start_month").eq("id", id).maybeSingle(),
  );
  if (!e) return;

  if (e.start_month >= month) {
    check(await db.from("expenses").delete().eq("id", id));
    return;
  }
  check(await db.from("payments").delete().eq("expense_id", id).gte("month", month));
  check(await db.from("expenses").update({ end_month: prevMonth(month) }).eq("id", id));
}

// Edita a despesa a partir de `month`; meses anteriores mantêm os dados antigos.
export async function editExpense(id: string, month: string, data: Fields) {
  const db = await createClient();
  const fields = {
    name: data.name,
    amount: data.amount,
    due_day: data.dueDay,
    category: data.category,
  };
  const e = check(
    await db.from("expenses").select("start_month,end_month").eq("id", id).maybeSingle(),
  );
  if (!e) return;

  if (e.start_month >= month) {
    check(await db.from("expenses").update(fields).eq("id", id));
    return;
  }

  const created = check(
    await db
      .from("expenses")
      .insert({ ...fields, start_month: month, end_month: e.end_month })
      .select("id")
      .single(),
  );
  check(
    await db
      .from("payments")
      .update({ expense_id: created!.id })
      .eq("expense_id", id)
      .gte("month", month),
  );
  check(await db.from("expenses").update({ end_month: prevMonth(month) }).eq("id", id));
}

export async function setPaid(id: string, month: string, paid: boolean) {
  const db = await createClient();
  if (!paid) {
    check(await db.from("payments").delete().eq("expense_id", id).eq("month", month));
    return;
  }
  const e = check(await db.from("expenses").select("amount").eq("id", id).maybeSingle());
  if (!e) return;
  check(
    await db
      .from("payments")
      .upsert({ expense_id: id, month, amount: e.amount }, { onConflict: "expense_id,month" }),
  );
}
