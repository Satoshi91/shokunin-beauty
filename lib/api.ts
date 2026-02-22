import type { Craftsman, Service, Review } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_MOCKAPI_URL || "";

async function fetchApi<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

export interface GetCraftsmenParams {
  category?: string;
  prefecture?: string;
  sortBy?: "rating_avg" | "price_min" | "review_count";
  order?: "asc" | "desc";
}

export async function getCraftsmen(
  params?: GetCraftsmenParams
): Promise<Craftsman[]> {
  const searchParams = new URLSearchParams();

  if (params?.category) {
    searchParams.set("category", params.category);
  }
  if (params?.prefecture) {
    searchParams.set("prefecture", params.prefecture);
  }
  if (params?.sortBy) {
    searchParams.set("sortBy", params.sortBy);
    searchParams.set("order", params.order || "desc");
  }

  const query = searchParams.toString();
  const endpoint = `/craftsmen${query ? `?${query}` : ""}`;

  return fetchApi<Craftsman[]>(endpoint);
}

export async function getCraftsman(id: string): Promise<Craftsman> {
  return fetchApi<Craftsman>(`/craftsmen/${id}`);
}

export async function getServices(): Promise<Service[]> {
  return fetchApi<Service[]>("/services");
}

export async function getReviews(craftsmanId: string): Promise<Review[]> {
  return fetchApi<Review[]>(`/reviews?craftsman_id=${craftsmanId}`);
}

export async function getAllReviews(): Promise<Review[]> {
  return fetchApi<Review[]>("/reviews");
}
