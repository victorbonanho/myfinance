import { LogOut } from "lucide-react";
import { connection } from "next/server";
import { SubmitButton } from "@/components/submit-button";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/app/actions";

export async function UserMenu() {
  await connection();
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return null;

  const name = (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "Usuário";
  const avatar = user.user_metadata?.avatar_url as string | undefined;

  return (
    <div className="flex items-center gap-2 p-1">
      {avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatar} alt="" referrerPolicy="no-referrer" className="size-8 shrink-0 rounded-full" />
      ) : (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="grid min-w-0 flex-1 text-left text-xs leading-tight group-data-[collapsible=icon]:hidden">
        <span className="truncate font-medium">{name}</span>
        <span className="truncate text-muted-foreground">{user.email}</span>
      </div>
      <form action={signOutAction} className="group-data-[collapsible=icon]:hidden">
        <SubmitButton variant="ghost" size="icon" title="Sair" aria-label="Sair">
          <LogOut />
        </SubmitButton>
      </form>
    </div>
  );
}
