"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Desabilita e mostra spinner enquanto o <form> pai está enviando a Server Action.
export function SubmitButton({
  children,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "type" | "disabled">) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} aria-busy={pending} {...props}>
      {pending ? <Loader2 className="animate-spin" /> : children}
    </Button>
  );
}
