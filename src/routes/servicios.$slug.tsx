import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { getService, listServices } from "@/lib/api/services";
import { ImgSlot } from "@/components/ImgSlot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cart } from "@/lib/cart-store";
import { toast } from "sonner";

export const Route = createFileRoute("/servicios/$slug")({
  loader: async ({ params, context }) => {
    const service = await context.queryClient.ensureQueryData({
      queryKey: ["service", params.slug],
      queryFn: () => getService(params.slug),
    });
    if (!service) throw notFound();
    await context.queryClient.ensureQueryData({ queryKey: ["services"], queryFn: listServices });
    return service;
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.name} — Lavadero Doña Ofelia` : "Servicio — Lavadero Doña Ofelia";
    const desc = loaderData?.shortDescription ?? "";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
      ],
    };
  },
  component: ServiceDetail,
  errorComponent: ({ error }) => <div className="mx-auto max-w-3xl p-8 text-sm text-destructive">{error.message}</div>,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl p-8 text-center">
      <p className="text-sm text-muted-foreground">Servicio no encontrado.</p>
      <Button asChild variant="outline" className="mt-4"><Link to="/servicios">Ver todos</Link></Button>
    </div>
  ),
});

function ServiceDetail() {
  const service = Route.useLoaderData();
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link to="/servicios" className="text-sm text-muted-foreground hover:underline">← Volver a servicios</Link>
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <ImgSlot refId={service.imgRef} alt={service.name} />
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{service.category}</div>
          <h1 className="mt-1 text-3xl font-bold">{service.name}</h1>
          <p className="mt-3 text-muted-foreground">{service.description}</p>
          <div className="mt-4 text-base">
            <span className="font-semibold">{service.price}</span>{" "}
            <span className="text-muted-foreground">/ {service.unit}</span>
          </div>

          <div className="mt-6 space-y-3">
            <div>
              <Label className="mb-1 block text-sm">Cantidad</Label>
              <Input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                className="w-28"
              />
            </div>
            <div>
              <Label className="mb-1 block text-sm">Notas (opcional)</Label>
              <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  cart.add("service", {
                    slug: service.slug,
                    name: service.name,
                    unit: service.unit,
                    price: service.price,
                    quantity: qty,
                    notes: notes || undefined,
                  });
                  toast.success(`${service.name} agregado al pedido`);
                }}
              >
                Agregar al pedido
              </Button>
              <Button asChild variant="outline"><Link to="/pedido-servicio">Ir al pedido</Link></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}