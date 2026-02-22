"use client";

import { useState } from "react";
import { Header } from "@/components/layouts/header";
import { Footer } from "@/components/layouts/footer";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  category: string;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    category: "ご利用について",
    items: [
      {
        question: "会員登録は必要ですか？",
        answer:
          "はい、サービスのご利用には会員登録が必要です。登録は無料で、メールアドレスまたはSNSアカウントで簡単に登録できます。",
      },
      {
        question: "どのようなサービスを依頼できますか？",
        answer:
          "エアコン取り付け・取り外し・クリーニング、水回り修繕（水漏れ修理、トイレ修理、排水管清掃など）、電気工事（コンセント増設、照明取り付けなど）、内装工事（壁紙張替え、フローリング補修など）のサービスをご依頼いただけます。",
      },
      {
        question: "対応エリアはどこですか？",
        answer:
          "現在は東京都、神奈川県、千葉県、埼玉県の一都三県を中心にサービスを展開しています。順次エリアを拡大予定です。",
      },
      {
        question: "当日の施工依頼は可能ですか？",
        answer:
          "職人の空き状況により、当日依頼が可能な場合もあります。ただし、確実なご依頼のため、できるだけ余裕を持ってご依頼ください。",
      },
    ],
  },
  {
    category: "料金・お支払いについて",
    items: [
      {
        question: "料金の支払い方法は？",
        answer:
          "クレジットカード（VISA、MasterCard、JCB、American Express）、銀行振込、コンビニ払いに対応しています。職人によっては現金払いも可能です。",
      },
      {
        question: "追加料金が発生することはありますか？",
        answer:
          "作業内容が事前の見積もりと異なる場合、追加料金が発生することがあります。追加作業が必要な場合は、必ず事前にご説明・ご了承をいただいてから作業を行います。",
      },
      {
        question: "見積もりは無料ですか？",
        answer:
          "多くの職人が無料見積もりに対応しています。各職人のプロフィールページで確認するか、メッセージで直接お問い合わせください。",
      },
      {
        question: "領収書は発行されますか？",
        answer:
          "はい、作業完了後にマイページから領収書をダウンロードできます。宛名の指定も可能です。",
      },
    ],
  },
  {
    category: "施工依頼・キャンセルについて",
    items: [
      {
        question: "依頼の変更はできますか？",
        answer:
          "作業日の2日前までは、マイページから依頼日時の変更が可能です。それ以降の変更は職人に直接メッセージでご相談ください。",
      },
      {
        question: "キャンセル料はかかりますか？",
        answer:
          "作業日の2日前までのキャンセルは無料です。前日キャンセルは料金の50%、当日キャンセルは100%のキャンセル料が発生する場合があります。詳細は各職人のプロフィールをご確認ください。",
      },
      {
        question: "依頼確定後に職人からキャンセルされることはありますか？",
        answer:
          "やむを得ない事情により職人側からキャンセルされる場合があります。その場合、他の職人をご紹介するか、全額返金いたします。",
      },
    ],
  },
  {
    category: "職人について",
    items: [
      {
        question: "職人はどのように審査されていますか？",
        answer:
          "すべての職人は、資格証明書の確認、身分証明書の確認、経歴の審査を経て登録されています。また、定期的にお客様からのフィードバックを確認し、品質管理を行っています。",
      },
      {
        question: "職人に直接連絡することはできますか？",
        answer:
          "依頼前でも、サイト内のメッセージ機能を使って職人に相談することができます。電話番号などの個人情報の直接交換はセキュリティ上お控えください。",
      },
      {
        question: "同じ職人に再度依頼したい場合は？",
        answer:
          "マイページの依頼履歴から、過去に依頼した職人のプロフィールにアクセスして再度依頼できます。お気に入り登録しておくと便利です。",
      },
    ],
  },
  {
    category: "トラブル・サポートについて",
    items: [
      {
        question: "作業に不満がある場合はどうすればよいですか？",
        answer:
          "まずは職人に直接ご相談ください。解決しない場合は、お問い合わせフォームからサポートチームにご連絡ください。状況を確認し、適切に対応いたします。",
      },
      {
        question: "作業後に問題が発生した場合は？",
        answer:
          "作業完了後30日以内であれば、職人による無償対応を依頼できる場合があります。まずは職人にメッセージでご連絡ください。",
      },
      {
        question: "サポートの受付時間は？",
        answer:
          "お問い合わせフォームは24時間受付しています。回答は営業日（平日10:00〜18:00）に順次行っております。緊急の場合はサポートダイヤルをご利用ください。",
      },
    ],
  },
];

function FAQAccordion({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        className="flex w-full items-center justify-between py-4 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-900">{item.question}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-gray-500 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all",
          isOpen ? "max-h-96 pb-4" : "max-h-0"
        )}
      >
        <p className="text-gray-600">{item.answer}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold sm:text-4xl">よくある質問</h1>
              <p className="mt-4 text-lg text-blue-100">
                お客様からよくいただくご質問をまとめました
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {faqData.map((category) => (
                <Card key={category.category}>
                  <CardContent className="p-6">
                    <h2 className="mb-4 text-xl font-bold text-gray-900">
                      {category.category}
                    </h2>
                    <div>
                      {category.items.map((item, index) => (
                        <FAQAccordion key={index} item={item} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact CTA */}
            <div className="mt-12 rounded-2xl bg-gray-50 p-8 text-center">
              <h2 className="text-xl font-bold text-gray-900">
                お探しの回答が見つかりませんか？
              </h2>
              <p className="mt-2 text-gray-600">
                お気軽にお問い合わせください。サポートチームが対応いたします。
              </p>
              <a
                href="/contact"
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
              >
                お問い合わせ
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
