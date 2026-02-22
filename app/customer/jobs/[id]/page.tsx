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
import { JOB_STATUS_LABELS, JOB_STATUS_COLORS } from "@/lib/types";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  FileText,
  XCircle,
  Loader2,
  Send,
  MessageCircle,
  Wrench,
  Star,
} from "lucide-react";

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
    sender: "craftsman",
    senderName: "職人",
    message: "お問い合わせありがとうございます。ご依頼の件、承りました。",
    timestamp: new Date(Date.now() - 3600000 * 2),
    isDemo: true,
  },
  {
    id: "demo_2",
    sender: "customer",
    senderName: "お客様",
    message: "よろしくお願いします。当日の作業時間はどのくらいかかりますか？",
    timestamp: new Date(Date.now() - 3600000),
    isDemo: true,
  },
  {
    id: "demo_3",
    sender: "craftsman",
    senderName: "職人",
    message: "通常1〜2時間程度です。作業前に詳しくご説明いたします。",
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

export default function CustomerJobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const jobId = params.id as string;

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user.role !== "customer") {
      router.push("/craftsman/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    if (user?.role === "customer" && jobId) {
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

  const handleCancelJob = async () => {
    if (!job || job.status !== "pending") return;
    if (!confirm("この依頼をキャンセルしますか？")) return;

    setCancelling(true);
    try {
      const updated = await updateJobStatus(job.id, "cancelled");
      setJob(updated);
    } catch (error) {
      console.error("Failed to cancel job:", error);
      alert("キャンセルに失敗しました");
    } finally {
      setCancelling(false);
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
      sender: "customer",
      senderName: user?.name || "お客様",
      message: messageText,
      timestamp: new Date(),
      isDemo: false,
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const savedMessage = await createMessage({
        job_id: jobId,
        sender: "customer",
        sender_name: user?.name || "お客様",
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

  if (!user || user.role !== "customer") {
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
            <p className="mt-4 text-gray-500">依頼が見つかりません</p>
            <Link
              href="/customer/dashboard"
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
            href="/customer/dashboard"
            className="mb-6 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            依頼一覧に戻る
          </Link>

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">依頼詳細</h1>
              <p className="mt-1 text-gray-600">{job.service}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusBadgeColor(
                job.status
              )}`}
            >
              {JOB_STATUS_LABELS[job.status]}
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Job Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5" />
                    依頼内容
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
                    <Wrench className="h-5 w-5" />
                    担当職人
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">職人名</p>
                      <p className="font-medium">{job.craftsman_name}</p>
                    </div>
                  </div>
                  <Link
                    href={`/craftsmen/${job.craftsman_id}`}
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-500"
                  >
                    <Star className="h-4 w-4" />
                    職人のプロフィールを見る
                  </Link>
                </CardContent>
              </Card>

              {/* Cancel Button */}
              {job.status === "pending" && (
                <Button
                  variant="outline"
                  className="w-full text-red-600 hover:bg-red-50"
                  onClick={handleCancelJob}
                  disabled={cancelling}
                >
                  {cancelling ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="mr-2 h-4 w-4" />
                  )}
                  依頼をキャンセルする
                </Button>
              )}

              {job.status === "confirmed" && (
                <div className="rounded-lg bg-green-50 p-4">
                  <p className="text-sm text-green-800">
                    この依頼は職人によって確定されました。当日をお待ちください。
                  </p>
                </div>
              )}

              {job.status === "completed" && (
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-blue-800">
                    この依頼は完了しました。ご利用ありがとうございました。
                  </p>
                </div>
              )}

              {job.status === "rejected" && (
                <div className="rounded-lg bg-red-50 p-4">
                  <p className="text-sm text-red-800">
                    この依頼は職人によってお断りされました。別の職人をお探しください。
                  </p>
                </div>
              )}

              {job.status === "cancelled" && (
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-800">
                    この依頼はキャンセルされました。
                  </p>
                </div>
              )}
            </div>

            {/* Chat Section */}
            <Card className="flex h-[600px] flex-col">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageCircle className="h-5 w-5" />
                  職人とのチャット
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
                          msg.sender === "customer" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            msg.sender === "customer"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <p
                            className={`mt-1 text-xs ${
                              msg.sender === "customer"
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
