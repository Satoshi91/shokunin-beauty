import { Header } from "@/components/layouts/header";
import { Footer } from "@/components/layouts/footer";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  UserCheck,
  Calendar,
  MessageSquare,
  CreditCard,
  Star,
  Shield,
  Clock,
} from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "1. 職人を探す",
    description:
      "トップページまたは職人一覧から、エリア・サービス内容で条件を絞り込んで職人を検索できます。各職人のプロフィール、資格、料金、レビューを確認して最適な職人を見つけましょう。",
  },
  {
    icon: UserCheck,
    title: "2. 職人のプロフィールを確認",
    description:
      "職人の詳細ページでは、経歴・資格・対応可能なサービス・料金目安・過去の施工事例・お客様からのレビューを確認できます。",
  },
  {
    icon: Calendar,
    title: "3. 施工依頼する",
    description:
      "希望の日時を選択して施工依頼を送信します。職人が確認後、依頼が確定します。事前にメッセージで詳細を相談することも可能です。",
  },
  {
    icon: MessageSquare,
    title: "4. 職人とやり取り",
    description:
      "依頼確定後、メッセージ機能で職人と直接やり取りできます。作業内容の確認、当日の準備物、アクセス方法などを事前に相談しましょう。",
  },
  {
    icon: CreditCard,
    title: "5. 作業・お支払い",
    description:
      "依頼日時に職人が訪問し、作業を行います。作業完了後、サイト上で決済を行います。現金払いにも対応している職人もいます。",
  },
  {
    icon: Star,
    title: "6. レビューを投稿",
    description:
      "作業完了後、職人への評価とレビューを投稿できます。あなたのレビューが他のお客様の参考になります。",
  },
];

const features = [
  {
    icon: Shield,
    title: "安心の職人審査",
    description:
      "すべての職人は登録時に資格・経歴の審査を行っています。信頼できる職人のみが掲載されています。",
  },
  {
    icon: Clock,
    title: "24時間依頼受付",
    description:
      "オンラインでいつでも施工依頼が可能です。お忙しい方でも隙間時間に簡単に依頼できます。",
  },
  {
    icon: MessageSquare,
    title: "事前相談可能",
    description:
      "依頼前に職人へ直接メッセージで相談できます。作業内容や見積もりについて事前に確認できます。",
  },
  {
    icon: Star,
    title: "実績が見える",
    description:
      "過去のお客様からのレビューや評価を確認できるので、安心して依頼先を選べます。",
  },
];

export default function GuidePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold sm:text-4xl">ご利用ガイド</h1>
              <p className="mt-4 text-lg text-blue-100">
                職人Beautyの使い方をわかりやすくご説明します
              </p>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl font-bold text-gray-900">
              ご利用の流れ
            </h2>
            <p className="mt-4 text-center text-gray-600">
              かんたん6ステップで職人に依頼できます
            </p>

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {steps.map((step) => (
                <Card key={step.title}>
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                      <step.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl font-bold text-gray-900">
              職人Beautyの特徴
            </h2>
            <p className="mt-4 text-center text-gray-600">
              安心・便利にご利用いただける仕組み
            </p>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Notes */}
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl font-bold text-gray-900">
              ご利用にあたってのご注意
            </h2>

            <div className="mt-8 space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900">
                    キャンセルについて
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    施工依頼のキャンセルは、作業日の2日前まで無料で行えます。前日・当日のキャンセルはキャンセル料が発生する場合があります。詳細は各職人のプロフィールをご確認ください。
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900">
                    料金について
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    掲載されている料金は目安です。実際の料金は作業内容によって変動する場合があります。追加費用が発生する場合は、事前に職人からご説明いたします。
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900">
                    トラブル時の対応
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    万が一トラブルが発生した場合は、お問い合わせフォームまたはサポートダイヤルにてご連絡ください。迅速に対応いたします。
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
