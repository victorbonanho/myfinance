import { brl } from "@/lib/format";

// O desfoque é aplicado via CSS quando <html> tem a classe "privacy" (ver PrivacyToggle).
export function Money({ value }: { value: number }) {
  return <span data-money>{brl(value)}</span>;
}
