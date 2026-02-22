"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layouts/header";
import { Footer } from "@/components/layouts/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { User, Wrench } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  
  const initialRole = searchParams.get("role") === "craftsman" ? "craftsman" : "customer";
  
  const [name, setName] = useState("");
  const [role, setRole] = useState<"customer" | "craftsman">(initialRole);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("アカウント名を入力してください");
      return;
    }

    login(name.trim(), role);
    
    if (role === "craftsman") {
      router.push("/craftsman/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">会員登録</CardTitle>
            <p className="mt-2 text-sm text-gray-500">
              アカウント名を入力して登録（デモ用）
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  登録タイプ
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("customer")}
                    className={`flex flex-col items-center rounded-lg border-2 p-4 transition-colors ${
                      role === "customer"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <User
                      className={`h-8 w-8 ${
                        role === "customer" ? "text-blue-600" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`mt-2 text-sm font-medium ${
                        role === "customer" ? "text-blue-600" : "text-gray-700"
                      }`}
                    >
                      依頼者
                    </span>
                    <span className="mt-1 text-xs text-gray-500">
                      職人に依頼する
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("craftsman")}
                    className={`flex flex-col items-center rounded-lg border-2 p-4 transition-colors ${
                      role === "craftsman"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Wrench
                      className={`h-8 w-8 ${
                        role === "craftsman" ? "text-blue-600" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`mt-2 text-sm font-medium ${
                        role === "craftsman" ? "text-blue-600" : "text-gray-700"
                      }`}
                    >
                      職人
                    </span>
                    <span className="mt-1 text-xs text-gray-500">
                      仕事を受ける
                    </span>
                  </button>
                </div>
              </div>

              <Input
                label="アカウント名"
                placeholder="例: 田中太郎"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                error={error}
              />
              
              <Button type="submit" className="w-full">
                登録する
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                すでにアカウントをお持ちの方は
              </p>
              <Link
                href="/login"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                ログインへ
              </Link>
            </div>

            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <p className="text-xs text-blue-800">
                ※ これはデモ用の登録です。正式なデータとしては使用されません。自由にお試しください。
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
