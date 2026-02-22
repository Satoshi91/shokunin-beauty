# 職人Beauty

**信頼できる職人に、簡単に依頼できる** マッチングプラットフォーム

エアコン取り付け、水回り修繕、電気工事など、厳選された職人にオンラインで簡単に依頼できるサービスです。

## 概要

職人Beautyは、住宅の修繕・設備工事を依頼したい**お客様**と、技術を持つ**職人**をつなぐWebプラットフォームです。

### 主な機能

- **職人検索** - エリア・サービス種別で最適な職人を検索
- **職人プロフィール** - 経歴・資格・料金・レビューを確認
- **予約システム** - カレンダーから空き状況を確認して予約
- **レビュー** - 施工後の評価で品質を担保

### 対応サービス

| カテゴリ | 内容 |
|---------|------|
| エアコン | 取り付け・取り外し・クリーニング |
| 水回り | 水漏れ修理・トイレ・排水管 |
| 電気 | コンセント・照明・ブレーカー |
| 内装 | 壁紙・フローリング・網戸 |

## 技術スタック

| 技術 | バージョン | 用途 |
|------|-----------|------|
| Next.js | 16 | フレームワーク（App Router） |
| React | 19 | UIライブラリ |
| TypeScript | 5 | 型安全な開発 |
| Tailwind CSS | 4 | スタイリング |
| Zustand | 5 | 状態管理 |
| Lucide React | - | アイコン |
| React Hook Form + Zod | - | フォーム・バリデーション |

## 開始方法

### 前提条件

- Node.js 20以上
- npm / yarn / pnpm / bun

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd shokunin-beauty

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.local.example .env.local
# .env.local を編集して必要な値を設定

# 開発サーバーを起動
npm run dev
```

[http://localhost:3000](http://localhost:3000) でアプリケーションが起動します。

## ディレクトリ構成

```
app/
├── page.tsx                    # トップページ
├── layout.tsx                  # ルートレイアウト
├── login/                      # ログイン
├── signup/                     # 会員登録
├── craftsmen/                  # 職人一覧・検索
│   └── [id]/                   # 職人詳細
│       └── book/               # 予約フォーム
│           └── complete/       # 予約完了
├── customer/                   # 依頼者向け機能
│   ├── dashboard/              # マイページ
│   └── jobs/[id]/              # 依頼詳細
├── craftsman/                  # 職人向け機能
│   ├── dashboard/              # ダッシュボード
│   ├── profile/                # プロフィール編集
│   ├── jobs/[id]/              # 案件詳細
│   └── guide/                  # 職人ガイド
├── guide/                      # 利用ガイド
├── faq/                        # よくある質問
└── contact/                    # お問い合わせ

components/
├── ui/                         # 基本UIコンポーネント
└── layouts/                    # レイアウト（Header, Footer）

lib/
├── api.ts                      # データ取得
├── auth.ts                     # 認証状態管理
├── types.ts                    # 型定義
└── utils.ts                    # ユーティリティ
```

## スクリプト

```bash
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run start    # プロダクションサーバー起動
npm run lint     # ESLintチェック
```

## デモ版について

現在はデモ・プロトタイプ版として開発中です。

- モックデータを使用（実際のデータベース接続なし）
- 簡易認証（デモ用）
- 予約は画面表示のみ（実際の保存なし）

詳細は [doc/roadmap.md](./doc/roadmap.md) を参照してください。

## ライセンス

Private
