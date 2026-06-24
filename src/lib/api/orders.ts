// Capa de datos de órdenes / pago.
//
// El backend (a scaffoldear, ver docs/MERCADOPAGO.md) debe exponer:
//   POST /api/orders        -> crea la orden + la preferencia de Mercado Pago
//   GET  /api/orders/:id     -> estado de la orden (para la página de resultado)
//
// Mientras no haya backend (VITE_API_BASE_URL vacío), createOrderPreference
// devuelve null y el Wallet Brick muestra su estado "pendiente de configuración".

import { apiPost, apiGet } from "./client";

export type OrderItemInput = {
  slug: string;
  quantity: number;
};

export type OrderContact = {
  name: string;
  phone: string;
  email: string;
  address?: string;
  notes?: string;
};

export type CreateOrderPayload = {
  kind: "service" | "product";
  mode: string;
  items: OrderItemInput[];
  contact: OrderContact;
};

/** Lo que el backend devuelve al crear la orden: id propio + preferenceId de MP. */
export type OrderPreference = {
  orderId: string;
  preferenceId: string;
};

export type OrderStatus = {
  orderId: string;
  status: "pending" | "paid" | "failed";
};

export function createOrderPreference(
  payload: CreateOrderPayload,
): Promise<OrderPreference | null> {
  return apiPost<OrderPreference | null>("/api/orders", payload, null);
}

export function getOrderStatus(orderId: string): Promise<OrderStatus | null> {
  return apiGet<OrderStatus | null>(`/api/orders/${orderId}`, null);
}
