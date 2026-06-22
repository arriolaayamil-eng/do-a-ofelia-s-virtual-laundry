export type Service = {
  slug: string;
  name: string;
  category: string;
  unit: string;
  price: string;
  shortDescription: string;
  description: string;
  imgRef: string;
  featured?: boolean;
};

export type Product = {
  slug: string;
  name: string;
  price: string;
  shortDescription: string;
  description: string;
  imgRef: string;
  featured?: boolean;
};

export const services: Service[] = [
  {
    slug: "valet",
    name: "Servicio de valet",
    category: "Servicios generales",
    unit: "a presupuestar",
    price: "Consultar",
    shortDescription: "Lavado integral de tu ropa, presupuesto a medida.",
    description:
      "Servicio de valet completo: lavado, secado y planchado de prendas. Coordinamos retiro y entrega, y armamos un presupuesto personalizado según volumen y tipo de prendas.",
    imgRef: "#2 — Servicio de valet (ropa doblada sobre mesada)",
    featured: true,
  },
  {
    slug: "acolchados-guata",
    name: "Acolchados comunes (relleno de guata)",
    category: "Acolchados y plumas",
    unit: "por pieza",
    price: "Consultar",
    shortDescription: "Lavado y secado de acolchados con relleno de guata.",
    description:
      "Lavado profundo de acolchados con relleno de guata. Cuidamos la fibra y devolvemos la prenda lista para usar.",
    imgRef: "#3 — Acolchado con relleno de guata",
    featured: true,
  },
  {
    slug: "acolchados-pluma",
    name: "Acolchados de pluma",
    category: "Acolchados y plumas",
    unit: "por pieza",
    price: "Consultar",
    shortDescription: "Tratamiento especial para acolchados de pluma.",
    description:
      "Lavado y secado especial para acolchados de pluma, manteniendo el volumen y la suavidad del relleno.",
    imgRef: "#4 — Acolchado de pluma",
  },
  {
    slug: "almohadas",
    name: "Almohadas",
    category: "Acolchados y plumas",
    unit: "por unidad",
    price: "Consultar",
    shortDescription: "Lavado de almohadas, todos los rellenos.",
    description:
      "Lavado de almohadas, devolvemos la firmeza y la higiene a tu descanso.",
    imgRef: "#5 — Almohadas apiladas",
  },
  {
    slug: "manteles",
    name: "Manteles",
    category: "Hogar",
    unit: "por pieza",
    price: "Consultar",
    shortDescription: "Lavado y planchado de manteles.",
    description:
      "Lavado profesional de manteles de todo tipo, entregados planchados y listos para usar.",
    imgRef: "#6 — Mantel planchado",
    featured: true,
  },
  {
    slug: "cortinas",
    name: "Cortinas",
    category: "Hogar",
    unit: "por m²",
    price: "Consultar",
    shortDescription: "Lavado de cortinas, presupuesto por metro cuadrado.",
    description:
      "Lavado de cortinas con cuidado de telas y caída. Presupuesto por metro cuadrado.",
    imgRef: "#7 — Cortinas colgadas",
  },
];

export const products: Product[] = [
  {
    slug: "quitamanchas",
    name: "Quitamanchas",
    price: "Consultar",
    shortDescription: "Remueve manchas difíciles en prendas y telas.",
    description:
      "Quitamanchas concentrado en bidón de 5 L. Removedor eficaz para manchas difíciles en prendas, telas y tapizados.",
    imgRef: "#8 — Bidón 5 L de quitamanchas",
    featured: true,
  },
  {
    slug: "perfumina",
    name: "Perfumina",
    price: "Consultar",
    shortDescription:
      "Aroma duradero para ropa, hogar, autos, roperos, sillones, baños y alfombras.",
    description:
      "Perfumina en bidón de 5 L. Aroma fresco y duradero para ropa, hogar, autos, roperos, sillones, baños y alfombras.",
    imgRef: "#9 — Bidón 5 L de perfumina",
    featured: true,
  },
  {
    slug: "lavandina",
    name: "Lavandina",
    price: "Consultar",
    shortDescription: "Limpia y desinfecta cocinas, baños y patios.",
    description:
      "Lavandina en bidón de 5 L. Limpia y desinfecta cocinas, baños, patios y ambientes.",
    imgRef: "#10 — Bidón 5 L de lavandina",
  },
  {
    slug: "liquido-ropa",
    name: "Líquido para lavar ropa",
    price: "Consultar",
    shortDescription: "Para lavarropas automáticos.",
    description:
      "Líquido para lavar ropa en bidón de 5 L. Apto para lavarropas automáticos.",
    imgRef: "#11 — Bidón 5 L de jabón líquido",
    featured: true,
  },
  {
    slug: "suavizante",
    name: "Suavizante",
    price: "Consultar",
    shortDescription: "Prendas suaves y planchado más fácil.",
    description:
      "Suavizante en bidón de 5 L. Devuelve suavidad a las prendas y facilita el planchado.",
    imgRef: "#12 — Bidón 5 L de suavizante",
  },
];