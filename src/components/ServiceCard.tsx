import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ImgSlot } from "./ImgSlot";
import { cart } from "@/lib/cart-store";
import { toast } from "sonner";
import type { Service } from "@/mocks/data";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border bg-card">
      <ImgSlot refId={service.imgRef} alt={service.name} ratio="video" className="rounded-none border-0 border-b" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{service.category}</div>
        <h3 className="text-base font-semibold">{service.name}</h3>
        <p className="text-sm text-muted-foreground">{service.shortDescription}</p>
        <div className="mt-1 text-sm">
          <span className="font-medium">{service.price}</span>{" "}
          <span className="text-muted-foreground">/ {service.unit}</span>
        </div>
        <div className="mt-3 flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/servicios/$slug" params={{ slug: service.slug }}>Ver detalle</Link>
          </Button>
          <Button
            size="sm"
            onClick={() => {
              cart.add("service", {
                slug: service.slug,
                name: service.name,
                unit: service.unit,
                price: service.price,
                quantity: 1,
              });
              toast.success(`${service.name} agregado al pedido`);
            }}
          >
            Agregar al pedido
          </Button>
        </div>
      </div>
    </article>
  );
}