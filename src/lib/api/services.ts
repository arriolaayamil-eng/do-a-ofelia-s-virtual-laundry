import { apiGet } from "./client";
import { services, type Service } from "@/mocks/data";

export async function listServices(): Promise<Service[]> {
  return apiGet<Service[]>("/services", services);
}

export async function getService(slug: string): Promise<Service | undefined> {
  const all = await listServices();
  return all.find((s) => s.slug === slug);
}