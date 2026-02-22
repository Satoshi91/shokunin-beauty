import type { Craftsman, Service, Review, Job, CreateJobInput, JobStatus, Message, CreateMessageInput, UpdateCraftsmanInput } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_MOCKAPI_URL || "";

// デモ用モックジョブデータ（依頼者太郎用）
// letで宣言してステータス更新を可能にする
let DEMO_JOBS: Job[] = [
  {
    id: "demo_job_1",
    craftsman_id: "1",
    craftsman_name: "山田 太郎",
    customer_id: "demo_customer_taro",
    customer_name: "依頼者太郎",
    customer_phone: "090-1234-5678",
    customer_email: "taro@example.com",
    customer_address: "東京都渋谷区代々木1-2-3",
    service: "エアコンクリーニング",
    preferred_date: "2026-03-01",
    preferred_time: "10:00-12:00",
    notes: "リビングのエアコン1台です。",
    status: "confirmed",
    created_at: "2026-02-20T10:00:00Z",
    confirmed_at: "2026-02-21T09:00:00Z",
  },
  {
    id: "demo_job_2",
    craftsman_id: "2",
    craftsman_name: "佐藤 花子",
    customer_id: "demo_customer_taro",
    customer_name: "依頼者太郎",
    customer_phone: "090-1234-5678",
    customer_email: "taro@example.com",
    customer_address: "東京都渋谷区代々木1-2-3",
    service: "水漏れ修理",
    preferred_date: "2026-03-05",
    preferred_time: "14:00-16:00",
    notes: "キッチンの蛇口から水漏れしています。",
    status: "pending",
    created_at: "2026-02-22T14:30:00Z",
    confirmed_at: null,
  },
  {
    id: "demo_job_3",
    craftsman_id: "1",
    craftsman_name: "山田 太郎",
    customer_id: "demo_customer_taro",
    customer_name: "依頼者太郎",
    customer_phone: "090-1234-5678",
    customer_email: "taro@example.com",
    customer_address: "東京都渋谷区代々木1-2-3",
    service: "エアコン取り付け",
    preferred_date: "2026-02-15",
    preferred_time: "09:00-11:00",
    notes: "新品エアコンの取り付けをお願いします。",
    status: "completed",
    created_at: "2026-02-10T08:00:00Z",
    confirmed_at: "2026-02-11T10:00:00Z",
  },
];

async function fetchApi<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

async function mutateApi<T, R = T>(
  endpoint: string,
  method: "POST" | "PUT" | "DELETE",
  data?: T
): Promise<R> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
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

export async function updateCraftsman(id: string, data: UpdateCraftsmanInput): Promise<Craftsman> {
  return mutateApi<UpdateCraftsmanInput, Craftsman>(`/craftsmen/${id}`, "PUT", data);
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

export async function createJob(input: CreateJobInput): Promise<Job> {
  const jobData = {
    ...input,
    status: "pending" as JobStatus,
    created_at: new Date().toISOString(),
    confirmed_at: null,
  };
  return mutateApi<typeof jobData, Job>("/jobs", "POST", jobData);
}

export async function getJobsByCustomer(customerId: string): Promise<Job[]> {
  // デモ顧客の場合はモックデータを返す
  if (customerId === "demo_customer_taro") {
    return DEMO_JOBS.filter(job => job.customer_id === customerId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  
  try {
    return await fetchApi<Job[]>(`/jobs?customer_id=${customerId}&sortBy=created_at&order=desc`);
  } catch {
    return [];
  }
}

export async function getJobsByCraftsman(craftsmanId: string): Promise<Job[]> {
  // デモ職人の場合はモックデータを返す
  if (craftsmanId === "1") {
    const demoJobs = DEMO_JOBS.filter(job => job.craftsman_id === craftsmanId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    try {
      const apiJobs = await fetchApi<Job[]>(`/jobs?craftsman_id=${craftsmanId}&sortBy=created_at&order=desc`);
      return [...demoJobs, ...apiJobs];
    } catch {
      return demoJobs;
    }
  }
  
  try {
    return await fetchApi<Job[]>(`/jobs?craftsman_id=${craftsmanId}&sortBy=created_at&order=desc`);
  } catch {
    return [];
  }
}

export async function getJob(id: string): Promise<Job> {
  const demoJob = DEMO_JOBS.find(job => job.id === id);
  if (demoJob) {
    return demoJob;
  }
  return fetchApi<Job>(`/jobs/${id}`);
}

export async function updateJobStatus(
  id: string,
  status: JobStatus
): Promise<Job> {
  const demoJob = DEMO_JOBS.find(job => job.id === id);
  if (demoJob) {
    const updatedJob = {
      ...demoJob,
      status,
      confirmed_at: status === "confirmed" ? new Date().toISOString() : demoJob.confirmed_at,
    };
    const index = DEMO_JOBS.findIndex(job => job.id === id);
    if (index !== -1) {
      DEMO_JOBS[index] = updatedJob;
    }
    return updatedJob;
  }

  const updateData: { status: JobStatus; confirmed_at?: string } = { status };
  
  if (status === "confirmed") {
    updateData.confirmed_at = new Date().toISOString();
  }
  
  return mutateApi<typeof updateData, Job>(`/jobs/${id}`, "PUT", updateData);
}

export async function getMessagesByJob(jobId: string): Promise<Message[]> {
  try {
    return await fetchApi<Message[]>(`/messages?job_id=${jobId}&sortBy=created_at&order=asc`);
  } catch {
    return [];
  }
}

export async function createMessage(input: CreateMessageInput): Promise<Message> {
  const messageData = {
    ...input,
    created_at: new Date().toISOString(),
  };
  return mutateApi<typeof messageData, Message>("/messages", "POST", messageData);
}
