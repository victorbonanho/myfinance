import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { currentMonth, monthLabel, shiftMonth } from "@/lib/format";

export function MonthNav({ month, base }: { month: string; base: string }) {
  const link = (m: string) => (m === currentMonth() ? base : `${base}?m=${m}`);
  return (
    <div className="flex items-center gap-1">
      <Link
        href={link(shiftMonth(month, -1))}
        className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
        aria-label="Mês anterior"
      >
        <ChevronLeft />
      </Link>
      <Link
        href={base}
        className={cn(buttonVariants({ variant: "outline" }), "min-w-44")}
      >
        {monthLabel(month)}
      </Link>
      <Link
        href={link(shiftMonth(month, 1))}
        className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
        aria-label="Próximo mês"
      >
        <ChevronRight />
      </Link>
    </div>
  );
}
