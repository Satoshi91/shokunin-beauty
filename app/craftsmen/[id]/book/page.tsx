"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layouts/header";
import { Footer } from "@/components/layouts/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { getCraftsman, createJob } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatPriceRange } from "@/lib/utils";
import type { Craftsman, CreateJobInput } from "@/lib/types";
import { ArrowLeft, Calendar, MapPin, Clock, User, CheckCircle, UserCheck, Loader2, ChevronDown, Wrench } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

type Step = "form" | "confirm";

interface BookingData {
  date: string;
  time: string;
  service: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

const TIME_SLOT_OPTIONS = [
  { value: "09:00", label: "09:00" },
  { value: "10:00", label: "10:00" },
  { value: "11:00", label: "11:00" },
  { value: "13:00", label: "13:00" },
  { value: "14:00", label: "14:00" },
  { value: "15:00", label: "15:00" },
  { value: "16:00", label: "16:00" },
  { value: "17:00", label: "17:00" },
];

const SERVICE_OPTIONS = [
  { value: "エアコン取り付け", label: "エアコン取り付け" },
  { value: "エアコン取り外し", label: "エアコン取り外し" },
  { value: "エアコンクリーニング", label: "エアコンクリーニング" },
  { value: "エアコン修理", label: "エアコン修理" },
  { value: "エアコン移設", label: "エアコン移設" },
];

export default function BookingPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [craftsman, setCraftsman] = useState<Craftsman | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [errors, setErrors] = useState<Partial<Record<keyof BookingData, string>>>({});
  const [useProfileInfo, setUseProfileInfo] = useState(false);
  const [openSections, setOpenSections] = useState({
    service: true,
    datetime: false,
    location: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };
  
  const [bookingData, setBookingData] = useState<BookingData>({
    date: "",
    time: "",
    service: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  const hasProfileInfo = user && (
    user.name ||
    user.profile?.phone ||
    user.profile?.email ||
    user.profile?.address
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getCraftsman(id);
        setCraftsman(data);
      } catch (error) {
        console.error("Failed to fetch craftsman:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleUseProfileToggle = () => {
    if (!useProfileInfo && user) {
      setBookingData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.profile?.phone || prev.phone,
        email: user.profile?.email || prev.email,
        address: user.profile?.address || prev.address,
      }));
      setUseProfileInfo(true);
    } else {
      setBookingData((prev) => ({
        ...prev,
        name: "",
        phone: "",
        email: "",
        address: "",
      }));
      setUseProfileInfo(false);
    }
  };

  const updateField = (field: keyof BookingData, value: string) => {
    setBookingData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BookingData, string>> = {};

    if (!bookingData.service) newErrors.service = "サービス内容を選択してください";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setStep("confirm");
    }
  };

  const handleConfirm = async () => {
    if (!user) {
      router.push(`/login?redirect=/craftsmen/${id}/book`);
      return;
    }

    if (!craftsman) return;

    setSubmitting(true);
    try {
      const jobInput: CreateJobInput = {
        craftsman_id: id,
        craftsman_name: craftsman.display_name,
        customer_id: user.id,
        customer_name: bookingData.name,
        customer_phone: bookingData.phone,
        customer_email: bookingData.email,
        customer_address: bookingData.address,
        service: bookingData.service,
        preferred_date: bookingData.date,
        preferred_time: bookingData.time,
        notes: bookingData.notes,
      };

      await createJob(jobInput);
      router.push(`/craftsmen/${id}/book/complete`);
    } catch (error) {
      console.error("Failed to create job:", error);
      alert("施工依頼の送信に失敗しました。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">読み込み中...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!craftsman) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">職人が見つかりませんでした</p>
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
            href={`/craftsmen/${id}`}
            className="mb-6 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            職人詳細に戻る
          </Link>

          {/* Progress Steps */}
          <div className="mb-8 flex items-center justify-center">
            <div className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  step === "form"
                    ? "bg-blue-600 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {step === "confirm" ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  "1"
                )}
              </div>
              <span className="ml-2 text-sm font-medium">入力</span>
            </div>
            <div className="mx-4 h-px w-12 bg-gray-300" />
            <div className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  step === "confirm"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                2
              </div>
              <span className="ml-2 text-sm font-medium">確認</span>
            </div>
            <div className="mx-4 h-px w-12 bg-gray-300" />
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                3
              </div>
              <span className="ml-2 text-sm font-medium">完了</span>
            </div>
          </div>

