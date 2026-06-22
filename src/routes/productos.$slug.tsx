import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { getProduct, listProducts } from "@/lib/api/products";
import { ImgSlot } from "@/components/ImgSlot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cart } from "@/lib/cart-store";
import { toast } from "sonner";

export const Route = createFileRoute("/productos/$slug")({
  loader: async ({ params, context }) => {
    const product = await context.queryClient.ensureQueryData({
      queryKey: ["product", params.slug],
      queryFn: () => getProduct(params.slug),
    });
    if (!product) throw notFound();
    await context.queryClient.ensureQueryData({ queryKey: ["products"], queryFn: listProducts });
    return product;
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.name} — Lavadero Doña Ofelia` : "Producto — Lavadero Doña Ofelia";
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
  component: ProductDetail,
  errorComponent: ({ error }) => <div className="mx-auto max-w-3xl p-8 text-sm text-destructive">{error.message}</div>,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl p-8 text-center">
      <p className="text-sm text-muted-foreground">Producto no encontrado.</p>
      <Button asChild variant="outline" className="mt-4"><Link to="/productos">Ver todos</Link></Button>
    </div>
  ),
});

function ProductDetail() {
  const product = Route.useLoaderData();
  const [qty, setQty] = useState(1);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link to="/productos" className="text-sm text-muted-foreground hover:underline">← Volver a productos</Link>
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <ImgSlot refId={product.imgRef} alt={product.name} ratio="square" />
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="mt-3 text-muted-foreground">{product.description}</p>
          <div className="mt-4 text-base">
            <span className="font-semibold">{product.price}</span>{" "}
            <span className="text-muted-foreground">/ bidón 5 L</span>
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
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  cart.add("product", {
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    quantity: qty,
                  });
                  toast.success(`${product.name} agregado al carrito`);
                }}
              >
                Agregar al carrito
              </Button>
              <Button asChild variant="outline"><Link to="/carrito">Ir al carrito</Link></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}