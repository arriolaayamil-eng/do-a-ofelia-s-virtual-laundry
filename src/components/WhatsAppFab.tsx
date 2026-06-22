import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/business";

export function WhatsAppFab() {
  return (
    <a
      href={waLink("¡Hola! Quería hacer una consulta.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center justify-center rounded-full bg-green-600 p-3 text-white shadow-lg hover:bg-green-700"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}