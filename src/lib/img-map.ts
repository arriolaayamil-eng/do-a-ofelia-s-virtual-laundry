// Registro de imágenes reales por referencia de placeholder (#N).
//
// Reversible: vaciar este objeto (o borrar el archivo y su import en ImgSlot)
// hace que TODOS los slots vuelvan al placeholder punteado original.
//
// Fuente de los crops: prototipo Adobe XD del branding original (Marcos, 2019),
// recortados en src/assets/brand/. Los servicios (#2–#7) y la foto histórica real
// (#13) todavía no tienen foto propia: quedan como placeholder hasta recibir los
// assets definitivos de Marcos / sesión de fotos.

import hero from "@/assets/brand/hero.png";
import historia from "@/assets/brand/historia.png";
import quitamanchas from "@/assets/brand/prod-quitamanchas.png";
import perfumina from "@/assets/brand/prod-perfumina.png";
import lavandina from "@/assets/brand/prod-lavandina.png";
import liquido from "@/assets/brand/prod-liquido.png";
import suavizante from "@/assets/brand/prod-suavizante.png";

// Clave = el "#N" inicial de la referencia (refId / imgRef).
const imgMap: Record<string, string> = {
  "#1": hero, // Hero del lavadero (splash de marca)
  "#8": quitamanchas,
  "#9": perfumina,
  "#10": lavandina,
  "#11": liquido,
  "#12": suavizante,
  "#13": historia, // banner de marca para la sección Historia
};

/** Devuelve la URL de la imagen real para un refId tipo "#8 — Bidón…", o undefined. */
export function imgFor(refId: string): string | undefined {
  const m = refId.match(/^#(\d+)/);
  return m ? imgMap[`#${m[1]}`] : undefined;
}
