-- Rode no Supabase: SQL Editor > New query > Run.

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  amount numeric(12,2) not null check (amount > 0),
  due_day int not null check (due_day between 1 and 31),
  category text not null default 'Outros',
  start_month text not null check (start_month ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  end_month text check (end_month ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  created_at timestamptz not null default now()
);

create table public.payments (
  expense_id uuid not null references public.expenses(id) on delete cascade,
  month text not null check (month ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  amount numeric(12,2) not null,
  paid_at timestamptz not null default now(),
  primary key (expense_id, month)
);

create index on public.expenses (user_id);
create index on public.payments (user_id, month);

alter table public.expenses enable row level security;
alter table public.payments enable row level security;

create policy "own expenses" on public.expenses
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "own payments" on public.payments
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
