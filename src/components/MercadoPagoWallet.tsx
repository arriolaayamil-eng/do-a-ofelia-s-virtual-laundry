import { useEffect, useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { Lock, Loader2, CheckCircle2, X, CreditCard } from "lucide-react";

// Public Key de Mercado Pago (segura para el frontend). El Access Token (secreto)
// vive SOLO en el backend. Detalle técnico y scaffolding en docs/MERCADOPAGO.md.
const PUBLIC_KEY = (import.meta.env.VITE_MP_PUBLIC_KEY ?? "").toString().trim();

// initMercadoPago debe llamarse una sola vez en toda la app.
let mpInitialized = false;

type Props = {
  /** preferenceId del backend (POST /api/orders). null = todavía sin backend/credenciales. */
  preferenceId: string | null;
  loading?: boolean;
  /**
   * Se llama cuando el pago se aprueba. En modo simulación (sin backend) lo dispara
   * el checkout demo; con el Wallet real lo resolverá el webhook + polling del backend.
   */
  onApproved?: (paymentId: string) => void;
};

type DemoState = "idle" | "checkout" | "processing" | "approved";

/**
 * Bloque de pago con Mercado Pago.
 * - Configurado (Public Key + preferenceId): monta el Wallet Brick oficial (pago real).
 * - Sin configurar (demo): simula TODO el proceso como si fuera real — al pagar abre un
 *   checkout estilo Mercado Pago (form de tarjeta, cuotas) → procesando → aprobado.
 *   Los campos vienen precargados con una tarjeta de PRUEBA de MP para agilizar la demo.
 */
export function MercadoPagoWallet({ preferenceId, loading, onApproved }: Props) {
  const [ready, setReady] = useState(mpInitialized);
  const [demo, setDemo] = useState<DemoState>("idle");

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

  function pay() {
    setDemo("processing");
    // Simula la latencia del procesamiento de Mercado Pago.
    window.setTimeout(() => {
      setDemo("approved");
      const paymentId = String(Math.floor(Math.random() * 9_000_000_000) + 1_000_000_000);
      window.setTimeout(() => onApproved?.(paymentId), 1100);
    }, 2200);
  }

  return (
    <>
      {/* Tarjeta de marca: dispara el checkout de Mercado Pago. */}
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
          onClick={() => setDemo("checkout")}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#009EE3] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#008fcf]"
        >
          Pagar con Mercado Pago
        </button>
      </div>

      {demo !== "idle" && (
        <CheckoutModal
          state={demo}
          onClose={() => setDemo("idle")}
          onPay={pay}
        />
      )}
    </>
  );
}

/** Checkout estilo Mercado Pago (simulación). */
function CheckoutModal({
  state,
  onClose,
  onPay,
}: {
  state: DemoState;
  onClose: () => void;
  onPay: () => void;
}) {
  // Tarjeta de PRUEBA de Mercado Pago (aprobada): titular APRO.
  const [card, setCard] = useState({
    number: "5031 7557 3453 0604",
    expiry: "11/30",
    cvv: "123",
    name: "APRO",
    doc: "12345678",
    installments: "1",
  });

  const busy = state === "processing" || state === "approved";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header MP */}
        <div className="flex items-center justify-between gap-3 bg-[#009EE3] px-5 py-3 text-white">
          <span className="inline-flex items-center gap-1.5 font-semibold">
            <span className="flex h-5 w-7 items-center justify-center rounded-sm bg-white text-[10px] font-bold text-[#009EE3]">
              MP
            </span>
            Mercado Pago
          </span>
          <span className="inline-flex items-center gap-1 text-xs">
            <Lock className="h-3.5 w-3.5" /> Pago seguro
          </span>
          {!busy && (
            <button type="button" aria-label="Cerrar" onClick={onClose} className="ml-1 rounded p-1 hover:bg-white/10">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {state === "approved" ? (
          <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
            <p className="text-lg font-semibold text-zinc-800">¡Pago aprobado!</p>
            <p className="text-sm text-zinc-500">Acreditando tu pago…</p>
          </div>
        ) : state === "processing" ? (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#009EE3]" />
            <p className="text-sm font-medium text-zinc-700">Procesando tu pago…</p>
            <p className="text-xs text-zinc-400">No cierres esta ventana.</p>
          </div>
        ) : (
          <div className="px-5 py-4 text-zinc-800">
            <p className="text-sm text-zinc-500">Pagás a <strong className="text-zinc-700">Lavadero Doña Ofelia</strong></p>

            {/* Método */}
            <div className="mt-3 flex items-center gap-2 rounded-md border border-[#009EE3] bg-[#009EE3]/5 px-3 py-2 text-sm font-medium">
              <CreditCard className="h-4 w-4 text-[#009EE3]" /> Tarjeta de crédito
            </div>

            {/* Form de tarjeta */}
            <div className="mt-4 space-y-3">
              <MpField label="Número de tarjeta">
                <input
                  inputMode="numeric"
                  value={card.number}
                  onChange={(e) => setCard({ ...card, number: e.target.value })}
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#009EE3]"
                  placeholder="1234 5678 9012 3456"
                />
              </MpField>
              <div className="grid grid-cols-2 gap-3">
                <MpField label="Vencimiento">
                  <input
                    value={card.expiry}
                    onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                    className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#009EE3]"
                    placeholder="MM/AA"
                  />
                </MpField>
                <MpField label="Cód. de seguridad">
                  <input
                    inputMode="numeric"
                    value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                    className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#009EE3]"
                    placeholder="123"
                  />
                </MpField>
              </div>
              <MpField label="Titular de la tarjeta">
                <input
                  value={card.name}
                  onChange={(e) => setCard({ ...card, name: e.target.value })}
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#009EE3]"
                  placeholder="Como figura en la tarjeta"
                />
              </MpField>
              <div className="grid grid-cols-2 gap-3">
                <MpField label="DNI del titular">
                  <input
                    inputMode="numeric"
                    value={card.doc}
                    onChange={(e) => setCard({ ...card, doc: e.target.value })}
                    className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#009EE3]"
                    placeholder="12345678"
                  />
                </MpField>
                <MpField label="Cuotas">
                  <select
                    value={card.installments}
                    onChange={(e) => setCard({ ...card, installments: e.target.value })}
                    className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:border-[#009EE3]"
                  >
                    <option value="1">1 cuota</option>
                    <option value="3">3 cuotas</option>
                    <option value="6">6 cuotas</option>
                    <option value="12">12 cuotas</option>
                  </select>
                </MpField>
              </div>
            </div>

            <button
              type="button"
              onClick={onPay}
              className="mt-5 w-full rounded-md bg-[#009EE3] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#008fcf]"
            >
              Pagar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 w-full rounded-md px-4 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-100"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function MpField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-zinc-500">{label}</span>
      {children}
    </label>
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
