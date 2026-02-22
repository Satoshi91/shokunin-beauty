import type { Craftsman, Service, Review, Job, CreateJobInput, JobStatus, Message, CreateMessageInput, UpdateCraftsmanInput } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_MOCKAPI_URL || "";

// フォールバック用モックデータ（APIが利用できない場合）
const FALLBACK_CRAFTSMEN: Craftsman[] = [
  {
    id: "1",
    display_name: "山田 太郎",
    description: "エアコン取り付け・クリーニング専門。20年以上の経験で丁寧な作業を心がけています。",
    profile_image_url: "https://api.dicebear.com/7.x/personas/svg?seed=yamada",
    prefecture: "東京都",
    city: "渋谷区",
    category: "エアコン",
    price_min: 8000,
    price_max: 25000,
    rating_avg: 4.8,
    review_count: 156,
    experience_years: 20,
    qualifications: "電気工事士2種、冷媒フロン類取扱技術者",
  },
  {
    id: "2",
    display_name: "佐藤 花子",
    description: "水回りのトラブル解決のプロ。水漏れ、詰まり、何でもお任せください。",
    profile_image_url: "https://api.dicebear.com/7.x/personas/svg?seed=sato",
    prefecture: "東京都",
    city: "新宿区",
    category: "水回り",
    price_min: 5000,
    price_max: 30000,
    rating_avg: 4.9,
    review_count: 203,
    experience_years: 15,
    qualifications: "給水装置工事主任技術者",
  },
  {
    id: "3",
    display_name: "鈴木 一郎",
    description: "電気工事全般対応。コンセント増設から分電盤交換まで。",
    profile_image_url: "https://api.dicebear.com/7.x/personas/svg?seed=suzuki",
    prefecture: "神奈川県",
    city: "横浜市",
    category: "電気",
    price_min: 6000,
    price_max: 50000,
    rating_avg: 4.7,
    review_count: 89,
    experience_years: 12,
    qualifications: "電気工事士1種、電気主任技術者3種",
  },
  {
    id: "4",
    display_name: "田中 美咲",
    description: "壁紙・クロス張替えのスペシャリスト。お部屋の雰囲気を一新します。",
    profile_image_url: "https://api.dicebear.com/7.x/personas/svg?seed=tanaka",
    prefecture: "東京都",
    city: "世田谷区",
    category: "内装",
    price_min: 10000,
    price_max: 80000,
    rating_avg: 4.6,
    review_count: 67,
    experience_years: 8,
    qualifications: "内装仕上げ施工技能士1級",
  },
];

const FALLBACK_REVIEWS: Review[] = [
  {
    id: "r1",
    craftsman_id: "1",
    customer_name: "M.K.",
    rating: 5,
    comment: "丁寧な作業で大満足です。説明もわかりやすかったです。",
    created_at: "2026-02-15T10:00:00Z",
  },
  {
    id: "r2",
    craftsman_id: "1",
    customer_name: "T.S.",
    rating: 5,
    comment: "時間通りに来ていただき、作業も早くて助かりました。",
    created_at: "2026-02-10T14:00:00Z",
  },
  {
    id: "r3",
    craftsman_id: "2",
    customer_name: "Y.H.",
    rating: 5,
    comment: "水漏れがすぐに直りました。対応が早くて感謝しています。",
    created_at: "2026-02-18T09:00:00Z",
  },
];

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
  // APIが設定されていない場合はフォールバックデータを使用
  if (!BASE_URL) {
    let result = [...FALLBACK_CRAFTSMEN];
    
    if (params?.category) {
      result = result.filter(c => c.category === params.category);
    }
    if (params?.prefecture) {
      result = result.filter(c => c.prefecture === params.prefecture);
    }
    if (params?.sortBy) {
      const order = params.order === "asc" ? 1 : -1;
      result.sort((a, b) => {
        const aVal = a[params.sortBy!];
        const bVal = b[params.sortBy!];
        return (Number(aVal) - Number(bVal)) * order;
      });
    }
    return result;
  }

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

  try {
    return await fetchApi<Craftsman[]>(endpoint);
  } catch {
    return FALLBACK_CRAFTSMEN;
  }
}

export async function getCraftsman(id: string): Promise<Craftsman> {
  // APIが設定されていない場合はフォールバックデータを使用
  if (!BASE_URL) {
    const craftsman = FALLBACK_CRAFTSMEN.find(c => c.id === id);
    if (craftsman) return craftsman;
    throw new Error("Craftsman not found");
  }

  try {
    return await fetchApi<Craftsman>(`/craftsmen/${id}`);
  } catch {
    const craftsman = FALLBACK_CRAFTSMEN.find(c => c.id === id);
    if (craftsman) return craftsman;
    throw new Error("Craftsman not found");
  }
}

export async function updateCraftsman(id: string, data: UpdateCraftsmanInput): Promise<Craftsman> {
  return mutateApi<UpdateCraftsmanInput, Craftsman>(`/craftsmen/${id}`, "PUT", data);
}

const FALLBACK_SERVICES: Service[] = [
  { id: "s1", name: "エアコン取り付け", category: "エアコン", icon: "AirVent" },
  { id: "s2", name: "エアコンクリーニング", category: "エアコン", icon: "AirVent" },
  { id: "s3", name: "水漏れ修理", category: "水回り", icon: "Droplet" },
  { id: "s4", name: "トイレ修理", category: "水回り", icon: "Droplet" },
  { id: "s5", name: "コンセント増設", category: "電気", icon: "Zap" },
  { id: "s6", name: "照明交換", category: "電気", icon: "Zap" },
  { id: "s7", name: "壁紙張替え", category: "内装", icon: "PaintBucket" },
  { id: "s8", name: "フローリング補修", category: "内装", icon: "PaintBucket" },
];

export async function getServices(): Promise<Service[]> {
  if (!BASE_URL) {
    return FALLBACK_SERVICES;
  }
  try {
    return await fetchApi<Service[]>("/services");
  } catch {
    return FALLBACK_SERVICES;
  }
}

export async function getReviews(craftsmanId: string): Promise<Review[]> {
  if (!BASE_URL) {
    return FALLBACK_REVIEWS.filter(r => r.craftsman_id === craftsmanId);
  }
  try {
    return await fetchApi<Review[]>(`/reviews?craftsman_id=${craftsmanId}`);
  } catch {
    return FALLBACK_REVIEWS.filter(r => r.craftsman_id === craftsmanId);
  }
}

export async function getAllReviews(): Promise<Review[]> {
  if (!BASE_URL) {
    return FALLBACK_REVIEWS;
  }
  try {
    return await fetchApi<Review[]>("/reviews");
  } catch {
    return FALLBACK_REVIEWS;
  }
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
