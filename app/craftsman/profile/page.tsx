"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layouts/header";
import { Footer } from "@/components/layouts/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { getCraftsman, updateCraftsman } from "@/lib/api";
import type { Craftsman, UpdateCraftsmanInput } from "@/lib/types";
import { SERVICE_CATEGORIES } from "@/lib/types";
import {
  ArrowLeft,
  Save,
  Loader2,
  User,
  MapPin,
  Briefcase,
  Award,
  Yen,
  Image,
  ExternalLink,
} from "lucide-react";

const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
];

export default function CraftsmanProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [craftsman, setCraftsman] = useState<Craftsman | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<UpdateCraftsmanInput>({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user.role !== "craftsman") {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    if (user?.role === "craftsman" && user.craftsmanId) {
      fetchCraftsman();
    }
  }, [user]);

  const fetchCraftsman = async () => {
    if (!user?.craftsmanId) return;
    setLoading(true);
    try {
      const data = await getCraftsman(user.craftsmanId);
      setCraftsman(data);
      setFormData({
        display_name: data.display_name,
        description: data.description,
        profile_image_url: data.profile_image_url,
        prefecture: data.prefecture,
        city: data.city,
        category: data.category,
        price_min: data.price_min,
        price_max: data.price_max,
        experience_years: data.experience_years,
        qualifications: data.qualifications,
      });
    } catch (error) {
      console.error("Failed to fetch craftsman:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.craftsmanId) return;

    setSaving(true);
    setSuccessMessage("");
    try {
      const updated = await updateCraftsman(user.craftsmanId, formData);
      setCraftsman(updated);
      setSuccessMessage("職人情報を更新しました");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to update craftsman:", error);
      alert("更新に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (
    field: keyof UpdateCraftsmanInput,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!user || user.role !== "craftsman") {
    return null;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!craftsman) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <User className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">職人情報が見つかりません</p>
            <p className="mt-2 text-sm text-gray-400">
              デモアカウントでログインし直してください
            </p>
            <Link
              href="/craftsman/dashboard"
              className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-500"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              ダッシュボードに戻る
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/craftsman/dashboard"
            className="mb-6 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            ダッシュボードに戻る
          </Link>

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">職人情報編集</h1>
              <p className="mt-1 text-gray-600">
                公開プロフィールを編集します
              </p>
            </div>
            <Link
              href={`/craftsmen/${craftsman.id}`}
              target="_blank"
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-500"
            >
              公開ページを見る
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>

          {successMessage && (
            <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-800">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5" />
                  基本情報
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="表示名（屋号・店舗名）"
                  value={formData.display_name || ""}
                  onChange={(e) =>
                    handleInputChange("display_name", e.target.value)
                  }
                  placeholder="例: 山田エアコンサービス"
                />
                <Textarea
                  label="自己紹介・サービス説明"
                  value={formData.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="サービスの特徴や強みをアピールしましょう"
                  rows={4}
                />
                <Input
                  label="プロフィール画像URL"
                  value={formData.profile_image_url || ""}
                  onChange={(e) =>
                    handleInputChange("profile_image_url", e.target.value)
                  }
                  placeholder="https://example.com/image.jpg"
                />
                {formData.profile_image_url && (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">プレビュー:</span>
                    <img
                      src={formData.profile_image_url}
                      alt="プロフィール画像"
                      className="h-16 w-16 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://i.pravatar.cc/150?img=1";
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5" />
                  対応エリア
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    都道府県
                  </label>
                  <select
                    value={formData.prefecture || ""}
                    onChange={(e) =>
                      handleInputChange("prefecture", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">選択してください</option>
                    {PREFECTURES.map((pref) => (
                      <option key={pref} value={pref}>
                        {pref}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="市区町村"
                  value={formData.city || ""}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="例: 渋谷区"
                />
              </CardContent>
            </Card>

            {/* Service */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Briefcase className="h-5 w-5" />
                  サービス情報
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    サービスカテゴリ
                  </label>
                  <select
                    value={formData.category || ""}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">選択してください</option>
                    {SERVICE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="最低価格（円）"
                    type="number"
                    value={formData.price_min || ""}
                    onChange={(e) =>
                      handleInputChange("price_min", parseInt(e.target.value) || 0)
                    }
                    placeholder="例: 5000"
                  />
                  <Input
                    label="最高価格（円）"
                    type="number"
                    value={formData.price_max || ""}
                    onChange={(e) =>
                      handleInputChange("price_max", parseInt(e.target.value) || 0)
                    }
                    placeholder="例: 20000"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="h-5 w-5" />
                  経験・資格
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="経験年数"
                  type="number"
                  value={formData.experience_years || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "experience_years",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="例: 10"
                />
                <Input
                  label="保有資格（カンマ区切り）"
                  value={formData.qualifications || ""}
                  onChange={(e) =>
                    handleInputChange("qualifications", e.target.value)
                  }
                  placeholder="例: 第二種電気工事士,冷媒フロン類取扱技術者"
                />
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-3">
              <Link href="/craftsman/dashboard">
                <Button type="button" variant="outline">
                  キャンセル
                </Button>
              </Link>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                保存する
              </Button>
            </div>
          </form>

          <div className="mt-8 rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              ※ これはデモ用の編集ページです。変更内容はMockAPIに保存されます。
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
