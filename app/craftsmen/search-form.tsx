"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { SERVICE_CATEGORIES } from "@/lib/types";
import { PREFECTURES } from "@/lib/utils";
import { Search, X } from "lucide-react";

const categoryOptions = [
  { value: "", label: "すべてのカテゴリ" },
  ...SERVICE_CATEGORIES.map((cat) => ({ value: cat, label: cat })),
];

const prefectureOptions = [
  { value: "", label: "すべてのエリア" },
  ...PREFECTURES.map((pref) => ({ value: pref, label: pref })),
];

const sortOptions = [
  { value: "rating_avg", label: "評価が高い順" },
  { value: "price_min", label: "料金が安い順" },
  { value: "review_count", label: "レビューが多い順" },
];

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "";
  const currentPrefecture = searchParams.get("prefecture") || "";
  const currentSort = searchParams.get("sortBy") || "rating_avg";

  const handleChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/craftsmen?${params.toString()}`);
  };

  const handleClear = () => {
    router.push("/craftsmen");
  };

  const hasFilters = currentCategory || currentPrefecture;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Select
            label="カテゴリ"
            options={categoryOptions}
            value={currentCategory}
            onChange={(e) => handleChange("category", e.target.value)}
          />
        </div>
        <div className="flex-1">
          <Select
            label="エリア"
            options={prefectureOptions}
            value={currentPrefecture}
            onChange={(e) => handleChange("prefecture", e.target.value)}
          />
        </div>
        <div className="flex-1">
          <Select
            label="並び替え"
            options={sortOptions}
            value={currentSort}
            onChange={(e) => handleChange("sortBy", e.target.value)}
          />
        </div>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={handleClear}>
            <X className="mr-1 h-4 w-4" />
            クリア
          </Button>
        )}
      </div>
    </div>
  );
}
