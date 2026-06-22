import { createFileRoute } from "@tanstack/react-router";
import { Checkout } from "@/components/Checkout";

const TITLE = "Tu carrito — Lavadero Doña Ofelia";
const DESC = "Confirmá tu compra de productos: modalidad, datos de contacto y enviá por WhatsApp.";

export const Route = createFileRoute("/carrito")({
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
      <h1 className="mb-6 text-2xl font-bold">Carrito de productos</h1>
      <Checkout kind="product" />
    </div>
  ),
});