"use client";

import { useState } from "react";
import { Header } from "@/components/layouts/header";
import { Footer } from "@/components/layouts/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Mail, Phone, Clock, CheckCircle, Loader2 } from "lucide-react";

const inquiryTypes = [
  { value: "", label: "お問い合わせ種別を選択" },
  { value: "service", label: "サービスについて" },
  { value: "reservation", label: "施工依頼について" },
  { value: "payment", label: "料金・お支払いについて" },
  { value: "craftsman", label: "職人について" },
  { value: "trouble", label: "トラブル・クレーム" },
  { value: "other", label: "その他" },
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  inquiryType: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  inquiryType?: string;
  subject?: string;
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "お名前を入力してください";
    }

    if (!formData.email.trim()) {
      newErrors.email = "メールアドレスを入力してください";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "正しいメールアドレスを入力してください";
    }

    if (!formData.inquiryType) {
      newErrors.inquiryType = "お問い合わせ種別を選択してください";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "件名を入力してください";
    }

    if (!formData.message.trim()) {
      newErrors.message = "お問い合わせ内容を入力してください";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "お問い合わせ内容は10文字以上で入力してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.subject,
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            inquiryType: formData.inquiryType,
            message: formData.message,
          }),
          userId: 1,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert("送信に失敗しました。時間をおいて再度お試しください。");
      }
    } catch {
      alert("送信に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center py-16">
          <div className="mx-auto max-w-md px-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              お問い合わせを受け付けました
            </h1>
            <p className="mt-4 text-gray-600">
              ご入力いただいたメールアドレス宛に確認メールをお送りしました。
              担当者より2営業日以内にご連絡いたします。
            </p>
            <a
              href="/"
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              トップページに戻る
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold sm:text-4xl">お問い合わせ</h1>
              <p className="mt-4 text-lg text-blue-100">
                ご質問・ご要望がございましたらお気軽にお問い合わせください
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-3">
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">メール</h3>
                    <p className="text-sm text-gray-600">support@shokunin-beauty.jp</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">電話</h3>
                    <p className="text-sm text-gray-600">0120-XXX-XXX</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">受付時間</h3>
                    <p className="text-sm text-gray-600">平日 10:00〜18:00</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="pb-16">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <Card>
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900">
                  お問い合わせフォーム
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  <span className="text-red-500">*</span> は必須項目です
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  <Input
                    label="お名前 *"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="山田 太郎"
                    error={errors.name}
                  />

                  <Input
                    label="メールアドレス *"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    error={errors.email}
                  />

                  <Input
                    label="電話番号（任意）"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="090-XXXX-XXXX"
                  />

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      お問い合わせ種別 *
                    </label>
                    <Select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      options={inquiryTypes}
                    />
                    {errors.inquiryType && (
                      <p className="mt-1 text-sm text-red-600">{errors.inquiryType}</p>
                    )}
                  </div>

                  <Input
                    label="件名 *"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="お問い合わせの件名"
                    error={errors.subject}
                  />

                  <Textarea
                    label="お問い合わせ内容 *"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="お問い合わせ内容をご記入ください"
                    rows={6}
                    error={errors.message}
                  />

                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-600">
                      ご入力いただいた個人情報は、お問い合わせへの回答および関連するご連絡のみに使用いたします。
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        送信中...
                      </>
                    ) : (
                      "送信する"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
