// Registro de imágenes reales por referencia de placeholder (#N).
//
// Reversible: vaciar este objeto (o borrar el archivo y su import en ImgSlot)
// hace que TODOS los slots vuelvan al placeholder punteado original.
//
// Fuente de los crops: prototipo Adobe XD del branding original (Marcos, 2019),
// recortados en src/assets/brand/. Todos los servicios (#2–#7) usan fotos de stock
// libres (Unsplash, uso comercial gratuito) hasta tener sesión propia; solo la foto
// histórica real (#13) sigue como placeholder hasta recibir el asset de Marcos.

import hero from "@/assets/brand/hero.png";
import historia from "@/assets/brand/historia.png";
import quitamanchas from "@/assets/brand/prod-quitamanchas.png";
import perfumina from "@/assets/brand/prod-perfumina.png";
import lavandina from "@/assets/brand/prod-lavandina.png";
import liquido from "@/assets/brand/prod-liquido.png";
import suavizante from "@/assets/brand/prod-suavizante.png";
import srvValet from "@/assets/brand/srv-valet.jpg";
import srvAcolchado from "@/assets/brand/srv-acolchado.jpg";
import srvMantel from "@/assets/brand/srv-mantel.jpg";
import srvPluma from "@/assets/brand/srv-pluma.jpg";
import srvAlmohadas from "@/assets/brand/srv-almohadas.jpg";
import srvCortinas from "@/assets/brand/srv-cortinas.jpg";

// Clave = el "#N" inicial de la referencia (refId / imgRef).
const imgMap: Record<string, string> = {
  "#1": hero, // Hero del lavadero (splash de marca)
  "#2": srvValet, // Servicio de valet (ropa doblada) — stock Unsplash
  "#3": srvAcolchado, // Acolchado con relleno de guata — stock Unsplash
  "#4": srvPluma, // Acolchado de pluma — stock Unsplash
  "#5": srvAlmohadas, // Almohadas apiladas — stock Unsplash
  "#6": srvMantel, // Mantel planchado — stock Unsplash
  "#7": srvCortinas, // Cortinas colgadas — stock Unsplash
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
