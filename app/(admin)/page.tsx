import { Suspense } from "react";
import { connection } from "next/server";
import { Skeleton } from "@/components/ui/skeleton";
import { MonthNav } from "@/components/month-nav";
import { MonthSummary } from "@/components/month-summary";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getMonth } from "@/lib/store";
import { Money } from "@/components/money";
import { expenseStatus, monthLabel, parseMonth } from "@/lib/format";

export default function DashboardPage({ searchParams }: PageProps<"/">) {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <Dashboard searchParams={searchParams} />
    </Suspense>
  );
}

async function Dashboard({ searchParams }: { searchParams: PageProps<"/">["searchParams"] }) {
  await connection();
  const month = parseMonth((await searchParams).m);
  const items = await getMonth(month);
  const upcoming = items
    .filter((i) => !i.payment)
    .map((i) => ({ ...i, status: expenseStatus(month, i.dueDay, false) }))
    .slice(0, 6);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral de {monthLabel(month)}</p>
        </div>
        <MonthNav month={month} base="/" />
      </div>

      <MonthSummary items={items} />

      <Card>
        <CardHeader>
          <CardTitle>Próximas contas</CardTitle>
          <CardDescription>Despesas ainda não pagas, por vencimento</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {upcoming.length === 0 && (
            <p className="text-sm text-muted-foreground">Tudo pago por aqui. 🎉</p>
          )}
          {upcoming.map((i) => (
            <div key={i.id} className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate font-medium">{i.name}</p>
                <p className="text-xs text-muted-foreground">vence dia {i.dueDay}</p>
              </div>
              <div className="flex items-center gap-3">
                {i.status === "overdue" && <Badge variant="destructive">Atrasada</Badge>}
                <span className="tabular-nums font-medium"><Money value={i.amount} /></span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
