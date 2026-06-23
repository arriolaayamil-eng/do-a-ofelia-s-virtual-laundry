import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, ShoppingBag, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { business } from "@/lib/business";
import { useCartCount } from "@/lib/cart-store";
import { cn } from "@/lib/utils";
import logo from "@/assets/brand/logo-white.png";

const nav = [
  { to: "/", label: "Inicio" },
  { to: "/servicios", label: "Servicios" },
  { to: "/productos", label: "Productos" },
  { to: "/historia", label: "Historia" },
  { to: "/preguntas-frecuentes", label: "Preguntas" },
  { to: "/contacto", label: "Contacto" },
] as const;

const HEADER_H = "h-16"; // alto del header (64px), usado también para el spacer

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const serviceCount = useCartCount("service");
  const productCount = useCartCount("product");

  // Solo la home tiene hero a sangre completa detrás del navbar.
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const overlay = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Transparente sobre el hero hasta que arranca el scroll (o se abre el menú).
  const transparent = overlay && !scrolled && !open;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 text-primary-foreground transition-colors duration-300",
          transparent
            ? "bg-transparent"
            : "border-b border-white/10 bg-primary shadow-sm",
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5">
          <Link to="/" aria-label={business.name} className="flex items-center">
            <img
              src={logo}
              alt={business.name}
              className="h-11 w-auto drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]"
            />
          </Link>

          <nav className="hidden items-center gap-5 md:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]"
                activeProps={{ className: "text-sm font-semibold text-primary-foreground [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]" }}
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
              className="rounded-md p-2 md:hidden hover:bg-white/10"
              onClick={() => setOpen((v) => !v)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {open && (
          <nav className="border-t border-white/10 bg-primary md:hidden">
            <ul className="mx-auto flex max-w-6xl flex-col px-2 py-2">
              {nav.map((n) => (
                <li key={n.to}>
                  <Link
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm text-primary-foreground/90 hover:bg-white/10"
                    activeProps={{ className: "block rounded-md px-3 py-2 text-sm font-semibold bg-white/15 text-primary-foreground" }}
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

      {/* Spacer: empuja el contenido sólo cuando el header NO está en modo overlay. */}
      {!overlay && <div className={HEADER_H} aria-hidden />}
    </>
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
        "relative inline-flex items-center justify-center rounded-md p-2 hover:bg-white/10",
      )}
    >
      <Icon className="h-5 w-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-chart-2 px-1 text-[10px] font-semibold text-primary">
          {count}
        </span>
      )}
    </Link>
  );
}
