import { Link } from "@tanstack/react-router";
import { business } from "@/lib/business";
import logo from "@/assets/brand/logo-white.png";

export function Footer() {
  return (
    <footer className="mt-16 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <img src={logo} alt={business.name} className="h-16 w-auto" />
          <p className="mt-3 text-sm text-primary-foreground/70">{business.slogan}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Contacto</h3>
          <ul className="mt-2 space-y-1 text-sm text-primary-foreground/70">
            <li>{business.address}</li>
            <li>Tel/WhatsApp: {business.phoneDisplay}</li>
            <li>{business.hours}</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Navegación</h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link to="/servicios" className="text-primary-foreground/70 hover:text-primary-foreground">Servicios</Link></li>
            <li><Link to="/productos" className="text-primary-foreground/70 hover:text-primary-foreground">Productos</Link></li>
            <li><Link to="/historia" className="text-primary-foreground/70 hover:text-primary-foreground">Nuestra historia</Link></li>
            <li><Link to="/preguntas-frecuentes" className="text-primary-foreground/70 hover:text-primary-foreground">Preguntas frecuentes</Link></li>
            <li><Link to="/contacto" className="text-primary-foreground/70 hover:text-primary-foreground">Contacto</Link></li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 border-t border-primary-foreground/15 py-4 text-center text-xs text-primary-foreground/70">
        <span>© {new Date().getFullYear()} {business.name}. Todos los derechos reservados.</span>
        <span>
          Powered by{" "}
          <a
            href="https://agentika.com.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary-foreground hover:underline"
          >
            Agentika
          </a>
        </span>
      </div>
    </footer>
  );
}