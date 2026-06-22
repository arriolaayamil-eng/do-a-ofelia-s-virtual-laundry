## Mockup: Sitio web público "Lavadero Doña Ofelia"

Prototipo navegable y clickeable, solo frontend. Sin backend, sin imágenes reales, sin persistencia.

### Stack y reglas de mockup
- TanStack Start (ya configurado). Rutas file-based en `src/routes/`.
- Estilos neutros con Tailwind v4 (tipografía sans, paleta sobria). La estética final se ajusta después.
- Mobile-first. Header sticky + WhatsApp FAB visible en todas las páginas.
- SEO por página vía `head()` (title, description, OG, lang="es" en `__root.tsx`).
- JSON-LD `LocalBusiness` / `LaundryService` en Home y Contacto.
- Sin Lovable Cloud, sin Supabase, sin server functions.

### Capa de datos (aislada para enchufar API después)
- `.env` con `VITE_API_BASE_URL=` (vacío, placeholder).
- `src/lib/api/client.ts`: wrapper `fetch` con `baseURL = import.meta.env.VITE_API_BASE_URL`. Si la base está vacía o la request falla, hace fallback a mocks.
- `src/lib/api/services.ts` y `src/lib/api/products.ts`: funciones `listServices()`, `getService(slug)`, `listProducts()`, `getProduct(slug)`. Llaman al client; fallback transparente a mocks.
- `src/mocks/data.ts`: arrays de servicios y productos con los textos del brief, slugs, categoría, precio `"Consultar"`, `imgRef` (#N — descripción).
- Componentes consumen SOLO las funciones de `src/lib/api/*`, nunca los mocks directamente.

### Estado de carritos
- Dos carritos independientes en memoria (Zustand o Context + `useReducer`): `serviceCart` y `productCart`.
- Sin persistencia (sin `localStorage`). Al recargar se vacían — es un mockup.

### Rutas (file-based)
```
src/routes/
  __root.tsx                       (lang es, Header, Footer, WhatsAppFab, Outlet)
  index.tsx                        /
  servicios.tsx                    /servicios            (layout + Outlet)
  servicios.index.tsx              listado + filtro por categoría
  servicios.$slug.tsx              detalle + "Agregar al pedido"
  pedido-servicio.tsx              /pedido-servicio      (stepper)
  productos.tsx                    /productos            (layout + Outlet)
  productos.index.tsx              grilla
  productos.$slug.tsx              detalle + "Agregar al carrito"
  carrito.tsx                      /carrito              (stepper)
  historia.tsx                     /historia
  contacto.tsx                     /contacto
  preguntas-frecuentes.tsx         /preguntas-frecuentes
```
404 ya está en `__root.tsx` (`notFoundComponent`). Se reemplaza por una versión en español acorde al sitio.

### Componentes reutilizables (`src/components/`)
`Header`, `Footer`, `WhatsAppFab`, `ImgSlot`, `ServiceCard`, `ProductCard`, `CartDrawer` (sirve a ambos carritos vía prop `kind`), `OrderStepper` (3 pasos: items → modalidad → contacto → éxito), `CategoryFilter`, `Gallery`.

`ImgSlot`: caja con ratio configurable, fondo gris, texto centrado con el `#N — descripción`, atributo `data-img-ref` y `alt` descriptivo. Sin imagen real.

### Páginas — contenido
- **/** Hero (slogan + 2 CTAs), grilla de servicios destacados, grilla de productos destacados, extracto de historia → link, "Cómo trabajamos" (4 pasos), bloque ubicación con Google Maps embed (iframe) + horarios.
- **/servicios** Lista agrupada por categoría, filtro, botón "Agregar al pedido" en cada card.
- **/servicios/$slug** Detalle con `ImgSlot`, descripción, cantidad, notas, "Agregar al pedido".
- **/pedido-servicio** Stepper: (1) carrito editable [cantidad, quitar, notas], (2) modalidad [retiro y entrega con dirección+fecha / entrega en local], (3) datos contacto, (4) éxito con código `SRV-0001` + botón WhatsApp con detalle prearmado.
- **/productos** Grilla.
- **/productos/$slug** Detalle + cantidad + "Agregar al carrito".
- **/carrito** Stepper análogo, código `PRD-0001`.
- **/historia** Relato editable (placeholder largo basado en el brief; el cliente reemplaza luego).
- **/contacto** Datos del negocio + formulario UI-only (mismo patrón de éxito + WhatsApp).
- **/preguntas-frecuentes** Acordeón con 6–8 preguntas placeholder.

### Validaciones (Zod + react-hook-form)
- Teléfono AR (regex permisivo), email válido, cantidades > 0, dirección requerida si modalidad = retiro/envío. Errores en línea bajo cada campo.

### Envío "simulado" y WhatsApp
- Al enviar cualquier checkout/formulario: no se llama a ninguna API. Se genera código incremental simulado (`SRV-0001`, `PRD-0001`) en memoria.
- Pantalla de éxito con resumen y botón "Enviar por WhatsApp" → `https://wa.me/5492254407932?text=<detalle url-encoded>`.

### SEO por ruta
Cada página define `head()` con title único, description, og:title, og:description, og:url y canonical relativo. Home incluye JSON-LD `LocalBusiness` con nombre, dirección, teléfono, horario `Mo-Sa 09:00-13:00, 17:00-21:00`.

### Detalles técnicos
- Iconos: `lucide-react`.
- Forms: `react-hook-form` + `zod` + `@hookform/resolvers`.
- Estado carritos: `zustand` (liviano, sin persist).
- Mapa: `<iframe>` de Google Maps con la dirección.
- Sin imágenes generadas. Cada `ImgSlot` se numera (#1 hero, #2..#7 servicios, #8..#12 productos, #13 historia, etc.) para que el cliente sepa qué foto va dónde.

### Fuera de alcance (explícito)
- Sin Supabase / Lovable Cloud, sin auth, sin DB, sin server functions, sin persistencia.
- Sin generación de imágenes.
- Sin pagos, sin envío real de emails/WhatsApp desde server.
