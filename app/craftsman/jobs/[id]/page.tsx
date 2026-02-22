"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layouts/header";
import { Footer } from "@/components/layouts/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { getJob, updateJobStatus, getMessagesByJob, createMessage } from "@/lib/api";
import type { Job, JobStatus, Message } from "@/lib/types";
import { JOB_STATUS_COLORS } from "@/lib/types";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  Send,
  MessageCircle,
} from "lucide-react";

const CRAFTSMAN_STATUS_LABELS: Record<JobStatus, string> = {
  pending: "相談中",
  confirmed: "確定",
  rejected: "却下",
  completed: "完了",
  cancelled: "キャンセル",
};

interface ChatMessage {
  id: string;
  sender: "craftsman" | "customer";
  senderName: string;
  message: string;
  timestamp: Date;
  isDemo?: boolean;
}

const getDemoMessages = (): ChatMessage[] => [
  {
    id: "demo_1",
    sender: "customer",
    senderName: "お客様",
    message: "こんにちは。お見積もりの件でご相談したいのですが、お時間よろしいでしょうか？",
    timestamp: new Date(Date.now() - 3600000 * 2),
    isDemo: true,
  },
  {
    id: "demo_2",
    sender: "craftsman",
    senderName: "職人",
    message: "お問い合わせありがとうございます。はい、お見積もりについてご説明いたします。",
    timestamp: new Date(Date.now() - 3600000),
    isDemo: true,
  },
  {
    id: "demo_3",
    sender: "customer",
    senderName: "お客様",
    message: "ありがとうございます。作業時間はどのくらいかかりますか？",
    timestamp: new Date(Date.now() - 1800000),
    isDemo: true,
  },
];

const apiMessageToChatMessage = (msg: Message): ChatMessage => ({
  id: msg.id,
  sender: msg.sender,
  senderName: msg.sender_name,
  message: msg.message,
  timestamp: new Date(msg.created_at),
  isDemo: false,
});

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const jobId = params.id as string;

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user.role !== "craftsman") {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    if (user?.role === "craftsman" && jobId) {
      fetchJob();
      fetchMessages();
    }
  }, [user, jobId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchJob = async () => {
    setLoading(true);
    try {
      const data = await getJob(jobId);
      setJob(data);
    } catch (error) {
      console.error("Failed to fetch job:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const apiMessages = await getMessagesByJob(jobId);
      const chatMessages = apiMessages.map(apiMessageToChatMessage);
      const demoMessages = getDemoMessages();
      const allMessages = [...demoMessages, ...chatMessages].sort(
        (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
      );
      setMessages(allMessages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setMessages(getDemoMessages());
    }
  };

  const handleStatusUpdate = async (newStatus: JobStatus) => {
    if (!job) return;
    setUpdating(true);
    try {
      const updated = await updateJobStatus(job.id, newStatus);
      setJob(updated);
    } catch (error) {
      console.error("Failed to update job status:", error);
      alert("ステータスの更新に失敗しました");
    } finally {
      setUpdating(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const messageText = newMessage.trim();
    setNewMessage("");
    setSending(true);

    const tempMessage: ChatMessage = {
      id: `temp_${Date.now()}`,
      sender: "craftsman",
      senderName: user?.name || "職人",
      message: messageText,
      timestamp: new Date(),
      isDemo: false,
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const savedMessage = await createMessage({
        job_id: jobId,
        sender: "craftsman",
        sender_name: user?.name || "職人",
        message: messageText,
      });
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessage.id ? apiMessageToChatMessage(savedMessage) : msg
        )
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
      setNewMessage(messageText);
      alert("メッセージの送信に失敗しました");
    } finally {
      setSending(false);
    }
  };

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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user || user.role !== "craftsman") {
    return null;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">案件が見つかりません</p>
            <Link
              href="/craftsman/dashboard"
              className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-500"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              ダッシュボードに戻る
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/craftsman/dashboard"
            className="mb-6 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            案件一覧に戻る
          </Link>

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">案件詳細</h1>
              <p className="mt-1 text-gray-600">{job.service}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusBadgeColor(
                job.status
              )}`}
            >
              {CRAFTSMAN_STATUS_LABELS[job.status]}
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Job Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5" />
                    案件情報
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">希望日時</p>
                      <p className="font-medium">
                        {job.preferred_date} {job.preferred_time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">作業場所</p>
                      <p className="font-medium">{job.customer_address}</p>
                    </div>
                  </div>
                  {job.notes && (
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-sm text-gray-500">備考</p>
                      <p className="mt-1 text-gray-700">{job.notes}</p>
                    </div>
                  )}
                  <div className="text-sm text-gray-500">
                    依頼日: {new Date(job.created_at).toLocaleDateString("ja-JP")}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5" />
                    お客様情報
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">お名前</p>
                      <p className="font-medium">{job.customer_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">電話番号</p>
                      <p className="font-medium">{job.customer_phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">メールアドレス</p>
                      <p className="font-medium">{job.customer_email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              {job.status === "pending" && (
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={() => handleStatusUpdate("confirmed")}
                    disabled={updating}
                  >
                    {updating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    案件を確定する
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-red-600 hover:bg-red-50"
                    onClick={() => handleStatusUpdate("rejected")}
                    disabled={updating}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    却下する
                  </Button>
                </div>
              )}
              {job.status === "confirmed" && (
                <Button
                  className="w-full"
                  onClick={() => handleStatusUpdate("completed")}
                  disabled={updating}
                >
                  {updating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  作業完了にする
                </Button>
              )}
            </div>

            {/* Chat Section */}
            <Card className="flex h-[600px] flex-col">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageCircle className="h-5 w-5" />
                  お客様とのチャット
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.sender === "craftsman" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            msg.sender === "craftsman"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <p
                            className={`mt-1 text-xs ${
                              msg.sender === "craftsman"
                                ? "text-blue-200"
                                : "text-gray-500"
                            }`}
                          >
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                </div>

                {/* Input */}
                <form
                  onSubmit={handleSendMessage}
                  className="border-t p-4"
                >
                  <div className="flex gap-2">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="メッセージを入力..."
                      className="min-h-[44px] max-h-[120px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                    />
                    <Button type="submit" size="icon" disabled={!newMessage.trim() || sending}>
                      {sending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              ※ 最初の3件はデモ用メッセージです。送信したメッセージはAPIに保存されます。
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
