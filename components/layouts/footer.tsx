import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Wrench } from "lucide-react";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const navigation = {
    services: [
      { name: "エアコン取り付け", href: "/services/aircon" },
      { name: "水回り修繕", href: "/services/plumbing" },
      { name: "電気工事", href: "/services/electrical" },
      { name: "内装工事", href: "/services/interior" },
    ],
    support: [
      { name: "ご利用ガイド", href: "/guide" },
      { name: "よくある質問", href: "/faq" },
      { name: "お問い合わせ", href: "/contact" },
    ],
    company: [
      { name: "運営会社", href: "/company" },
      { name: "利用規約", href: "/terms" },
      { name: "プライバシーポリシー", href: "/privacy" },
      { name: "特定商取引法に基づく表記", href: "/legal" },
    ],
    craftsman: [
      { name: "職人として登録", href: "/signup?role=craftsman" },
      { name: "職人向けガイド", href: "/craftsman/guide" },
    ],
  };

  return (
    <footer className={cn("border-t border-gray-200 bg-gray-50", className)}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Logo & Description */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">職人Beauty</span>
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              信頼できる職人に、
              <br />
              簡単に依頼できる
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">サービス</h3>
            <ul className="mt-4 space-y-3">
              {navigation.services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">サポート</h3>
            <ul className="mt-4 space-y-3">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">会社情報</h3>
            <ul className="mt-4 space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Craftsman */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900">職人の方へ</h3>
            <ul className="mt-4 space-y-3">
              {navigation.craftsman.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} 職人Beauty. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
