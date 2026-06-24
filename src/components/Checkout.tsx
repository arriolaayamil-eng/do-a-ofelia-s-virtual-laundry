import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trash2, Minus, Plus, MessageCircle, CheckCircle2 } from "lucide-react";
import { cart, useCart, type CartItem } from "@/lib/cart-store";
import { business, nextCode, waLink } from "@/lib/business";
import { MercadoPagoWallet } from "@/components/MercadoPagoWallet";
import { createOrderPreference, type OrderPreference } from "@/lib/api/orders";

type Kind = "service" | "product";

type ServiceMode = "retiro-entrega" | "en-local";
type ProductMode = "retiro" | "envio";
type Mode = ServiceMode | ProductMode;

const phoneRegex = /^[\d\s+()-]{6,20}$/;

const contactSchema = z.object({
  name: z.string().trim().min(2, "Ingresá tu nombre").max(80),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Teléfono inválido"),
  email: z.string().trim().email("Email inválido").max(120),
  address: z.string().trim().max(160).optional().or(z.literal("")),
  date: z.string().optional().or(z.literal("")),
  notes: z.string().max(400).optional().or(z.literal("")),
});
type ContactValues = z.infer<typeof contactSchema>;

export function Checkout({ kind }: { kind: Kind }) {
  const items = useCart(kind);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [mode, setMode] = useState<Mode>(kind === "service" ? "retiro-entrega" : "retiro");
  const [success, setSuccess] = useState<{ code: string; waUrl: string } | null>(null);
  const [contact, setContact] = useState<ContactValues | null>(null);
  const [pref, setPref] = useState<OrderPreference | null>(null);
  const [prefLoading, setPrefLoading] = useState(false);

  const requiresAddress =
    (kind === "service" && mode === "retiro-entrega") ||
    (kind === "product" && mode === "envio");

  const schema = useMemo(
    () =>
      contactSchema.superRefine((data, ctx) => {
        if (requiresAddress && (!data.address || data.address.trim().length < 5)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["address"],
            message: "La dirección es obligatoria para esta modalidad",
          });
        }
      }),
    [requiresAddress],
  );

  const form = useForm<ContactValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", email: "", address: "", date: "", notes: "" },
  });

  if (success) {
    return <SuccessPanel kind={kind} code={success.code} waUrl={success.waUrl} />;
  }

  if (items.length === 0 && step === 1) {
    return (
      <div className="rounded-lg border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">
          {kind === "service"
            ? "Todavía no agregaste servicios a tu pedido."
            : "Tu carrito está vacío."}
        </p>
        <div className="mt-4">
          <Button asChild>
            <Link to={kind === "service" ? "/servicios" : "/productos"}>
              {kind === "service" ? "Ver servicios" : "Ver productos"}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Paso 3 (Contacto) -> guarda datos y avanza al paso 4 (Pago).
  function goToPayment(values: ContactValues) {
    setContact(values);
    setStep(4);
  }

  // En el paso 4 intentamos crear la orden + preferencia de MP en el backend.
  // Sin backend (VITE_API_BASE_URL vacío) devuelve null y el Wallet muestra su placeholder.
  useEffect(() => {
    if (step !== 4 || !contact) return;
    let active = true;
    setPrefLoading(true);
    createOrderPreference({
      kind,
      mode,
      items: cart.get(kind).map((i) => ({ slug: i.slug, quantity: i.quantity })),
      contact: {
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        address: contact.address || undefined,
        notes: contact.notes || undefined,
      },
    })
      .then((p) => active && setPref(p))
      .finally(() => active && setPrefLoading(false));
    return () => {
      active = false;
    };
  }, [step, contact, kind, mode]);

  // Alternativa / fallback: confirmar y coordinar por WhatsApp (sin pago online).
  function confirmViaWhatsApp() {
    const values = contact ?? form.getValues();
    const code = nextCode(kind === "service" ? "SRV" : "PRD");
    const lines = [
      `*${business.name} — Nuevo ${kind === "service" ? "pedido de servicios" : "pedido de productos"}*`,
      `Código: ${code}`,
      "",
      "*Items:*",
      ...cart.get(kind).map(
        (i) => `• ${i.name} x${i.quantity}${i.unit ? ` (${i.unit})` : ""} — ${i.price}${i.notes ? ` — Nota: ${i.notes}` : ""}`,
      ),
      "",
      `*Modalidad:* ${modeLabel(kind, mode)}`,
      values.address ? `*Dirección:* ${values.address}` : "",
      values.date ? `*Fecha preferida:* ${values.date}` : "",
      "",
      "*Datos de contacto:*",
      `Nombre: ${values.name}`,
      `Teléfono: ${values.phone}`,
      `Email: ${values.email}`,
      values.notes ? `Notas: ${values.notes}` : "",
    ].filter(Boolean);
    const waUrl = waLink(lines.join("\n"));
    cart.clear(kind);
    setSuccess({ code, waUrl });
  }

  return (
    <div className="space-y-6">
      <Stepper step={step} />

      {step === 1 && (
        <ItemsStep kind={kind} items={items} onNext={() => setStep(2)} />
      )}

      {step === 2 && (
        <ModeStep
          kind={kind}
          mode={mode}
          setMode={setMode}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <form onSubmit={form.handleSubmit(goToPayment)} className="space-y-4 rounded-lg border bg-card p-5">
          <h2 className="text-lg font-semibold">Datos de contacto</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nombre y apellido" error={form.formState.errors.name?.message}>
              <Input {...form.register("name")} placeholder="María Pérez" />
            </Field>
            <Field label="Teléfono" error={form.formState.errors.phone?.message}>
              <Input {...form.register("phone")} inputMode="tel" placeholder="(02254) 40-7932" />
            </Field>
            <Field label="Email" error={form.formState.errors.email?.message}>
              <Input {...form.register("email")} type="email" placeholder="vos@email.com" />
            </Field>
            <Field
              label={`Dirección${requiresAddress ? "" : " (opcional)"}`}
              error={form.formState.errors.address?.message as string | undefined}
            >
              <Input {...form.register("address")} placeholder="Calle 123, Ostende" />
            </Field>
            {kind === "service" && (
              <Field label="Fecha preferida (opcional)">
                <Input type="date" {...form.register("date")} />
              </Field>
            )}
            <Field label="Notas (opcional)" className="md:col-span-2">
              <Textarea rows={3} {...form.register("notes")} placeholder="Detalles adicionales" />
            </Field>
          </div>
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => setStep(2)}>Volver</Button>
            <Button type="submit">Continuar al pago</Button>
          </div>
        </form>
      )}

      {step === 4 && (
        <div className="space-y-4 rounded-lg border bg-card p-5">
          <h2 className="text-lg font-semibold">Pago</h2>

          <ul className="divide-y rounded-md border text-sm">
            {cart.get(kind).map((i) => (
              <li key={i.slug} className="flex items-center justify-between gap-2 px-3 py-2">
                <span>{i.name} <span className="text-muted-foreground">x{i.quantity}</span></span>
                <span className="text-muted-foreground">{i.price}</span>
              </li>
            ))}
          </ul>

          <div>
            <h3 className="mb-2 text-sm font-medium">Pagar online</h3>
            <MercadoPagoWallet preferenceId={pref?.preferenceId ?? null} loading={prefLoading} />
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> o <span className="h-px flex-1 bg-border" />
          </div>

          <button
            type="button"
            onClick={confirmViaWhatsApp}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
          >
            <MessageCircle className="h-4 w-4" /> Coordinar y pagar por WhatsApp
          </button>

          <div className="flex justify-start">
            <Button type="button" variant="outline" onClick={() => setStep(3)}>Volver</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function modeLabel(kind: Kind, mode: Mode) {
  if (kind === "service") {
    return mode === "retiro-entrega"
      ? "Retiro y entrega a domicilio"
      : "Entrega en local";
  }
  return mode === "envio" ? "Envío a domicilio" : "Retiro en local";
}

function Stepper({ step }: { step: 1 | 2 | 3 | 4 }) {
  const labels = ["Items", "Modalidad", "Contacto", "Pago"];
  return (
    <ol className="flex flex-wrap items-center gap-2 text-sm">
      {labels.map((l, i) => {
        const n = (i + 1) as 1 | 2 | 3 | 4;
        const active = step === n;
        const done = step > n;
        return (
          <li key={l} className="flex items-center gap-2">
            <span
              className={
                "inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold " +
                (active
                  ? "border-foreground bg-foreground text-background"
                  : done
                    ? "border-foreground/40 bg-foreground/10 text-foreground"
                    : "border-border text-muted-foreground")
              }
            >
              {n}
            </span>
            <span className={active ? "font-medium" : "text-muted-foreground"}>{l}</span>
            {i < labels.length - 1 && <span className="text-muted-foreground">›</span>}
          </li>
        );
      })}
    </ol>
  );
}

function ItemsStep({
  kind,
  items,
  onNext,
}: {
  kind: Kind;
  items: CartItem[];
  onNext: () => void;
}) {
  return (
    <div className="space-y-4 rounded-lg border bg-card p-5">
      <h2 className="text-lg font-semibold">
        {kind === "service" ? "Tu pedido de servicios" : "Tu carrito"}
      </h2>
      <ul className="divide-y">
        {items.map((i) => (
          <li key={i.slug} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <div className="font-medium">{i.name}</div>
              <div className="text-xs text-muted-foreground">
                {i.price}
                {i.unit ? ` · ${i.unit}` : ""}
              </div>
              <Textarea
                placeholder="Notas (opcional)"
                defaultValue={i.notes ?? ""}
                onBlur={(e) => cart.update(kind, i.slug, { notes: e.target.value })}
                rows={2}
                className="mt-2 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Disminuir"
                className="rounded-md border p-1 hover:bg-accent"
                onClick={() =>
                  i.quantity > 1
                    ? cart.update(kind, i.slug, { quantity: i.quantity - 1 })
                    : cart.remove(kind, i.slug)
                }
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center text-sm">{i.quantity}</span>
              <button
                type="button"
                aria-label="Aumentar"
                className="rounded-md border p-1 hover:bg-accent"
                onClick={() => cart.update(kind, i.slug, { quantity: i.quantity + 1 })}
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Quitar"
                className="rounded-md border p-1 text-destructive hover:bg-destructive/10"
                onClick={() => cart.remove(kind, i.slug)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-end">
        <Button onClick={onNext} disabled={items.length === 0}>Continuar</Button>
      </div>
    </div>
  );
}

function ModeStep({
  kind,
  mode,
  setMode,
  onBack,
  onNext,
}: {
  kind: Kind;
  mode: Mode;
  setMode: (m: Mode) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const options =
    kind === "service"
      ? [
          { value: "retiro-entrega", label: "Retiro y entrega a domicilio", desc: "Pasamos a buscar y devolvemos." },
          { value: "en-local", label: "Entrega en local", desc: "Traés y retirás en Av. La Plata 828." },
        ]
      : [
          { value: "retiro", label: "Retiro en local", desc: "Pasás a buscar el pedido por el local." },
          { value: "envio", label: "Envío a domicilio", desc: "Te lo llevamos a tu dirección." },
        ];

  return (
    <div className="space-y-4 rounded-lg border bg-card p-5">
      <h2 className="text-lg font-semibold">Modalidad</h2>
      <RadioGroup value={mode} onValueChange={(v) => setMode(v as Mode)} className="gap-2">
        {options.map((o) => (
          <label
            key={o.value}
            className="flex cursor-pointer items-start gap-3 rounded-md border p-3 hover:bg-accent"
          >
            <RadioGroupItem value={o.value} className="mt-1" />
            <div>
              <div className="text-sm font-medium">{o.label}</div>
              <div className="text-xs text-muted-foreground">{o.desc}</div>
            </div>
          </label>
        ))}
      </RadioGroup>
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>Volver</Button>
        <Button type="button" onClick={onNext}>Continuar</Button>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-1 block text-sm">{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function SuccessPanel({ kind, code, waUrl }: { kind: Kind; code: string; waUrl: string }) {
  return (
    <div className="rounded-lg border bg-card p-6 text-center">
      <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
      <h2 className="mt-3 text-xl font-semibold">¡Pedido registrado!</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Tu código de {kind === "service" ? "pedido de servicios" : "pedido de productos"} es:
      </p>
      <p className="mt-2 text-2xl font-bold tracking-wider">{code}</p>
      <p className="mt-3 text-sm text-muted-foreground">
        Para confirmar y coordinar, enviá el detalle por WhatsApp.
      </p>
      <div className="mt-5 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          <MessageCircle className="h-4 w-4" /> Enviar por WhatsApp
        </a>
        <Button asChild variant="outline">
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );
}