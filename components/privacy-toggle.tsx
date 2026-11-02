"use client";

import { useSyncExternalStore } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const KEY = "privacy";

function subscribe(cb: () => void) {
  window.addEventListener("privacy-change", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("privacy-change", cb);
    window.removeEventListener("storage", cb);
  };
}

const getSnapshot = () => document.documentElement.classList.contains("privacy");

export function PrivacyToggle() {
  const hidden = useSyncExternalStore(subscribe, getSnapshot, () => false);

  function toggle() {
    const next = !hidden;
    document.documentElement.classList.toggle("privacy", next);
    localStorage.setItem(KEY, next ? "1" : "0");
    window.dispatchEvent(new Event("privacy-change"));
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="ml-auto"
      onClick={toggle}
      title={hidden ? "Mostrar valores" : "Ocultar valores"}
      aria-label={hidden ? "Mostrar valores" : "Ocultar valores"}
    >
      {hidden ? <EyeOff /> : <Eye />}
    </Button>
  );
}
