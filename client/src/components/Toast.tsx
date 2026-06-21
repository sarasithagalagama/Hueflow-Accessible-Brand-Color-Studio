import { Check } from "lucide-react";

export function Toast({ message }: { message: string }) {
  return <div className="toast" role="status" aria-live="polite"><Check size={16} />{message}</div>;
}
