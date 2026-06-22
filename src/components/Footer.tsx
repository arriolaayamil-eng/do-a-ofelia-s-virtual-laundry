import { Link } from "@tanstack/react-router";
import { business } from "@/lib/business";

export function Footer() {
  return (
    <footer className="mt-16 border-t bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <h3 className="text-sm font-semibold">{business.name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{business.slogan}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Contacto</h3>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>{business.address}</li>
            <li>Tel/WhatsApp: {business.phoneDisplay}</li>
            <li>{business.hours}</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Navegación</h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link to="/servicios" className="text-muted-foreground hover:text-foreground">Servicios</Link></li>
            <li><Link to="/productos" className="text-muted-foreground hover:text-foreground">Productos</Link></li>
            <li><Link to="/historia" className="text-muted-foreground hover:text-foreground">Nuestra historia</Link></li>
            <li><Link to="/preguntas-frecuentes" className="text-muted-foreground hover:text-foreground">Preguntas frecuentes</Link></li>
            <li><Link to="/contacto" className="text-muted-foreground hover:text-foreground">Contacto</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {business.name}. Todos los derechos reservados.
      </div>
    </footer>
  );
}