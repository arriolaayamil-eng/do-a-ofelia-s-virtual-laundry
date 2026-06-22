import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ImgSlot } from "./ImgSlot";
import { cart } from "@/lib/cart-store";
import { toast } from "sonner";
import type { Product } from "@/mocks/data";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border bg-card">
      <ImgSlot refId={product.imgRef} alt={product.name} ratio="square" className="rounded-none border-0 border-b" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-base font-semibold">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.shortDescription}</p>
        <div className="mt-1 text-sm">
          <span className="font-medium">{product.price}</span>{" "}
          <span className="text-muted-foreground">/ bidón 5 L</span>
        </div>
        <div className="mt-3 flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/productos/$slug" params={{ slug: product.slug }}>Ver detalle</Link>
          </Button>
          <Button
            size="sm"
            onClick={() => {
              cart.add("product", {
                slug: product.slug,
                name: product.name,
                price: product.price,
                quantity: 1,
              });
              toast.success(`${product.name} agregado al carrito`);
            }}
          >
            Agregar
          </Button>
        </div>
      </div>
    </article>
  );
}