export interface Craftsman {
  id: string;
  display_name: string;
  description: string;
  profile_image_url: string;
  prefecture: string;
  city: string;
  category: string;
  price_min: number;
  price_max: number;
  rating_avg: number;
  review_count: number;
  experience_years: number;
  qualifications: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  icon: string;
}

export interface Review {
  id: string;
  craftsman_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export type ServiceCategory = "エアコン" | "水回り" | "電気" | "内装";

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  "エアコン",
  "水回り",
  "電気",
  "内装",
];
