import { createFileRoute } from "@tanstack/react-router";
import { ImgSlot } from "@/components/ImgSlot";

const TITLE = "Nuestra historia — Lavadero Doña Ofelia";
const DESC = "La historia de Ofelia Acevedo, fundadora del Lavadero Doña Ofelia: de Malabrigo (Santa Fe) a Ostende, Pinamar.";

export const Route = createFileRoute("/historia")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: "/historia" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "/historia" }],
  }),
  component: Historia,
});

function Historia() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold md:text-4xl">Nuestra historia</h1>
      <p className="mt-2 text-sm text-muted-foreground">Un negocio familiar con más de 70 años de oficio.</p>
      <ImgSlot
        refId="#13 — Foto histórica: Ofelia Acevedo y/o familia"
        alt="Ofelia Acevedo, fundadora del Lavadero Doña Ofelia"
        ratio="wide"
        className="mt-6"
      />
      <div className="prose mt-8 max-w-none text-sm leading-relaxed text-foreground/90">
        <p>
          El Lavadero Doña Ofelia es un negocio familiar fundado por <strong>Ofelia Acevedo</strong> en
          Malabrigo, provincia de Santa Fe, en los años 50. Madre de 8 hijos, Ofelia fue la primera mujer
          del pueblo en dedicarse al oficio: empezó lavando y planchando ropa ajena con un fuentón de
          chapa, una tabla de lavar a mano y una plancha a carbón, porque todavía no había electricidad.
        </p>
        <p className="mt-4">
          Con el tiempo, ese oficio se convirtió en tradición. Hoy, varias generaciones después,
          seguimos cuidando cada prenda con el mismo compromiso de Ofelia: trabajo prolijo,
          atención cercana y respeto por lo que cada cliente nos confía.
        </p>
        <p className="mt-4">
          En Ostende, sobre Av. La Plata 828, mantenemos viva esa historia. Sumamos máquinas y procesos
          modernos, pero seguimos siendo lo que fuimos siempre: una familia que lava y plancha como si
          fuera para los suyos.
        </p>
        <p className="mt-6 text-muted-foreground italic">
          (Texto editable. El cliente puede reemplazar este contenido por la versión final del relato.)
        </p>
      </div>
    </article>
  );
}