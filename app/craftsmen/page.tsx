import { Suspense } from "react";
import { Header } from "@/components/layouts/header";
import { Footer } from "@/components/layouts/footer";
import { CraftsmanCard } from "@/components/craftsman-card";
import { SearchForm } from "./search-form";
import { getCraftsmen, type GetCraftsmenParams } from "@/lib/api";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    prefecture?: string;
    sortBy?: string;
  }>;
}

export default async function CraftsmenPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const apiParams: GetCraftsmenParams = {
    category: params.category,
    prefecture: params.prefecture,
    sortBy: (params.sortBy as GetCraftsmenParams["sortBy"]) || "rating_avg",
    order: params.sortBy === "price_min" ? "asc" : "desc",
  };

  const craftsmen = await getCraftsmen(apiParams);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">職人を探す</h1>
            <p className="mt-2 text-gray-600">
              エリアやカテゴリから最適な職人を見つけましょう
            </p>
          </div>

          {/* Search Form */}
          <Suspense fallback={<div className="h-24 animate-pulse rounded-xl bg-gray-200" />}>
            <SearchForm />
          </Suspense>

          {/* Results */}
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {craftsmen.length}件の職人が見つかりました
              </p>
            </div>

            {craftsmen.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {craftsmen.map((craftsman) => (
                  <CraftsmanCard key={craftsman.id} craftsman={craftsman} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
                <p className="text-gray-500">
                  条件に一致する職人が見つかりませんでした
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  検索条件を変更してお試しください
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
