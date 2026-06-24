import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listServices } from "@/lib/api/services";
import { ServiceCard } from "@/components/ServiceCard";
import { Testimonials } from "@/components/Testimonials";
import { Button } from "@/components/ui/button";
import { business, waLink } from "@/lib/business";
import { MapPin, Clock, Truck, WashingMachine, PackageCheck, ClipboardList, Star, ShieldCheck, Gift } from "lucide-react";
import heroBg from "@/assets/brand/hero-bg.png";

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

  const featuredServices = (servicesQ.data ?? []).filter((s) => s.featured);

  return (
    <div>
      {/* Hero a sangre completa con la foto definitiva de marca. */}
      <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        {/* Capa oscura leve para legibilidad del texto blanco */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-black/55 via-black/35 to-black/25"
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

          {/* Banda de confianza */}
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-white/90">
            <li className="inline-flex items-center gap-2">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 4.1 ★ en Google
            </li>
            <li className="inline-flex items-center gap-2">
              <Truck className="h-4 w-4" /> Envío gratis
            </li>
            <li className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Pago seguro
            </li>
          </ul>
        </div>
      </section>

      {/* Banda de sorteos */}
      <section
        className="text-white"
        style={{ background: "linear-gradient(90deg, #29ABE2 0%, #0A2C7A 100%)" }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <Gift className="h-8 w-8 shrink-0" />
            <div>
              <p className="text-lg font-bold leading-tight">¡Participá de nuestros sorteos!</p>
              <p className="text-sm text-white/85">
                Todos los meses sorteamos servicios y productos entre nuestros clientes.
              </p>
            </div>
          </div>
          <a
            href={waLink("¡Hola! Quiero participar de los sorteos de Lavadero Doña Ofelia.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-primary shadow transition hover:bg-white/90"
          >
            Quiero participar
          </a>
        </div>
      </section>

      {/* Servicios destacados */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <SectionHeader title="Servicios destacados" link={{ to: "/servicios", label: "Ver todos" }} />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((s) => <ServiceCard key={s.slug} service={s} />)}
        </div>
      </section>

      {/* Cómo trabajamos */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold">Cómo trabajamos</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Step n={1} icon={<ClipboardList className="h-5 w-5" />} title="Pedís online" desc="Armás tu pedido o consulta desde la web." />
          <Step n={2} icon={<Truck className="h-5 w-5" />} title="Retiramos o traés" desc="Coordinamos retiro a domicilio o lo dejás en el local." />
          <Step n={3} icon={<WashingMachine className="h-5 w-5" />} title="Lavamos" desc="Tratamos cada prenda según su tipo de tela." />
          <Step n={4} icon={<PackageCheck className="h-5 w-5" />} title="Entregamos" desc="Te devolvemos todo limpio, seco y listo." />
        </ol>
      </section>

      {/* Ubicación — mapa con más protagonismo (más ancho, mismo alto) */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold">Dónde estamos</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="overflow-hidden rounded-lg border md:col-span-2">
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

      {/* Testimonios (Google Maps) */}
      <Testimonials />
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
