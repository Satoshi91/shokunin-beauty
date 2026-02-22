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

export type JobStatus =
  | "pending"
  | "confirmed"
  | "rejected"
  | "completed"
  | "cancelled";

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  pending: "申請中",
  confirmed: "確定",
  rejected: "却下",
  completed: "完了",
  cancelled: "キャンセル",
};

export const JOB_STATUS_COLORS: Record<JobStatus, string> = {
  pending: "yellow",
  confirmed: "green",
  rejected: "red",
  completed: "blue",
  cancelled: "gray",
};

export interface Job {
  id: string;
  craftsman_id: string;
  craftsman_name: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  notes: string;
  status: JobStatus;
  created_at: string;
  confirmed_at: string | null;
}

export interface CreateJobInput {
  craftsman_id: string;
  craftsman_name: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  notes: string;
}

export interface Message {
  id: string;
  job_id: string;
  sender: "craftsman" | "customer";
  sender_name: string;
  message: string;
  created_at: string;
}

export interface CreateMessageInput {
  job_id: string;
  sender: "craftsman" | "customer";
  sender_name: string;
  message: string;
}

export interface UpdateCraftsmanInput {
  display_name?: string;
  description?: string;
  profile_image_url?: string;
  prefecture?: string;
  city?: string;
  category?: string;
  price_min?: number;
  price_max?: number;
  experience_years?: number;
  qualifications?: string;
}
