import { Star } from "lucide-react";

/**
 * Testimonios reales de la ficha de Google Maps del negocio
 * (Lavadero de ropa "Doña Ofelia" — 4.1 ★, 45 opiniones).
 * Capturados el 2026-06-23. Solo se incluyen opiniones de 4-5 estrellas.
 */
const REVIEWS: { name: string; stars: number; text: string }[] = [
  {
    name: "Ce Noel",
    stars: 5,
    text: "El mejor lugar de Pinamar para lavar la ropa. Quedó todo impecable y la señora fue súper amable ✨",
  },
  {
    name: "Prof. Reano Walter",
    stars: 5,
    text: "Excelente atención de la propietaria y los hijos, calidad en el lavado y entrega en tiempo y forma.",
  },
  {
    name: "Nicolás Fernández",
    stars: 5,
    text: "Sin dudas el mejor lavadero. Soy un desastre con la ropa y me la dejan impecable 🤗",
  },
  {
    name: "SBG",
    stars: 4,
    text: "Lavado personal, atienden muy cordialmente y la ropa sale limpia y perfumada.",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={
            i < count
              ? "h-4 w-4 fill-amber-400 text-amber-400"
              : "h-4 w-4 text-muted-foreground/30"
          }
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: (typeof REVIEWS)[number] }) {
  return (
    <figure className="flex w-72 shrink-0 flex-col rounded-lg border bg-card p-4 sm:w-80">
      <Stars count={review.stars} />
      <blockquote className="mt-3 flex-1 text-sm text-muted-foreground">
        “{review.text}”
      </blockquote>
      <figcaption className="mt-3 text-sm font-semibold">{review.name}</figcaption>
    </figure>
  );
}

export function Testimonials() {
  return (
    <section className="bg-zinc-800 py-12 text-white">
      <div className="mx-auto mb-6 flex max-w-6xl items-end justify-between gap-2 px-4">
        <h2 className="text-2xl font-bold">Lo que dicen en Google</h2>
        <span className="flex items-center gap-1.5 text-sm font-semibold text-white/80">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 4.1 · 45 opiniones
        </span>
      </div>

      {/* Carrusel marquee infinito (lista duplicada para loop sin salto) */}
      <div
        className="marquee-pause group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
      >
        <div className="animate-marquee flex w-max gap-4 pr-4">
          {REVIEWS.map((r) => (
            <ReviewCard key={r.name} review={r} />
          ))}
          {/* duplicado para el loop continuo */}
          {REVIEWS.map((r) => (
            <ReviewCard key={`dup-${r.name}`} review={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