          {/* Craftsman Summary */}
          <Card className="mb-6">
            <CardContent className="flex items-center gap-4 p-4">
              <Avatar
                src={craftsman.profile_image_url}
                alt={craftsman.display_name}
                size="lg"
              />
              <div>
                <p className="font-semibold">{craftsman.display_name}</p>
                <p className="text-sm text-gray-500">
                  {craftsman.category} / {craftsman.prefecture}
                </p>
                <p className="text-sm text-blue-600">
                  {formatPriceRange(craftsman.price_min, craftsman.price_max)}
                </p>
              </div>
            </CardContent>
          </Card>

          {step === "form" ? (
            <div className="space-y-4">
              {/* Section 1: 施工内容 */}
              <Card>
                <button
                  type="button"
                  onClick={() => toggleSection("service")}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <h3 className="flex items-center font-medium">
                    <Wrench className="mr-2 h-5 w-5 text-blue-600" />
                    施工内容
                    <span className="ml-2 text-xs text-red-500">*必須</span>
                  </h3>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform ${
                      openSections.service ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openSections.service && (
                  <CardContent className="border-t pt-4">
                    <div className="space-y-4">
                      <Select
                        label="サービス内容"
                        value={bookingData.service}
                        onChange={(e) => updateField("service", e.target.value)}
                        placeholder="サービスを選択"
                        options={SERVICE_OPTIONS}
                        error={errors.service}
                        required
                      />
                      <Textarea
                        label="ご要望・備考"
                        placeholder="作業に関するご要望があればご記入ください"
                        rows={3}
                        value={bookingData.notes}
                        onChange={(e) => updateField("notes", e.target.value)}
                      />
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Section 2: 希望日・時間 */}
              <Card>
                <button
                  type="button"
                  onClick={() => toggleSection("datetime")}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <h3 className="flex items-center font-medium">
                    <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                    希望日・時間
                  </h3>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform ${
                      openSections.datetime ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openSections.datetime && (
                  <CardContent className="border-t pt-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          希望日
                        </label>
                        <Input
                          type="date"
                          min={getMinDate()}
                          value={bookingData.date}
                          onChange={(e) => updateField("date", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          希望時間
                        </label>
                        <Select
                          value={bookingData.time}
                          onChange={(e) => updateField("time", e.target.value)}
                          placeholder="時間を選択（任意）"
                          options={TIME_SLOT_OPTIONS}
                        />
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      ※ 具体的な日程は職人との相談で決定します
                    </p>
                  </CardContent>
                )}
              </Card>

              {/* Section 3: 施工場所 */}
              <Card>
                <button
                  type="button"
                  onClick={() => toggleSection("location")}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <h3 className="flex items-center font-medium">
                    <MapPin className="mr-2 h-5 w-5 text-blue-600" />
                    施工場所
                  </h3>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform ${
                      openSections.location ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openSections.location && (
                  <CardContent className="border-t pt-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="flex items-center text-sm font-medium text-gray-700">
                        <User className="mr-2 h-4 w-4" />
                        お客様情報
                      </h4>
                      {user && (
                        <button
                          type="button"
                          onClick={handleUseProfileToggle}
                          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                            useProfileInfo
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          <UserCheck className="h-4 w-4" />
                          {useProfileInfo ? "登録情報を使用中" : "登録情報から入力"}
                        </button>
                      )}
                    </div>
                    {user && !hasProfileInfo && (
                      <div className="mb-4 rounded-lg bg-yellow-50 p-3">
                        <p className="text-sm text-yellow-800">
                          プロフィールに情報が登録されていません。
                          <Link
                            href="/mypage"
                            className="ml-1 font-medium underline"
                          >
                            マイページで登録する
                          </Link>
                        </p>
                      </div>
                    )}
                    {!user && (
                      <div className="mb-4 rounded-lg bg-gray-50 p-3">
                        <p className="text-sm text-gray-600">
                          <Link
                            href="/login"
                            className="font-medium text-blue-600 underline"
                          >
                            ログイン
                          </Link>
                          すると、登録情報から自動入力できます
                        </p>
                      </div>
                    )}
                    <div className="space-y-4">
                      <Input
                        label="お名前"
                        placeholder="山田 太郎"
                        value={bookingData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Input
                          label="電話番号"
                          type="tel"
                          placeholder="090-1234-5678"
                          value={bookingData.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                        />
                        <Input
                          label="メールアドレス"
                          type="email"
                          placeholder="example@email.com"
                          value={bookingData.email}
                          onChange={(e) => updateField("email", e.target.value)}
                        />
                      </div>
                      <Textarea
                        label="住所"
                        placeholder="東京都渋谷区..."
                        rows={2}
                        value={bookingData.address}
                        onChange={(e) => updateField("address", e.target.value)}
                      />
                    </div>
                  </CardContent>
                )}
              </Card>

              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-xs text-blue-800">
                  ※ これはデモ用の施工依頼フォームです。正式なデータとしては使用されません。自由にお試しください。
                </p>
              </div>

              <Button onClick={handleSubmit} className="w-full">
                確認画面へ進む
              </Button>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>依頼内容の確認</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="mb-3 font-medium">施工内容</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex">
                      <dt className="w-24 text-gray-500">サービス</dt>
                      <dd>{bookingData.service || "未指定"}</dd>
                    </div>
                    {bookingData.notes && (
                      <div className="flex">
                        <dt className="w-24 text-gray-500">備考</dt>
                        <dd className="flex-1">{bookingData.notes}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="mb-3 font-medium">希望日・時間</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex">
                      <dt className="w-24 text-gray-500">希望日</dt>
                      <dd>{bookingData.date || "未指定"}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-24 text-gray-500">希望時間</dt>
                      <dd>{bookingData.time || "未指定"}</dd>
                    </div>
                  </dl>
                </div>

                {(bookingData.name || bookingData.phone || bookingData.email || bookingData.address) && (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h4 className="mb-3 font-medium">施工場所・お客様情報</h4>
                    <dl className="space-y-2 text-sm">
                      {bookingData.name && (
                        <div className="flex">
                          <dt className="w-24 text-gray-500">お名前</dt>
                          <dd>{bookingData.name}</dd>
                        </div>
                      )}
                      {bookingData.phone && (
                        <div className="flex">
                          <dt className="w-24 text-gray-500">電話番号</dt>
                          <dd>{bookingData.phone}</dd>
                        </div>
                      )}
                      {bookingData.email && (
                        <div className="flex">
                          <dt className="w-24 text-gray-500">メール</dt>
                          <dd>{bookingData.email}</dd>
                        </div>
                      )}
                      {bookingData.address && (
                        <div className="flex">
                          <dt className="w-24 text-gray-500">住所</dt>
                          <dd>{bookingData.address}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}

                {!user && (
                  <div className="rounded-lg bg-orange-50 p-4">
                    <p className="text-sm text-orange-800">
                      施工依頼を送信するには
                      <Link
                        href={`/login?redirect=/craftsmen/${id}/book`}
                        className="mx-1 font-medium underline"
                      >
                        ログイン
                      </Link>
                      が必要です。
                    </p>
                  </div>
                )}

                <div className="rounded-lg bg-yellow-50 p-4">
                  <p className="text-sm text-yellow-800">
                    上記の内容で施工依頼を送信します。よろしければ「依頼を確定する」ボタンを押してください。
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep("form")}
                    className="flex-1"
                    disabled={submitting}
                  >
                    戻って修正
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    className="flex-1"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        送信中...
                      </>
                    ) : (
                      "依頼を確定する"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
