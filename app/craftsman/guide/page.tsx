import Link from "next/link";
import { Header } from "@/components/layouts/header";
import { Footer } from "@/components/layouts/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  FileCheck,
  Settings,
  CalendarCheck,
  MessageSquare,
  Wallet,
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  Shield,
} from "lucide-react";

const registrationSteps = [
  {
    icon: UserPlus,
    title: "1. アカウント登録",
    description:
      "メールアドレスとパスワードを入力して、職人アカウントを作成します。SNSアカウントでの登録も可能です。",
  },
  {
    icon: FileCheck,
    title: "2. 本人確認・資格登録",
    description:
      "運転免許証などの本人確認書類と、お持ちの資格証明書をアップロードしてください。審査には1〜3営業日かかります。",
  },
  {
    icon: Settings,
    title: "3. プロフィール設定",
    description:
      "対応可能なサービス、対応エリア、料金目安、自己紹介、施工事例などを登録します。充実したプロフィールが依頼獲得につながります。",
  },
  {
    icon: CalendarCheck,
    title: "4. スケジュール設定",
    description:
      "対応可能な曜日・時間帯を設定します。依頼が入った際に自動で空き状況が更新されます。",
  },
  {
    icon: MessageSquare,
    title: "5. 施工依頼を受ける",
    description:
      "お客様から施工依頼が届きます。内容を確認して承認すると依頼が確定します。メッセージで詳細を相談することも可能です。",
  },
  {
    icon: Wallet,
    title: "6. 作業・報酬受取",
    description:
      "作業完了後、お客様が決済を行います。報酬は月末締め、翌月15日に登録口座へ振り込まれます。",
  },
];

const benefits = [
  {
    icon: Users,
    title: "新規顧客の獲得",
    description:
      "多くのお客様が職人を探しています。プロフィールを充実させて、新しいお客様との出会いを。",
  },
  {
    icon: Clock,
    title: "空き時間の有効活用",
    description:
      "自分でスケジュールを管理。空いた時間だけ仕事を受けることができます。",
  },
  {
    icon: TrendingUp,
    title: "実績で信頼を構築",
    description:
      "お客様からのレビューが蓄積され、高評価は新規依頼獲得につながります。",
  },
  {
    icon: Shield,
    title: "安心のサポート体制",
    description:
      "トラブル発生時も運営がサポート。安心してお仕事に集中できます。",
  },
];

const requirements = [
  "20歳以上であること",
  "本人確認書類（運転免許証、マイナンバーカード等）を提出できること",
  "該当分野の実務経験があること",
  "必要に応じて資格証明書を提出できること",
  "スマートフォンまたはPCでサービスを利用できること",
];

const feeInfo = [
  { label: "登録料", value: "無料" },
  { label: "月額利用料", value: "無料" },
  { label: "成約手数料", value: "売上の10%" },
  { label: "振込手数料", value: "無料" },
];

export default function CraftsmanGuidePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16 text-white lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
                職人として登録する
              </h1>
              <p className="mt-4 text-lg text-blue-100 lg:text-xl">
                あなたの技術を必要としているお客様がいます
              </p>
              <div className="mt-8">
                <Link href="/signup?role=craftsman">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50"
                  >
                    無料で登録する
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl font-bold text-gray-900">
              職人Beautyで働くメリット
            </h2>
            <p className="mt-4 text-center text-gray-600">
              登録・掲載は無料。あなたのペースで働けます
            </p>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white">
                    <benefit.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Registration Steps */}
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl font-bold text-gray-900">
              登録の流れ
            </h2>
            <p className="mt-4 text-center text-gray-600">
              かんたん6ステップで登録完了
            </p>

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {registrationSteps.map((step) => (
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

        {/* Requirements & Fees */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Requirements */}
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-gray-900">登録条件</h2>
                  <p className="mt-2 text-sm text-gray-600">
                    以下の条件を満たす方がご登録いただけます
                  </p>
                  <ul className="mt-6 space-y-3">
                    {requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Fees */}
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-gray-900">料金体系</h2>
                  <p className="mt-2 text-sm text-gray-600">
                    シンプルでわかりやすい料金設定
                  </p>
                  <div className="mt-6 space-y-4">
                    {feeInfo.map((fee) => (
                      <div
                        key={fee.label}
                        className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-b-0"
                      >
                        <span className="text-gray-700">{fee.label}</span>
                        <span className="font-semibold text-gray-900">
                          {fee.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-6 text-sm text-gray-500">
                    ※ 成約手数料は、お客様からの支払い確定時に差し引かれます。
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl font-bold text-gray-900">
              よくある質問
            </h2>

            <div className="mt-8 space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900">
                    審査にはどのくらい時間がかかりますか？
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    通常1〜3営業日で審査が完了します。書類に不備がある場合は、追加で確認のご連絡をさせていただく場合があります。
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900">
                    副業でも登録できますか？
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    はい、副業での登録も可能です。スケジュールは自分で管理できるので、本業との両立も可能です。
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900">
                    資格がなくても登録できますか？
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    サービス内容によっては資格が必要な場合があります（電気工事士など）。資格不要のサービスもありますので、詳しくはお問い合わせください。
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900">
                    料金は自分で設定できますか？
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    はい、サービス料金は各職人が自由に設定できます。市場価格を参考に、ご自身のスキルや経験に見合った価格を設定してください。
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-2xl bg-blue-600">
              <div className="px-6 py-12 text-center sm:px-12 lg:py-16">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  今すぐ職人として登録しよう
                </h2>
                <p className="mt-4 text-lg text-blue-100">
                  登録は無料。あなたの技術を待っているお客様がいます。
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link href="/signup?role=craftsman">
                    <Button
                      size="lg"
                      className="w-full bg-white text-blue-600 hover:bg-blue-50 sm:w-auto"
                    >
                      無料で登録する
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-white text-white hover:bg-white/10 sm:w-auto"
                    >
                      お問い合わせ
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
