# Integración Mercado Pago — Lavadero Doña Ofelia

Estado: **frontend (Wallet Brick) montado y cableado. Backend pendiente de scaffolding.**
Última actualización: 2026-06-23.

## Decisión de arquitectura

Se usa **Wallet Brick** (Checkout Pro embebido como botón/modal), elegido por el cliente con este criterio:
**el usuario no sale del sitio, y nuestro servidor no procesa datos de tarjeta ni el pago.**

- El formulario de tarjeta y el **procesamiento del pago los hace 100% Mercado Pago**.
- Nuestro backend solo: (1) **crea la preferencia** (POST con el Access Token secreto, sin ningún dato de tarjeta) y (2) **escucha el webhook** para conocer el estado del pago (leer, no procesar).
- El **Access Token (secreto) NUNCA va al frontend**. El frontend solo usa la **Public Key**.

```
[Front] arma carrito + contacto → POST /api/orders
[Back]  recalcula total contra el catálogo en DB (NO confía en precios del cliente),
        persiste orden "pending", crea preference (MP SDK) → { orderId, preferenceId }
[Front] monta <Wallet initialization={{ preferenceId }} /> (modal MP sobre la misma página)
[User]  paga dentro del modal de MP
[MP]    POST /api/mp/webhook (server-to-server) → back consulta el pago y marca paid/failed (idempotente)
[Front] página/estado de resultado hace polling a GET /api/orders/:id
```

## Lo ya hecho en el frontend (este repo)

| Archivo | Qué hace |
|---|---|
| `src/components/MercadoPagoWallet.tsx` | Monta el Wallet Brick. `initMercadoPago(VITE_MP_PUBLIC_KEY)` + `<Wallet initialization={{ preferenceId }} />`. **Modo demo (sin Public Key/preferenceId):** botón "Pagar con Mercado Pago" → abre un **modal estilo Mercado Pago (`CheckoutModal`)** con form de tarjeta (número, vencimiento, CVV, titular, DNI, cuotas) precargado con una **tarjeta de PRUEBA de MP** (`5031 7557 3453 0604`, titular `APRO`) → "Pagar" → procesando → aprobado → `onApproved(paymentId)`. Es 100% client-side (no procesa nada real). Al configurar MP real, el `<Wallet>` oficial reemplaza TODO esto automáticamente (el modal/card form lo provee Mercado Pago, no nosotros). **Al construir el backend: borrar `CheckoutModal` + estados `demo`/`simulatePay`** y dejar solo el `<Wallet>` real + resultado por webhook/polling. |
| `src/lib/api/orders.ts` | `createOrderPreference(payload)` → `POST /api/orders`; `getOrderStatus(id)` → `GET /api/orders/:id`. Tipos `CreateOrderPayload`, `OrderPreference`, `OrderStatus`. |
| `src/lib/api/client.ts` | Se agregó `apiPost(path, body, fallback)`. Sin `VITE_API_BASE_URL` devuelve el fallback (null), por eso hoy el Wallet ve `preferenceId = null`. |
| `src/components/Checkout.tsx` | Nuevo **paso 4 "Pago"**: resumen del pedido + `<MercadoPagoWallet>` + fallback "Coordinar y pagar por WhatsApp". El paso 3 (Contacto) ahora dispara `goToPayment`, y al entrar al paso 4 se llama a `createOrderPreference`. |
| `.env` | Se agregó `VITE_MP_PUBLIC_KEY=` (vacío). |
| dependencia | `@mercadopago/sdk-react` (instalada con npm). |

**Para encender el frontend** basta con: setear `VITE_MP_PUBLIC_KEY` + `VITE_API_BASE_URL` y tener el backend devolviendo `preferenceId`. No hay que tocar componentes.

## Lo que falta: backend a scaffoldear (Express + Mongo, según el playbook)

### Endpoints

1. **`POST /api/orders`**
   - Body (lo que ya manda el front, ver `CreateOrderPayload`):
     ```json
     {
       "kind": "service" | "product",
       "mode": "retiro-entrega" | "en-local" | "retiro" | "envio",
       "items": [{ "slug": "quitamanchas", "quantity": 1 }],
       "contact": { "name": "...", "phone": "...", "email": "...", "address": "?", "notes": "?" }
     }
     ```
   - Lógica: **recalcular el total leyendo los precios desde la DB** (nunca confiar en el cliente) → crear `Order` con estado `pending` → crear la `preference` con el SDK de MP.
   - Respuesta esperada por el front (`OrderPreference`): `{ "orderId": "...", "preferenceId": "..." }`.
   - En la preference: `items` (title/quantity/unit_price/currency_id "ARS"), `external_reference = orderId`, `notification_url = https://apidonaofelia.testprueba.online/api/mp/webhook`, `back_urls` (exito/pendiente/error), `auto_return: "approved"`.

2. **`POST /api/mp/webhook`**
   - Validar la firma **`x-signature`** (header) con `MP_WEBHOOK_SECRET`.
   - Consultar el pago a la API de MP (`GET /v1/payments/:id`) y mapear `status` → `Order.status` (`approved`→paid, `rejected`/`cancelled`→failed, resto→pending).
   - **Idempotente** (puede llegar repetido). Responder `200` rápido.

3. **`GET /api/orders/:id`** → `{ "orderId", "status": "pending"|"paid"|"failed" }` (para el polling del front).

4. **`GET /api/catalog`** (products + services) → fuente única de precios para que front y back coincidan. (Hoy el front lee de `src/mocks/data.ts`; cuando exista, se enchufa por `apiGet`.)

### Modelos Mongo (mínimo)
- `Product { slug, name, price(Number, ARS), unit, active }`
- `Service { slug, name, price(Number|null si "a presupuestar"), unit, active }`
- `Order { _id, kind, mode, items:[{slug,name,quantity,unitPrice}], total, contact, status, mpPreferenceId, mpPaymentId, createdAt }`

### Variables de entorno (backend)
- `MP_ACCESS_TOKEN` — token secreto de MP (test y prod). **Solo backend.**
- `MP_WEBHOOK_SECRET` — para validar la firma del webhook.
- `MONGO_URI`
- `FRONT_URL` — para construir las `back_urls`.

### Deploy (server expert001, igual que crmdigital)
- Subdominio API: `apidonaofelia.testprueba.online` (pm2 + nginx + cert Let's Encrypt).
- **HTTPS obligatorio** para webhooks y back_urls de MP.
- Registrar la `notification_url` del webhook en el panel de desarrollador de MP.
- En el front, setear `VITE_API_BASE_URL=https://apidonaofelia.testprueba.online` y `VITE_MP_PUBLIC_KEY=...` y re-deploy.

## Bloqueantes / requisitos previos

1. **Precios reales.** Hoy todos los productos y servicios figuran como `"Consultar"` en `src/mocks/data.ts`. MP necesita montos numéricos en ARS. **Pendiente de Ana.**
2. **Credenciales MP.** La cuenta ya existe; falta obtener del panel de desarrollador la **Public Key** y el **Access Token**, en versión **test** y **producción**.
3. **Qué se cobra online vs. a presupuestar.** Productos (precio fijo) → pago online con Wallet. Servicios "a presupuestar" → siguen por el fallback de WhatsApp (no se pueden cobrar online sin precio).

## Pruebas
- Usar **credenciales de test** + tarjetas de prueba de MP → recorrer aprobado / rechazado / pendiente y verificar que el **webhook** marca la orden correctamente.
- Recién después, cambiar a credenciales productivas.
