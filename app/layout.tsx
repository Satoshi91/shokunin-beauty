import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "職人Beauty - 信頼できる職人に簡単依頼",
  description:
    "エアコン取り付け、水回り修繕、電気工事など、信頼できる職人に簡単に依頼できるプラットフォーム",
  keywords: ["職人", "エアコン取り付け", "修繕", "リフォーム", "施工依頼"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
