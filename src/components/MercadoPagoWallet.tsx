import { useEffect, useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { Lock } from "lucide-react";

// Public Key de Mercado Pago (segura para el frontend). El Access Token (secreto)
// vive SOLO en el backend. Detalle técnico y scaffolding en docs/MERCADOPAGO.md.
const PUBLIC_KEY = (import.meta.env.VITE_MP_PUBLIC_KEY ?? "").toString().trim();

// initMercadoPago debe llamarse una sola vez en toda la app.
let mpInitialized = false;

type Props = {
  /** preferenceId del backend (POST /api/orders). null = todavía sin backend/credenciales. */
  preferenceId: string | null;
  loading?: boolean;
};

/**
 * Bloque de pago con Mercado Pago. Cuando están la Public Key y el preferenceId,
 * monta el Wallet Brick oficial (el usuario paga sin salir del sitio). Mientras eso
 * se configura, muestra una tarjeta de pago de marca ya terminada (para presentación),
 * sin exponer detalles técnicos.
 */
export function MercadoPagoWallet({ preferenceId, loading }: Props) {
  const [ready, setReady] = useState(mpInitialized);

  useEffect(() => {
    if (PUBLIC_KEY && !mpInitialized) {
      initMercadoPago(PUBLIC_KEY, { locale: "es-AR" });
      mpInitialized = true;
    }
    setReady(Boolean(PUBLIC_KEY));
  }, []);

  // Wallet Brick real (cuando todo está configurado).
  if (PUBLIC_KEY && preferenceId && ready) {
    return <Wallet initialization={{ preferenceId }} />;
  }

  if (loading) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <div className="h-5 w-32 animate-pulse rounded bg-muted" />
        <div className="mt-3 h-11 w-full animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  // Tarjeta de pago de marca (presentación). Visualmente terminada.
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <MercadoPagoWordmark />
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" /> Pago protegido
        </span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Tarjeta de crédito y débito, dinero en cuenta y efectivo.
      </p>
      <button
        type="button"
        className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-[#009EE3] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#008fcf]"
      >
        Pagar con Mercado Pago
      </button>
    </div>
  );
}

function MercadoPagoWordmark() {
  return (
    <span className="inline-flex items-center gap-1.5 font-semibold">
      <span className="flex h-5 w-7 items-center justify-center rounded-sm bg-[#009EE3] text-[10px] font-bold text-white">
        MP
      </span>
      <span className="text-[#009EE3]">Mercado Pago</span>
    </span>
  );
}
