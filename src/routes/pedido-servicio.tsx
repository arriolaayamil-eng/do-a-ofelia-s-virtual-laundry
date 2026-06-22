import { createFileRoute } from "@tanstack/react-router";
import { Checkout } from "@/components/Checkout";

const TITLE = "Tu pedido de servicios — Lavadero Doña Ofelia";
const DESC = "Confirmá tu pedido de servicios: modalidad, datos de contacto y enviá por WhatsApp.";

export const Route = createFileRoute("/pedido-servicio")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Pedido de servicios</h1>
      <Checkout kind="service" />
    </div>
  ),
});