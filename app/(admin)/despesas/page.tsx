import { Suspense } from "react";
import { connection } from "next/server";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export default function ExpensesPage({ searchParams }: PageProps<"/despesas">) {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <Expenses searchParams={searchParams} />
    </Suspense>
  );
}

async function Expenses({ searchParams }: { searchParams: PageProps<"/despesas">["searchParams"] }) {
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
          <MonthNav month={month} base="/despesas" />
          <ExpenseDialog month={month} monthLabel={label} />
        </div>
      </div>

      <MonthSummary items={items} />

      <Card>
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
                    Nenhuma despesa neste mês. Clique em “Nova despesa” para começar.
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
                          <Button type="submit" size="sm" variant={i.payment ? "outline" : "default"}>
                            {i.payment ? "Desfazer" : "Marcar pago"}
                          </Button>
                        </form>
                        <ExpenseDialog month={month} monthLabel={label} expense={i} />
                        <form action={deleteExpenseAction}>
                          <input type="hidden" name="id" value={i.id} />
                          <input type="hidden" name="month" value={month} />
                          <Button type="submit" size="icon" variant="ghost" title="Remover a partir deste mês">
                            <Trash2 />
                          </Button>
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
