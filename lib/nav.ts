import {
  CalendarClock,
  PiggyBank,
  Receipt,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  soon?: boolean; // item ainda sem página: aparece desabilitado
};

export type NavGroup = { label: string; items: NavItem[] };

// Para criar um módulo novo: crie a pasta em app/(admin)/<rota> e adicione aqui.
export const nav: NavGroup[] = [
  {
    label: "Geral",
    items: [
      { title: "Despesas fixas", href: "/", icon: CalendarClock },
    ],
  },
  {
    label: "Em breve",
    items: [
      { title: "Receitas", href: "/receitas", icon: TrendingUp, soon: true },
      { title: "Cartões", href: "/cartoes", icon: Receipt, soon: true },
      { title: "Metas", href: "/metas", icon: PiggyBank, soon: true },
    ],
  },
];

export function findNavItem(pathname: string) {
  return nav.flatMap((g) => g.items).find((i) => i.href === pathname);
}
