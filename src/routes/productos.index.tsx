import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listProducts } from "@/lib/api/products";
import { ProductCard } from "@/components/ProductCard";

const TITLE = "Productos — Lavadero Doña Ofelia";
const DESC = "Productos propios de limpieza en bidón de 5 L: quitamanchas, perfumina, lavandina, líquido para lavar ropa y suavizante.";

export const Route = createFileRoute("/productos/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/productos" },
    ],
    links: [{ rel: "canonical", href: "/productos" }],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: listProducts });
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header>
        <h1 className="text-3xl font-bold">Nuestros productos</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Bidones de 5 L de producción propia. Calidad pensada para uso doméstico y profesional.
        </p>
      </header>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => <ProductCard key={p.slug} product={p} />)}
      </div>
    </div>
  );
}