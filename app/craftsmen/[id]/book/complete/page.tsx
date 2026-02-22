"use client";

import { use } from "react";
import Link from "next/link";
import { Header } from "@/components/layouts/header";
import { Footer } from "@/components/layouts/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Home, Search, Calendar } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BookingCompletePage({ params }: PageProps) {
  const { id } = use(params);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-12">
        <Card className="w-full max-w-lg text-center">
          <CardContent className="p-8">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              施工依頼を送信しました
            </h1>
            
            <p className="mb-6 text-gray-600">
              職人からの確認連絡をお待ちください。
              <br />
              通常1〜2営業日以内にご連絡いたします。
            </p>

            <div className="mb-8 rounded-lg bg-blue-50 p-4">
              <h3 className="mb-2 font-medium text-blue-800">今後の流れ</h3>
              <ol className="space-y-2 text-left text-sm text-blue-700">
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs">
                    1
                  </span>
                  <span>職人が依頼内容を確認します</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs">
                    2
                  </span>
                  <span>日程調整のご連絡をいたします</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs">
                    3
                  </span>
                  <span>依頼確定後、作業日にお伺いします</span>
                </li>
              </ol>
            </div>

            <div className="space-y-3">
              <Link href="/" className="block">
                <Button className="w-full">
                  <Home className="mr-2 h-4 w-4" />
                  トップページへ
                </Button>
              </Link>
              
              <Link href="/craftsmen" className="block">
                <Button variant="outline" className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  他の職人を探す
                </Button>
              </Link>

              <Link href={`/craftsmen/${id}`} className="block">
                <Button variant="ghost" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  この職人のページに戻る
                </Button>
              </Link>
            </div>

            <div className="mt-8 rounded-lg bg-gray-100 p-4">
              <p className="text-xs text-gray-600">
                ※ これはデモ用の施工依頼完了画面です。正式なデータとしては使用されません。自由にお試しください。
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
