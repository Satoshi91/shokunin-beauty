import Link from "next/link";
import { Header } from "@/components/layouts/header";
import { Footer } from "@/components/layouts/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CraftsmanCard } from "@/components/craftsman-card";
import { getCraftsmen } from "@/lib/api";
import {
  AirVent,
  Droplet,
  Zap,
  PaintBucket,
  Search,
  Calendar,
  CheckCircle,
  Star,
  ArrowRight,
} from "lucide-react";

const serviceCategories = [
  {
    name: "エアコン",
    description: "取り付け・取り外し・クリーニング",
    icon: AirVent,
    href: "/craftsmen?category=エアコン",
    color: "bg-blue-50 text-blue-600",
  },
  {
    name: "水回り",
    description: "水漏れ修理・トイレ・排水管",
    icon: Droplet,
    href: "/craftsmen?category=水回り",
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    name: "電気",
    description: "コンセント・照明・ブレーカー",
    icon: Zap,
    href: "/craftsmen?category=電気",
    color: "bg-yellow-50 text-yellow-600",
  },
  {
    name: "内装",
    description: "壁紙・フローリング・網戸",
    icon: PaintBucket,
    href: "/craftsmen?category=内装",
    color: "bg-purple-50 text-purple-600",
  },
];

const steps = [
  {
    step: 1,
    title: "職人を探す",
    description: "エリアとサービスで最適な職人を検索",
    icon: Search,
  },
  {
    step: 2,
    title: "施工依頼する",
    description: "空き状況を確認して日時を選択",
    icon: Calendar,
  },
  {
    step: 3,
    title: "作業完了",
    description: "プロの技術で確実に施工",
    icon: CheckCircle,
  },
  {
    step: 4,
    title: "レビュー",
    description: "評価を投稿して次の人の参考に",
    icon: Star,
  },
];

export default async function Home() {
  const craftsmen = await getCraftsmen({ sortBy: "rating_avg", order: "desc" });
  const featuredCraftsmen = craftsmen.slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 py-20 text-white lg:py-28">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                信頼できる職人に、
                <br />
                簡単に依頼できる
              </h1>
              <p className="mt-6 text-lg text-blue-100 sm:text-xl">
                エアコン取り付け、水回り修繕、電気工事など、
                <br className="hidden sm:block" />
                厳選された職人にオンラインで簡単依頼
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/craftsmen">
                  <Button
                    size="lg"
                    className="w-full bg-white text-blue-600 hover:bg-blue-50 sm:w-auto"
                  >
                    職人を探す
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/signup?role=craftsman">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-2 border-white bg-white/20 text-white hover:bg-white/30 sm:w-auto"
                  >
                    職人として登録
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                人気のサービス
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                さまざまな専門技術を持つ職人が登録しています
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {serviceCategories.map((service) => (
                <Link key={service.name} href={service.href}>
                  <Card hover className="h-full">
                    <CardContent className="flex flex-col items-center p-6 text-center">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-xl ${service.color}`}
                      >
                        <service.icon className="h-7 w-7" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-gray-900">
                        {service.name}
                      </h3>
                      <p className="mt-2 text-sm text-gray-500">
                        {service.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Craftsmen Section */}
        <section className="bg-gray-50 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">注目の職人</h2>
              <p className="mt-4 text-lg text-gray-600">
                高評価の職人をご紹介します
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredCraftsmen.map((craftsman) => (
                <CraftsmanCard key={craftsman.id} craftsman={craftsman} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/craftsmen">
                <Button variant="outline">
                  すべての職人を見る
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How it works Section */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">ご利用の流れ</h2>
              <p className="mt-4 text-lg text-gray-600">
                かんたん4ステップで依頼完了
              </p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div key={step.step} className="relative text-center">
                  {index < steps.length - 1 && (
                    <div className="absolute left-1/2 top-8 hidden h-0.5 w-full bg-gray-200 lg:block" />
                  )}
                  <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white">
                    <step.icon className="h-7 w-7" />
                  </div>
                  <div className="mt-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                    {step.step}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-50 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-2xl bg-blue-600">
              <div className="px-6 py-12 sm:px-12 lg:flex lg:items-center lg:justify-between lg:px-16 lg:py-16">
                <div>
                  <h2 className="text-2xl font-bold text-white sm:text-3xl">
                    職人として登録しませんか？
                  </h2>
                  <p className="mt-3 text-lg text-blue-100">
                    新規顧客の獲得、空き時間の有効活用に。
                    <br />
                    登録・掲載は無料です。
                  </p>
                </div>
                <div className="mt-8 lg:mt-0 lg:shrink-0">
                  <Link href="/signup?role=craftsman">
                    <Button
                      size="lg"
                      className="w-full bg-white text-blue-600 hover:bg-blue-50 lg:w-auto"
                    >
                      無料で登録する
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
