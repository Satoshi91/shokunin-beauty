"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layouts/header";
import { Footer } from "@/components/layouts/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { getJobsByCustomer, updateJobStatus } from "@/lib/api";
import type { Job, JobStatus } from "@/lib/types";
import { JOB_STATUS_LABELS, JOB_STATUS_COLORS } from "@/lib/types";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  MapPin,
  Loader2,
  RefreshCw,
  FileText,
  CalendarDays,
  List,
  Wrench,
} from "lucide-react";
import { JobCalendar } from "@/components/calendar/job-calendar";

type TabStatus = "all" | "pending" | "confirmed" | "completed";
type ViewMode = "list" | "calendar";

export default function CustomerDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabStatus>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user.role !== "customer") {
      router.push("/craftsman/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    if (user?.role === "customer") {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getJobsByCustomer(user.id);
      setJobs(data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelJob = async (jobId: string) => {
    setCancelling(jobId);
    try {
      const updated = await updateJobStatus(jobId, "cancelled");
      setJobs((prev) =>
        prev.map((job) => (job.id === jobId ? updated : job))
      );
    } catch (error) {
      console.error("Failed to cancel job:", error);
      alert("キャンセルに失敗しました");
    } finally {
      setCancelling(null);
    }
  };

  if (!user || user.role !== "customer") {
    return null;
  }

  const filteredJobs =
    activeTab === "all"
      ? jobs
      : jobs.filter((job) => job.status === activeTab);

  const pendingCount = jobs.filter((j) => j.status === "pending").length;
  const confirmedCount = jobs.filter((j) => j.status === "confirmed").length;
  const completedCount = jobs.filter((j) => j.status === "completed").length;

  const getStatusBadgeColor = (status: JobStatus) => {
    const colors = JOB_STATUS_COLORS[status];
    switch (colors) {
      case "yellow":
        return "bg-yellow-100 text-yellow-800";
      case "green":
        return "bg-green-100 text-green-800";
      case "red":
        return "bg-red-100 text-red-800";
      case "blue":
        return "bg-blue-100 text-blue-800";
      case "gray":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const tabs: { key: TabStatus; label: string; count?: number }[] = [
    { key: "all", label: "すべて", count: jobs.length },
    { key: "pending", label: "申請中", count: pendingCount },
    { key: "confirmed", label: "確定", count: confirmedCount },
    { key: "completed", label: "完了", count: completedCount },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            トップに戻る
          </Link>

          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                依頼一覧
              </h1>
              <p className="mt-1 text-gray-600">
                ようこそ、{user.name}さん
              </p>
            </div>
            <Button variant="outline" onClick={fetchJobs} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              更新
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{jobs.length}</p>
                  <p className="text-sm text-gray-500">総依頼数</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-sm text-gray-500">申請中</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{confirmedCount}</p>
                  <p className="text-sm text-gray-500">確定</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedCount}</p>
                  <p className="text-sm text-gray-500">完了</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* View Toggle */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex gap-2 overflow-x-auto border-b">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        activeTab === tab.key
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-1 rounded-lg border bg-gray-100 p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List className="h-4 w-4" />
                リスト
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  viewMode === "calendar"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <CalendarDays className="h-4 w-4" />
                カレンダー
              </button>
            </div>
          </div>

          {/* Calendar View */}
          {viewMode === "calendar" && (
            <div className="mb-8">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <JobCalendar
                  jobs={activeTab === "all" ? jobs : filteredJobs}
                />
              )}
            </div>
          )}

          {/* Jobs List */}
          {viewMode === "list" && (
            <>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : filteredJobs.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-4 text-gray-500">
                      {activeTab === "all"
                        ? "まだ依頼がありません"
                        : `${tabs.find((t) => t.key === activeTab)?.label}の依頼はありません`}
                    </p>
                    {activeTab === "all" && (
                      <Link href="/craftsmen">
                        <Button className="mt-4">職人を探す</Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <Link key={job.id} href={`/customer/jobs/${job.id}`}>
                      <Card className="transition-shadow hover:shadow-md cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex-1">
                              <div className="mb-2 flex items-center gap-2">
                                <span
                                  className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeColor(
                                    job.status
                                  )}`}
                                >
                                  {JOB_STATUS_LABELS[job.status]}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {new Date(job.created_at).toLocaleDateString("ja-JP")}
                                </span>
                              </div>
                              <h3 className="mb-1 text-lg font-semibold">
                                {job.service}
                              </h3>
                              <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Wrench className="h-4 w-4 text-gray-400" />
                                  <span>{job.craftsman_name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                  <span>
                                    {job.preferred_date} {job.preferred_time}
                                  </span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
                                  <span>{job.customer_address}</span>
                                </div>
                                {job.notes && (
                                  <div className="mt-2 rounded bg-gray-50 p-2 text-gray-600">
                                    <span className="font-medium">備考:</span>{" "}
                                    {job.notes}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            {job.status === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleCancelJob(job.id);
                                }}
                                disabled={cancelling === job.id}
                                className="text-red-600 hover:bg-red-50"
                              >
                                {cancelling === job.id ? (
                                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                ) : (
                                  <XCircle className="mr-1 h-4 w-4" />
                                )}
                                キャンセル
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          <div className="mt-8 rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              ※ これはデモ用のダッシュボードです。正式なデータとしては使用されません。自由にお試しください。
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
