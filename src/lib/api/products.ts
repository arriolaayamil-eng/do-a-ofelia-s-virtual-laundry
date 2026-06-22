import { apiGet } from "./client";
import { products, type Product } from "@/mocks/data";

export async function listProducts(): Promise<Product[]> {
  return apiGet<Product[]>("/products", products);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const all = await listProducts();
  return all.find((p) => p.slug === slug);
}