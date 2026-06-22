export const business = {
  name: "Lavadero Doña Ofelia",
  slogan: "Buen servicio y calidad",
  address: "Av. La Plata 828, Ostende, Ptdo. de Pinamar, Bs. As.",
  phoneDisplay: "(02254) 40-7932",
  // E.164 sin '+' para wa.me. Pinamar 02254 -> +54 9 2254 407932
  whatsappNumber: "5492254407932",
  hours: "Lunes a sábado de 9 a 13 y de 17 a 21",
  hoursSchema: "Mo-Sa 09:00-13:00,17:00-21:00",
  email: "contacto@lavaderodonaofelia.com.ar",
  mapsEmbed:
    "https://www.google.com/maps?q=Av.+La+Plata+828,+Ostende,+Pinamar&output=embed",
};

export function waLink(text: string) {
  return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

let srvSeq = 0;
let prdSeq = 0;
export function nextCode(kind: "SRV" | "PRD") {
  const n = kind === "SRV" ? ++srvSeq : ++prdSeq;
  return `${kind}-${String(n).padStart(4, "0")}`;
}