"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layouts/header";
import { Footer } from "@/components/layouts/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import {
  User,
  Star,
  Settings,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Edit2,
  Check,
  X,
  FileText,
} from "lucide-react";

export default function MyPage() {
  const router = useRouter();
  const { user, updateProfile, updateName } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      setEditData({
        name: user.name,
        phone: user.profile?.phone || "",
        email: user.profile?.email || "",
        address: user.profile?.address || "",
      });
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleEdit = () => {
    setIsEditing(true);
    setSaved(false);
  };

  const handleCancel = () => {
    setEditData({
      name: user.name,
      phone: user.profile?.phone || "",
      email: user.profile?.email || "",
      address: user.profile?.address || "",
    });
    setIsEditing(false);
  };

  const handleSave = () => {
    if (editData.name !== user.name) {
      updateName(editData.name);
    }
    updateProfile({
      phone: editData.phone,
      email: editData.email,
      address: editData.address,
    });
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            トップに戻る
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">マイページ</h1>
            <p className="mt-1 text-gray-600">
              アカウント情報を管理できます
            </p>
          </div>

          {/* Profile Card */}
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                プロフィール
              </CardTitle>
              {!isEditing ? (
                <Button variant="ghost" size="sm" onClick={handleEdit}>
                  <Edit2 className="mr-1 h-4 w-4" />
                  編集
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleCancel}>
                    <X className="mr-1 h-4 w-4" />
                    キャンセル
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Check className="mr-1 h-4 w-4" />
                    保存
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {saved && (
                <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                  プロフィールを保存しました
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex-1 space-y-4">
                  {isEditing ? (
                    <>
                      <Input
                        label="お名前"
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                      />
                      <Input
                        label="電話番号"
                        type="tel"
                        placeholder="090-1234-5678"
                        value={editData.phone}
                        onChange={(e) =>
                          setEditData({ ...editData, phone: e.target.value })
                        }
                      />
                      <Input
                        label="メールアドレス"
                        type="email"
                        placeholder="example@email.com"
                        value={editData.email}
                        onChange={(e) =>
                          setEditData({ ...editData, email: e.target.value })
                        }
                      />
                      <Textarea
                        label="住所"
                        placeholder="東京都渋谷区..."
                        rows={2}
                        value={editData.address}
                        onChange={(e) =>
                          setEditData({ ...editData, address: e.target.value })
                        }
                      />
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-lg font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-500">
                          {user.role === "craftsman"
                            ? "職人アカウント"
                            : "依頼者アカウント"}
                        </p>
                      </div>
                      <div className="space-y-2 border-t pt-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {user.profile?.phone || (
                              <span className="text-gray-400">未登録</span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {user.profile?.email || (
                              <span className="text-gray-400">未登録</span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {user.profile?.address || (
                              <span className="text-gray-400">未登録</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Link href="/customer/dashboard">
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">ダッシュボード</p>
                    <p className="text-sm text-gray-500">依頼一覧を見る</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium">お気に入り</p>
                  <p className="text-sm text-gray-500">保存した職人</p>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                  <Settings className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">設定</p>
                  <p className="text-sm text-gray-500">アカウント設定</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              ※ これはデモ用のマイページです。正式なデータとしては使用されません。自由にお試しください。
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
