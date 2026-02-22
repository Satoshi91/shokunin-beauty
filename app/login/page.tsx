"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layouts/header";
import { Footer } from "@/components/layouts/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth, DEMO_CRAFTSMEN, DEMO_CUSTOMERS } from "@/lib/auth";
import { User, Wrench } from "lucide-react";

type LoginMode = "customer" | "craftsman";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<LoginMode>("customer");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("アカウント名を入力してください");
      return;
    }

    login(name.trim(), mode);
    router.push(mode === "craftsman" ? "/craftsman/dashboard" : "/customer/dashboard");
  };

  const handleDemoCraftsmanLogin = (demoCraftsman: typeof DEMO_CRAFTSMEN[0]) => {
    login(demoCraftsman.name, "craftsman", demoCraftsman.craftsmanId);
    router.push("/craftsman/dashboard");
  };

  const handleDemoCustomerLogin = (demoCustomer: typeof DEMO_CUSTOMERS[0]) => {
    login(demoCustomer.name, "customer", demoCustomer.id);
    router.push("/customer/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">ログイン</CardTitle>
            <p className="mt-2 text-sm text-gray-500">
              アカウント名を入力してログイン（デモ用）
            </p>
          </CardHeader>
          <CardContent>
            {/* Login Mode Selector */}
            <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setMode("customer")}
                className={`flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  mode === "customer"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <User className="h-4 w-4" />
                お客様
              </button>
              <button
                type="button"
                onClick={() => setMode("craftsman")}
                className={`flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  mode === "craftsman"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Wrench className="h-4 w-4" />
                職人
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="アカウント名"
                placeholder={mode === "customer" ? "例: 田中太郎" : "例: 山田電設"}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                error={error}
              />
              
              <Button type="submit" className="w-full">
                {mode === "customer" ? "お客様としてログイン" : "職人としてログイン"}
              </Button>
            </form>

            {/* Demo Customer Quick Login */}
            {mode === "customer" && (
              <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="mb-3 text-sm font-medium text-blue-800">
                  デモ用お客様アカウント
                </p>
                <div className="space-y-2">
                  {DEMO_CUSTOMERS.map((demoCustomer) => (
                    <button
                      key={demoCustomer.id}
                      type="button"
                      onClick={() => handleDemoCustomerLogin(demoCustomer)}
                      className="flex w-full items-center justify-between rounded-md border border-blue-300 bg-white px-3 py-2 text-left transition-colors hover:bg-blue-100"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{demoCustomer.name}</p>
                        <p className="text-xs text-gray-500">{demoCustomer.description}</p>
                      </div>
                      <span className="text-xs text-blue-600">ログイン →</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Demo Craftsman Quick Login */}
            {mode === "craftsman" && (
              <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="mb-3 text-sm font-medium text-amber-800">
                  デモ用職人アカウント
                </p>
                <div className="space-y-2">
                  {DEMO_CRAFTSMEN.map((demoCraftsman) => (
                    <button
                      key={demoCraftsman.id}
                      type="button"
                      onClick={() => handleDemoCraftsmanLogin(demoCraftsman)}
                      className="flex w-full items-center justify-between rounded-md border border-amber-300 bg-white px-3 py-2 text-left transition-colors hover:bg-amber-100"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{demoCraftsman.name}</p>
                        <p className="text-xs text-gray-500">{demoCraftsman.description}</p>
                      </div>
                      <span className="text-xs text-amber-600">ログイン →</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                アカウントをお持ちでない方は
              </p>
              <Link
                href="/signup"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                会員登録へ
              </Link>
            </div>

            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <p className="text-xs text-blue-800">
                ※ これはデモ用のログインです。正式なデータとしては使用されません。自由にお試しください。
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
