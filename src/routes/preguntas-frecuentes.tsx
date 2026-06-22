import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const TITLE = "Preguntas frecuentes — Lavadero Doña Ofelia";
const DESC = "Dudas comunes sobre nuestros servicios de lavandería y productos de limpieza en Ostende, Pinamar.";

const faqs = [
  { q: "¿Hacen retiro y entrega a domicilio?", a: "Sí, coordinamos retiro y entrega en Ostende, Pinamar y zonas cercanas. Lo definimos al hacer el pedido." },
  { q: "¿Cuánto demora un servicio de lavado?", a: "Depende del tipo de prenda y la temporada. Te confirmamos el plazo al recibir el pedido." },
  { q: "¿Lavan acolchados de pluma?", a: "Sí, tenemos un proceso especial para acolchados de pluma que cuida el relleno." },
  { q: "¿Cómo cotizan el servicio de cortinas?", a: "Las cortinas se cotizan por metro cuadrado. Necesitamos las medidas para el presupuesto." },
  { q: "¿Los productos de limpieza son propios?", a: "Sí, son de elaboración propia y se venden en bidones de 5 litros." },
  { q: "¿Qué medios de pago aceptan?", a: "Aceptamos efectivo, transferencia y los principales medios electrónicos. Consultá al hacer el pedido." },
  { q: "¿Atienden los domingos?", a: "No, atendemos de lunes a sábado de 9 a 13 y de 17 a 21." },
  { q: "¿Puedo combinar servicios y productos en un mismo pedido?", a: "Por el momento gestionamos los pedidos por separado: uno para servicios y otro para productos." },
];

export const Route = createFileRoute("/preguntas-frecuentes")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/preguntas-frecuentes" },
    ],
    links: [{ rel: "canonical", href: "/preguntas-frecuentes" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }),
    }],
  }),
  component: FAQ,
});

function FAQ() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Preguntas frecuentes</h1>
      <p className="mt-2 text-sm text-muted-foreground">Las dudas más comunes de nuestros clientes.</p>
      <Accordion type="single" collapsible className="mt-6">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}