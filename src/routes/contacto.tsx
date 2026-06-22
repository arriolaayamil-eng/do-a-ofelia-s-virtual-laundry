import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { business, waLink } from "@/lib/business";
import { MapPin, Clock, Phone, MessageCircle, CheckCircle2 } from "lucide-react";

const TITLE = "Contacto — Lavadero Doña Ofelia";
const DESC = "Contactanos: Av. La Plata 828, Ostende, Pinamar. Tel/WhatsApp (02254) 40-7932.";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/contacto" },
    ],
    links: [{ rel: "canonical", href: "/contacto" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: business.name,
        telephone: business.phoneDisplay,
        address: {
          "@type": "PostalAddress",
          streetAddress: "Av. La Plata 828",
          addressLocality: "Ostende",
          addressRegion: "Buenos Aires",
          addressCountry: "AR",
        },
        openingHours: business.hoursSchema,
      }),
    }],
  }),
  component: Contacto,
});

const schema = z.object({
  name: z.string().trim().min(2, "Ingresá tu nombre").max(80),
  phone: z.string().trim().regex(/^[\d\s+()-]{6,20}$/, "Teléfono inválido"),
  email: z.string().trim().email("Email inválido").max(120),
  message: z.string().trim().min(5, "Contanos un poco más").max(1000),
});
type Values = z.infer<typeof schema>;

function Contacto() {
  const [sent, setSent] = useState<string | null>(null);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { name: "", phone: "", email: "", message: "" } });

  function onSubmit(values: Values) {
    const text = [
      `*${business.name} — Consulta web*`,
      `Nombre: ${values.name}`,
      `Teléfono: ${values.phone}`,
      `Email: ${values.email}`,
      "",
      values.message,
    ].join("\n");
    setSent(waLink(text));
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold">Contacto</h1>
      <p className="mt-2 text-sm text-muted-foreground">Estamos en Ostende, atendemos de lunes a sábado.</p>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="space-y-3 text-sm">
          <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {business.address}</p>
          <p className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0" /> {business.hours}</p>
          <p className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0" /> {business.phoneDisplay}</p>
          <div className="mt-4 overflow-hidden rounded-lg border">
            <iframe title="Mapa" src={business.mapsEmbed} className="h-64 w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-5">
          {sent ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-green-600" />
              <h2 className="mt-2 text-lg font-semibold">¡Mensaje listo!</h2>
              <p className="mt-1 text-sm text-muted-foreground">Para que nos llegue, enviá la consulta por WhatsApp.</p>
              <a href={sent} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
                <MessageCircle className="h-4 w-4" /> Enviar por WhatsApp
              </a>
              <div className="mt-3">
                <Button variant="outline" onClick={() => { setSent(null); form.reset(); }}>Enviar otro</Button>
              </div>
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <h2 className="text-lg font-semibold">Escribinos</h2>
              <div>
                <Label className="mb-1 block text-sm">Nombre</Label>
                <Input {...form.register("name")} />
                {form.formState.errors.name && <p className="mt-1 text-xs text-destructive">{form.formState.errors.name.message}</p>}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="mb-1 block text-sm">Teléfono</Label>
                  <Input {...form.register("phone")} inputMode="tel" />
                  {form.formState.errors.phone && <p className="mt-1 text-xs text-destructive">{form.formState.errors.phone.message}</p>}
                </div>
                <div>
                  <Label className="mb-1 block text-sm">Email</Label>
                  <Input type="email" {...form.register("email")} />
                  {form.formState.errors.email && <p className="mt-1 text-xs text-destructive">{form.formState.errors.email.message}</p>}
                </div>
              </div>
              <div>
                <Label className="mb-1 block text-sm">Mensaje</Label>
                <Textarea rows={5} {...form.register("message")} />
                {form.formState.errors.message && <p className="mt-1 text-xs text-destructive">{form.formState.errors.message.message}</p>}
              </div>
              <Button type="submit" className="w-full">Enviar consulta</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}