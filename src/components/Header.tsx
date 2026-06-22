import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { business } from "@/lib/business";
import { useCartCount } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Inicio" },
  { to: "/servicios", label: "Servicios" },
  { to: "/productos", label: "Productos" },
  { to: "/historia", label: "Historia" },
  { to: "/preguntas-frecuentes", label: "Preguntas" },
  { to: "/contacto", label: "Contacto" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const serviceCount = useCartCount("service");
  const productCount = useCartCount("product");

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex flex-col leading-tight">
          <span className="text-base font-semibold">{business.name}</span>
          <span className="hidden text-xs text-muted-foreground sm:block">{business.slogan}</span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm text-foreground/80 hover:text-foreground"
              activeProps={{ className: "text-sm font-semibold text-foreground" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <CartButton to="/pedido-servicio" count={serviceCount} label="Pedido de servicios" icon="bag" />
          <CartButton to="/carrito" count={productCount} label="Carrito de productos" icon="cart" />
          <button
            type="button"
            aria-label="Abrir menú"
            className="rounded-md p-2 md:hidden hover:bg-accent"
            onClick={() => setOpen((v) => !v)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t bg-background md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-2 py-2">
            {nav.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
                  activeProps={{ className: "block rounded-md px-3 py-2 text-sm font-semibold bg-accent" }}
                  activeOptions={{ exact: n.to === "/" }}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

function CartButton({
  to,
  count,
  label,
  icon,
}: {
  to: "/pedido-servicio" | "/carrito";
  count: number;
  label: string;
  icon: "bag" | "cart";
}) {
  const Icon = icon === "bag" ? ShoppingBag : ShoppingCart;
  return (
    <Link
      to={to}
      aria-label={label}
      className={cn(
        "relative inline-flex items-center justify-center rounded-md p-2 hover:bg-accent",
      )}
    >
      <Icon className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}