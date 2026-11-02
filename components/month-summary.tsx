import { CheckCircle2, Clock, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Money } from "@/components/money";

type Item = { amount: number; payment: unknown };

export function MonthSummary({ items }: { items: Item[] }) {
  const total = items.reduce((s, i) => s + i.amount, 0);
  const paid = items.filter((i) => i.payment).reduce((s, i) => s + i.amount, 0);
  const remaining = total - paid;
  const pct = total ? Math.round((paid / total) * 100) : 0;
  const paidCount = items.filter((i) => i.payment).length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Stat title="Total do mês" value={<Money value={total} />} icon={<Wallet />} hint={`${items.length} ${items.length === 1 ? "despesa" : "despesas"}`} />
      <Stat
        title="Já pago"
        value={<Money value={paid} />}
        icon={<CheckCircle2 className="text-emerald-600" />}
        hint={`${paidCount} de ${items.length} pagas`}
      />
      <Stat
        title="Falta pagar"
        value={<Money value={remaining} />}
        icon={<Clock className="text-amber-600" />}
        hint={`${items.length - paidCount} ${items.length - paidCount === 1 ? "pendente" : "pendentes"}`}
      />
      <Card className="md:col-span-3">
        <CardContent className="grid gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso de pagamento</span>
            <span className="font-medium">{pct}%</span>
          </div>
          <Progress value={pct} />
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({
  title,
  value,
  hint,
  icon,
}: {
  title: string;
  value: React.ReactNode;
  hint: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="mt-1 text-xl font-bold tabular-nums xl:text-2xl">{value}</div>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
        <span className="shrink-0 rounded-md bg-muted p-2 [&_svg]:size-4">{icon}</span>
      </CardContent>
    </Card>
  );
}
