import { Suspense } from "react";
import { Wallet } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleButton } from "./google-button";

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wallet className="size-5" />
          </div>
          <CardTitle className="text-xl">Minhas Finanças</CardTitle>
          <CardDescription>Entre para acessar suas despesas</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <GoogleButton />
          <Suspense>
            <LoginError searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}

async function LoginError({ searchParams }: { searchParams: PageProps<"/login">["searchParams"] }) {
  if (!(await searchParams).error) return null;
  return (
    <p className="text-center text-sm text-destructive">
      Não foi possível entrar. Tente novamente.
    </p>
  );
}
