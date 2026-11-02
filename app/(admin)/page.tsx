import { Suspense } from "react";
import { connection } from "next/server";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExpenseDialog } from "@/components/expense-dialog";
import { MonthNav } from "@/components/month-nav";
import { MonthSummary } from "@/components/month-summary";
import { deleteExpenseAction, togglePaidAction } from "@/app/actions";
import { getMonth } from "@/lib/store";
import { Money } from "@/components/money";
import { expenseStatus, monthLabel, parseMonth } from "@/lib/format";

export default function ExpensesPage({ searchParams }: PageProps<"/">) {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <Expenses searchParams={searchParams} />
    </Suspense>
  );
}

async function Expenses({ searchParams }: { searchParams: PageProps<"/">["searchParams"] }) {
  await connection();
  const month = parseMonth((await searchParams).m);
  const label = monthLabel(month);
  const items = await getMonth(month);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Despesas fixas</h1>
          <p className="text-muted-foreground">Controle de pagamentos de {label}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <MonthNav month={month} base="/" />
          <ExpenseDialog month={month} monthLabel={label} />
        </div>
      </div>

      <MonthSummary items={items} />

      <div className="grid grid-cols-2 gap-3 md:hidden">
        {items.length === 0 && (
          <p className="col-span-2 py-8 text-center text-sm text-muted-foreground">
            Nenhuma despesa neste mês. Toque em “Nova despesa” para cadastrar a primeira.
          </p>
        )}
        {items.map((i) => {
          const status = expenseStatus(month, i.dueDay, !!i.payment);
          return (
            <Card key={i.id} size="sm" className="min-w-0">
              <CardContent className="flex h-full min-w-0 flex-col gap-2">
                <div className="flex items-start justify-between gap-1">
                  <p className="min-w-0 break-words font-medium leading-tight">{i.name}</p>
                </div>
                <Badge variant="outline" className="w-fit max-w-full truncate">{i.category}</Badge>
                <p className="text-lg font-semibold tabular-nums"><Money value={i.amount} /></p>
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                  <span>Dia {i.dueDay}</span>
                  {status === "paid" && (
                    <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">Pago</Badge>
                  )}
                  {status === "overdue" && <Badge variant="destructive">Atrasada</Badge>}
                  {status === "pending" && <Badge variant="secondary">Pendente</Badge>}
                </div>
                <div className="mt-auto grid gap-1.5 pt-1">
                  <form action={togglePaidAction} className="grid">
                    <input type="hidden" name="id" value={i.id} />
                    <input type="hidden" name="month" value={month} />
                    <input type="hidden" name="paid" value={String(!i.payment)} />
                    <SubmitButton size="sm" variant={i.payment ? "outline" : "default"}>
                      {i.payment ? "Desfazer" : "Marcar pago"}
                    </SubmitButton>
                  </form>
                  <div className="flex items-center justify-between gap-1">
                    <ExpenseDialog month={month} monthLabel={label} expense={i} />
                    <form action={deleteExpenseAction}>
                      <input type="hidden" name="id" value={i.id} />
                      <input type="hidden" name="month" value={month} />
                      <SubmitButton size="icon" variant="ghost" title="Remover a partir deste mês">
                        <Trash2 />
                      </SubmitButton>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="hidden md:block">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Despesa</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="w-48 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Nenhuma despesa neste mês. Clique em “Nova despesa” para cadastrar a primeira.
                  </TableCell>
                </TableRow>
              )}
              {items.map((i) => {
                const status = expenseStatus(month, i.dueDay, !!i.payment);
                return (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{i.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{i.category}</Badge>
                    </TableCell>
                    <TableCell>Dia {i.dueDay}</TableCell>
                    <TableCell>
                      {status === "paid" && (
                        <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">Pago</Badge>
                      )}
                      {status === "overdue" && <Badge variant="destructive">Atrasada</Badge>}
                      {status === "pending" && <Badge variant="secondary">Pendente</Badge>}
                    </TableCell>
                    <TableCell className="text-right tabular-nums"><Money value={i.amount} /></TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <form action={togglePaidAction}>
                          <input type="hidden" name="id" value={i.id} />
                          <input type="hidden" name="month" value={month} />
                          <input type="hidden" name="paid" value={String(!i.payment)} />
                          <SubmitButton size="sm" variant={i.payment ? "outline" : "default"}>
                            {i.payment ? "Desfazer" : "Marcar pago"}
                          </SubmitButton>
                        </form>
                        <ExpenseDialog month={month} monthLabel={label} expense={i} />
                        <form action={deleteExpenseAction}>
                          <input type="hidden" name="id" value={i.id} />
                          <input type="hidden" name="month" value={month} />
                          <SubmitButton size="icon" variant="ghost" title="Remover a partir deste mês">
                            <Trash2 />
                          </SubmitButton>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
