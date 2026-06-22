import { useSyncExternalStore } from "react";

export type CartItem = {
  slug: string;
  name: string;
  unit?: string;
  price: string;
  quantity: number;
  notes?: string;
};

type Kind = "service" | "product";

const state: Record<Kind, CartItem[]> = { service: [], product: [] };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export const cart = {
  add(kind: Kind, item: CartItem) {
    const list = state[kind];
    const existing = list.find((i) => i.slug === item.slug);
    if (existing) {
      existing.quantity += item.quantity;
      if (item.notes) existing.notes = item.notes;
    } else {
      list.push({ ...item });
    }
    state[kind] = [...list];
    emit();
  },
  update(kind: Kind, slug: string, patch: Partial<CartItem>) {
    state[kind] = state[kind].map((i) => (i.slug === slug ? { ...i, ...patch } : i));
    emit();
  },
  remove(kind: Kind, slug: string) {
    state[kind] = state[kind].filter((i) => i.slug !== slug);
    emit();
  },
  clear(kind: Kind) {
    state[kind] = [];
    emit();
  },
  get(kind: Kind) {
    return state[kind];
  },
};

export function useCart(kind: Kind): CartItem[] {
  return useSyncExternalStore(
    subscribe,
    () => state[kind],
    () => state[kind],
  );
}

export function useCartCount(kind: Kind): number {
  const items = useCart(kind);
  return items.reduce((sum, i) => sum + i.quantity, 0);
}