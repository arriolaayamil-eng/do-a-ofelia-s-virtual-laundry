import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listServices } from "@/lib/api/services";
import { listProducts } from "@/lib/api/products";
import { ServiceCard } from "@/components/ServiceCard";
import { ProductCard } from "@/components/ProductCard";
import { ImgSlot } from "@/components/ImgSlot";
import { Button } from "@/components/ui/button";
import { business } from "@/lib/business";
import { MapPin, Clock, Truck, WashingMachine, PackageCheck, ClipboardList } from "lucide-react";

const TITLE = "Lavadero Doña Ofelia — Lavandería en Ostende, Pinamar";
const DESC = "Lavandería familiar en Ostende, Pinamar. Servicio de valet, acolchados, almohadas, manteles, cortinas y productos de limpieza en bidón de 5 L.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LaundryService",
          name: business.name,
          description: DESC,
          telephone: business.phoneDisplay,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Av. La Plata 828",
            addressLocality: "Ostende",
            addressRegion: "Buenos Aires",
            addressCountry: "AR",
          },
          openingHours: business.hoursSchema,
          slogan: business.slogan,
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  const servicesQ = useQuery({ queryKey: ["services"], queryFn: listServices });
  const productsQ = useQuery({ queryKey: ["products"], queryFn: listProducts });

  const featuredServices = (servicesQ.data ?? []).filter((s) => s.featured);
  const featuredProducts = (productsQ.data ?? []).filter((p) => p.featured);

  return (
    <div>
      {/* Hero a sangre completa con imagen de fondo.
          PLACEHOLDER: gradiente de marca. Para usar la foto definitiva:
          1) guardar la imagen en src/assets/brand/ (ej. hero-bg.jpg)
          2) importarla arriba:  import heroBg from "@/assets/brand/hero-bg.jpg"
          3) en el div de fondo, reemplazar el `background` del style por
             `backgroundImage: \`url(\${heroBg})\``  (ya tiene bg-cover bg-center). */}
      <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{
            background:
              "radial-gradient(120% 120% at 72% 8%, #2a5bc0 0%, #0A2C7A 52%, #071F57 100%)",
          }}
        />
        {/* Velo para legibilidad del texto blanco */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-t from-black/55 via-black/20 to-black/35"
        />

        <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-28 text-white md:pb-28 md:pt-32">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
            Ostende · Pinamar
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-[1.05] drop-shadow-md md:text-6xl">
            {business.name}
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/servicios"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-primary shadow-lg transition hover:bg-white/90"
            >
              Pedir un servicio
            </Link>
            <Link
              to="/productos"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white/80 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Comprar productos
            </Link>
          </div>
        </div>
      </section>

      {/* Servicios destacados */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <SectionHeader title="Servicios destacados" link={{ to: "/servicios", label: "Ver todos" }} />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((s) => <ServiceCard key={s.slug} service={s} />)}
        </div>
      </section>

      {/* Productos destacados */}
      <section className="bg-muted/30 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeader title="Productos destacados" link={{ to: "/productos", label: "Ver todos" }} />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </div>
      </section>

      {/* Historia (extracto) */}
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2 md:items-center">
        <ImgSlot refId="#13 — Foto de Ofelia Acevedo / familia / negocio antiguo" alt="Ofelia Acevedo, fundadora" />
        <div>
          <h2 className="text-2xl font-bold">Nuestra historia</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Un negocio familiar fundado por Ofelia Acevedo en Malabrigo, Santa Fe, en los años 50. Madre de 8 hijos, empezó lavando y planchando con un fuentón de chapa, una tabla de lavar a mano y una plancha a carbón.
          </p>
          <div className="mt-5">
            <Button asChild variant="outline"><Link to="/historia">Leer la historia completa</Link></Button>
          </div>
        </div>
      </section>

      {/* Cómo trabajamos */}
      <section className="bg-muted/30 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold">Cómo trabajamos</h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Step n={1} icon={<ClipboardList className="h-5 w-5" />} title="Pedís online" desc="Armás tu pedido o consulta desde la web." />
            <Step n={2} icon={<Truck className="h-5 w-5" />} title="Retiramos o traés" desc="Coordinamos retiro a domicilio o lo dejás en el local." />
            <Step n={3} icon={<WashingMachine className="h-5 w-5" />} title="Lavamos" desc="Tratamos cada prenda según su tipo de tela." />
            <Step n={4} icon={<PackageCheck className="h-5 w-5" />} title="Entregamos" desc="Te devolvemos todo limpio, seco y listo." />
          </ol>
        </div>
      </section>

      {/* Ubicación */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold">Dónde estamos</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-lg border">
            <iframe
              title="Mapa de Lavadero Doña Ofelia"
              src={business.mapsEmbed}
              className="h-72 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="space-y-3 text-sm">
            <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {business.address}</p>
            <p className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0" /> {business.hours}</p>
            <p>Tel/WhatsApp: <strong>{business.phoneDisplay}</strong></p>
            <Button asChild><Link to="/contacto">Ir a Contacto</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title, link }: { title: string; link: { to: "/servicios" | "/productos"; label: string } }) {
  return (
    <div className="flex items-end justify-between gap-2">
      <h2 className="text-2xl font-bold">{title}</h2>
      <Link to={link.to} className="text-sm text-foreground/80 underline hover:text-foreground">{link.label}</Link>
    </div>
  );
}

function Step({ n, icon, title, desc }: { n: number; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <li className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background text-xs">{n}</span>
        <span className="inline-flex items-center gap-1.5">{icon} {title}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </li>
  );
}
