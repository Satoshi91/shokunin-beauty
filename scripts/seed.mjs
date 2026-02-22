/**
 * MockAPI.io シードスクリプト
 * 
 * 使い方:
 * 1. mockapi.io で craftsmen, services, reviews リソースを作成
 * 2. node scripts/seed.mjs を実行
 */

const BASE_URL = "https://699a88e5377ac05ce28e1aed.mockapi.io";

// サービスマスタデータ
const services = [
  { name: "エアコン取り付け", category: "エアコン", icon: "AirVent" },
  { name: "エアコン取り外し", category: "エアコン", icon: "AirVent" },
  { name: "エアコンクリーニング", category: "エアコン", icon: "Sparkles" },
  { name: "水漏れ修理", category: "水回り", icon: "Droplet" },
  { name: "トイレ修理", category: "水回り", icon: "Bath" },
  { name: "排水管清掃", category: "水回り", icon: "Waves" },
  { name: "コンセント増設", category: "電気", icon: "Plug" },
  { name: "照明器具取付", category: "電気", icon: "Lightbulb" },
  { name: "ブレーカー交換", category: "電気", icon: "Zap" },
  { name: "壁紙張替え", category: "内装", icon: "PaintBucket" },
  { name: "フローリング補修", category: "内装", icon: "Hammer" },
  { name: "網戸張替え", category: "内装", icon: "Grid3X3" },
];

// 職人データ
const craftsmen = [
  {
    display_name: "山田エアコンサービス",
    description: "エアコン取り付け専門で15年の経験があります。丁寧な作業と確実な施工を心がけています。お見積もりは無料ですので、お気軽にご相談ください。",
    profile_image_url: "https://i.pravatar.cc/150?img=1",
    prefecture: "東京都",
    city: "渋谷区",
    category: "エアコン",
    price_min: 8000,
    price_max: 15000,
    rating_avg: 4.8,
    review_count: 32,
    experience_years: 15,
    qualifications: "第二種電気工事士,冷媒フロン類取扱技術者",
  },
  {
    display_name: "佐藤設備工業",
    description: "水回りのトラブルならお任せください。水漏れ、つまり、トイレ修理など迅速に対応いたします。24時間対応可能です。",
    profile_image_url: "https://i.pravatar.cc/150?img=3",
    prefecture: "東京都",
    city: "新宿区",
    category: "水回り",
    price_min: 5000,
    price_max: 20000,
    rating_avg: 4.6,
    review_count: 48,
    experience_years: 20,
    qualifications: "給水装置工事主任技術者,排水設備工事責任技術者",
  },
  {
    display_name: "鈴木電気工事",
    description: "一般家庭から店舗まで、電気工事全般を承ります。コンセント増設、照明器具の取り付け、ブレーカー交換など、お気軽にご相談ください。",
    profile_image_url: "https://i.pravatar.cc/150?img=5",
    prefecture: "東京都",
    city: "世田谷区",
    category: "電気",
    price_min: 6000,
    price_max: 25000,
    rating_avg: 4.9,
    review_count: 56,
    experience_years: 18,
    qualifications: "第一種電気工事士,消防設備士",
  },
  {
    display_name: "田中内装リフォーム",
    description: "壁紙の張替え、フローリング補修、網戸の張替えなど、内装工事を幅広く対応しています。きれいな仕上がりをお約束します。",
    profile_image_url: "https://i.pravatar.cc/150?img=7",
    prefecture: "東京都",
    city: "目黒区",
    category: "内装",
    price_min: 10000,
    price_max: 50000,
    rating_avg: 4.7,
    review_count: 28,
    experience_years: 12,
    qualifications: "内装仕上げ施工技能士,建築施工管理技士",
  },
  {
    display_name: "高橋空調設備",
    description: "業務用から家庭用まで、エアコンの取り付け・取り外しを行っています。引っ越しシーズンも迅速対応いたします。",
    profile_image_url: "https://i.pravatar.cc/150?img=8",
    prefecture: "神奈川県",
    city: "横浜市",
    category: "エアコン",
    price_min: 7000,
    price_max: 18000,
    rating_avg: 4.5,
    review_count: 41,
    experience_years: 10,
    qualifications: "第二種電気工事士",
  },
  {
    display_name: "伊藤水道サービス",
    description: "横浜・川崎エリアで水回りのトラブルに対応しています。緊急時も30分以内に駆けつけます。",
    profile_image_url: "https://i.pravatar.cc/150?img=11",
    prefecture: "神奈川県",
    city: "川崎市",
    category: "水回り",
    price_min: 4000,
    price_max: 15000,
    rating_avg: 4.4,
    review_count: 63,
    experience_years: 8,
    qualifications: "給水装置工事主任技術者",
  },
  {
    display_name: "渡辺電設",
    description: "埼玉県全域で電気工事を承ります。住宅の電気配線からLED照明への交換まで、幅広く対応いたします。",
    profile_image_url: "https://i.pravatar.cc/150?img=12",
    prefecture: "埼玉県",
    city: "さいたま市",
    category: "電気",
    price_min: 5000,
    price_max: 20000,
    rating_avg: 4.6,
    review_count: 37,
    experience_years: 14,
    qualifications: "第一種電気工事士,認定電気工事従事者",
  },
  {
    display_name: "中村リペアサービス",
    description: "千葉県で内装リフォームを専門に行っています。小さな補修から大規模リフォームまでお任せください。",
    profile_image_url: "https://i.pravatar.cc/150?img=14",
    prefecture: "千葉県",
    city: "千葉市",
    category: "内装",
    price_min: 8000,
    price_max: 40000,
    rating_avg: 4.8,
    review_count: 24,
    experience_years: 16,
    qualifications: "内装仕上げ施工技能士",
  },
];

