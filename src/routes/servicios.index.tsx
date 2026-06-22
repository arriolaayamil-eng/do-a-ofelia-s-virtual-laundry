import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { listServices } from "@/lib/api/services";
import { ServiceCard } from "@/components/ServiceCard";
import { CategoryFilter } from "@/components/CategoryFilter";

const TITLE = "Servicios — Lavadero Doña Ofelia";
const DESC = "Servicios de lavandería en Ostende, Pinamar: valet, acolchados de guata y pluma, almohadas, manteles y cortinas.";

export const Route = createFileRoute("/servicios/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/servicios" },
    ],
    links: [{ rel: "canonical", href: "/servicios" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: listServices });
  const [cat, setCat] = useState("Todas");

  const categories = useMemo(
    () => Array.from(new Set(services.map((s) => s.category))),
    [services],
  );
  const filtered = cat === "Todas" ? services : services.filter((s) => s.category === cat);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof services>();
    filtered.forEach((s) => {
      const arr = map.get(s.category) ?? [];
      arr.push(s);
      map.set(s.category, arr);
    });
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header>
        <h1 className="text-3xl font-bold">Nuestros servicios</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Elegí los servicios que necesités y sumalos a tu pedido. Coordinamos retiro y entrega o lo gestionás en el local.
        </p>
      </header>
      <div className="mt-6">
        <CategoryFilter categories={categories} value={cat} onChange={setCat} />
      </div>
      <div className="mt-8 space-y-10">
        {grouped.map(([category, items]) => (
          <section key={category}>
            <h2 className="text-lg font-semibold">{category}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((s) => <ServiceCard key={s.slug} service={s} />)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}