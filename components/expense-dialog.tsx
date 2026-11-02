"use client";

import { useState, useTransition } from "react";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addExpenseAction, editExpenseAction } from "@/app/actions";

type Props = {
  month: string;
  monthLabel: string;
  expense?: {
    id: string;
    name: string;
    amount: number;
    dueDay: number;
    category: string;
  };
};

export function ExpenseDialog({ month, monthLabel, expense }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const editing = !!expense;

  function submit(fd: FormData) {
    start(async () => {
      await (editing ? editExpenseAction(fd) : addExpenseAction(fd));
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          editing ? (
            <Button variant="ghost" size="icon" title="Editar" />
          ) : (
            <Button />
          )
        }
      >
        {editing ? (
          <Pencil />
        ) : (
          <>
            <Plus /> Nova despesa
          </>
        )}
      </DialogTrigger>
      <DialogContent>
        <form action={submit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar despesa" : "Nova despesa fixa"}
            </DialogTitle>
            <DialogDescription>
              Vale a partir de {monthLabel}
              {editing ? "; meses anteriores não mudam." : " e se repete nos meses seguintes."}
            </DialogDescription>
          </DialogHeader>
          <input type="hidden" name="month" value={month} />
          {expense && <input type="hidden" name="id" value={expense.id} />}
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" defaultValue={expense?.name} placeholder="Ex: Aluguel" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                name="amount"
                inputMode="decimal"
                defaultValue={expense ? String(expense.amount).replace(".", ",") : ""}
                placeholder="0,00"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dueDay">Dia do vencimento</Label>
              <Input id="dueDay" name="dueDay" type="number" min={1} max={31} defaultValue={expense?.dueDay} required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Categoria</Label>
            <Input id="category" name="category" defaultValue={expense?.category} placeholder="Ex: Moradia" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando…" : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