// レビューデータ
const reviews = [
  {
    craftsman_id: "1",
    customer_name: "田中さん",
    rating: 5,
    comment: "とても丁寧に作業していただきました。説明もわかりやすく、安心してお任せできました。また機会があればお願いしたいです。",
    created_at: "2026-02-15",
  },
  {
    craftsman_id: "1",
    customer_name: "佐藤さん",
    rating: 5,
    comment: "引っ越しで急ぎでしたが、すぐに対応していただけました。仕上がりも完璧です。",
    created_at: "2026-02-10",
  },
  {
    craftsman_id: "1",
    customer_name: "鈴木さん",
    rating: 4,
    comment: "作業は問題なかったですが、少し時間がかかりました。でも仕上がりは満足です。",
    created_at: "2026-01-28",
  },
  {
    craftsman_id: "2",
    customer_name: "高橋さん",
    rating: 5,
    comment: "深夜の水漏れにも関わらず、すぐに来ていただけました。本当に助かりました。",
    created_at: "2026-02-18",
  },
  {
    craftsman_id: "2",
    customer_name: "伊藤さん",
    rating: 4,
    comment: "トイレの修理をお願いしました。手際よく作業していただき、すぐに直りました。",
    created_at: "2026-02-05",
  },
  {
    craftsman_id: "3",
    customer_name: "渡辺さん",
    rating: 5,
    comment: "コンセントの増設をお願いしました。配線も綺麗に隠していただき、見た目もスッキリです。",
    created_at: "2026-02-12",
  },
  {
    craftsman_id: "3",
    customer_name: "中村さん",
    rating: 5,
    comment: "照明器具の取り付けをお願いしました。プロの仕事だと感心しました。",
    created_at: "2026-01-30",
  },
  {
    craftsman_id: "4",
    customer_name: "小林さん",
    rating: 5,
    comment: "壁紙の張替えをお願いしました。仕上がりがとても綺麗で大満足です。",
    created_at: "2026-02-08",
  },
  {
    craftsman_id: "4",
    customer_name: "加藤さん",
    rating: 4,
    comment: "網戸の張替えを依頼しました。丁寧な作業で新品同様になりました。",
    created_at: "2026-01-25",
  },
  {
    craftsman_id: "5",
    customer_name: "吉田さん",
    rating: 5,
    comment: "エアコンの取り外しと取り付けをお願いしました。スピーディーで助かりました。",
    created_at: "2026-02-14",
  },
  {
    craftsman_id: "6",
    customer_name: "山本さん",
    rating: 4,
    comment: "排水管の詰まりを直していただきました。原因も説明してくれて勉強になりました。",
    created_at: "2026-02-11",
  },
  {
    craftsman_id: "7",
    customer_name: "松本さん",
    rating: 5,
    comment: "ブレーカーの交換をお願いしました。安全面の説明も丁寧でした。",
    created_at: "2026-02-09",
  },
  {
    craftsman_id: "8",
    customer_name: "井上さん",
    rating: 5,
    comment: "フローリングの補修をお願いしました。傷がわからなくなるほど綺麗に直していただきました。",
    created_at: "2026-02-16",
  },
];

async function seedData(endpoint, data, name) {
  console.log(`\n📦 ${name} をシード中...`);
  
  for (const item of data) {
    try {
      const res = await fetch(`${BASE_URL}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      
      if (!res.ok) {
        console.error(`  ❌ エラー: ${res.status} ${res.statusText}`);
        const text = await res.text();
        console.error(`     ${text}`);
      } else {
        const result = await res.json();
        console.log(`  ✅ 追加: ${result.id} - ${item.name || item.display_name || item.customer_name}`);
      }
    } catch (error) {
      console.error(`  ❌ エラー: ${error.message}`);
    }
  }
}

async function main() {
  console.log("🚀 MockAPI シードを開始します...");
  console.log(`   URL: ${BASE_URL}`);
  
  // リソースが存在するか確認
  console.log("\n📡 リソースの存在確認中...");
  
  const endpoints = ["services", "craftsmen", "reviews"];
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(`${BASE_URL}/${endpoint}`);
      if (res.ok) {
        const data = await res.json();
        console.log(`  ✅ ${endpoint}: ${data.length}件のデータが存在`);
      } else if (res.status === 404) {
        console.log(`  ⚠️  ${endpoint}: リソースが見つかりません。mockapi.io で作成してください。`);
      } else {
        console.log(`  ❌ ${endpoint}: ${res.status} ${res.statusText}`);
      }
    } catch (error) {
      console.error(`  ❌ ${endpoint}: ${error.message}`);
    }
  }
  
  // データ投入
  await seedData("services", services, "サービス");
  await seedData("craftsmen", craftsmen, "職人");
  await seedData("reviews", reviews, "レビュー");
  
  console.log("\n✨ シード完了!");
}

main().catch(console.error);
