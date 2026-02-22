"use client";

import { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
} from "date-fns";
import { ja } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Job, JobStatus } from "@/lib/types";
import { JOB_STATUS_COLORS } from "@/lib/types";

interface JobCalendarProps {
  jobs: Job[];
  onDateClick?: (date: Date, jobs: Job[]) => void;
  onJobClick?: (job: Job) => void;
}

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

const STATUS_DOT_COLORS: Record<JobStatus, string> = {
  pending: "bg-yellow-400",
  confirmed: "bg-green-400",
  rejected: "bg-red-400",
  completed: "bg-blue-400",
  cancelled: "bg-gray-400",
};

export function JobCalendar({ jobs, onDateClick, onJobClick }: JobCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const jobsByDate = useMemo(() => {
    const map = new Map<string, Job[]>();
    jobs.forEach((job) => {
      const dateKey = job.preferred_date;
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(job);
    });
    return map;
  }, [jobs]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleToday = () => setCurrentMonth(new Date());

  const handleDateClick = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const dayJobs = jobsByDate.get(dateKey) || [];
    setSelectedDate(date);
    onDateClick?.(date, dayJobs);
  };

  const getJobsForDate = (date: Date): Job[] => {
    const dateKey = format(date, "yyyy-MM-dd");
    return jobsByDate.get(dateKey) || [];
  };

  const selectedDateJobs = selectedDate
    ? getJobsForDate(selectedDate)
    : [];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">案件カレンダー</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleToday}>
              今日
            </Button>
            <Button variant="outline" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-[120px] text-center font-medium">
              {format(currentMonth, "yyyy年M月", { locale: ja })}
            </span>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-px rounded-lg bg-gray-200 overflow-hidden">
          {WEEKDAYS.map((day, index) => (
            <div
              key={day}
              className={`bg-gray-50 py-2 text-center text-sm font-medium ${
                index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : "text-gray-700"
              }`}
            >
              {day}
            </div>
          ))}
          {calendarDays.map((day, index) => {
            const dayJobs = getJobsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, new Date());
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const dayOfWeek = day.getDay();

            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDateClick(day)}
                className={`
                  relative min-h-[80px] bg-white p-1 text-left transition-colors hover:bg-gray-50
                  ${!isCurrentMonth ? "text-gray-300" : ""}
                  ${isSelected ? "ring-2 ring-blue-500 ring-inset" : ""}
                `}
              >
                <span
                  className={`
                    inline-flex h-6 w-6 items-center justify-center rounded-full text-sm
                    ${isToday ? "bg-blue-600 text-white" : ""}
                    ${!isToday && isCurrentMonth && dayOfWeek === 0 ? "text-red-500" : ""}
                    ${!isToday && isCurrentMonth && dayOfWeek === 6 ? "text-blue-500" : ""}
                  `}
                >
                  {format(day, "d")}
                </span>
                {dayJobs.length > 0 && (
                  <div className="mt-1 space-y-0.5">
                    {dayJobs.slice(0, 3).map((job) => (
                      <div
                        key={job.id}
                        className={`
                          truncate rounded px-1 py-0.5 text-xs
                          ${job.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
                          ${job.status === "confirmed" ? "bg-green-100 text-green-800" : ""}
                          ${job.status === "completed" ? "bg-blue-100 text-blue-800" : ""}
                          ${job.status === "rejected" ? "bg-red-100 text-red-800" : ""}
                          ${job.status === "cancelled" ? "bg-gray-100 text-gray-600" : ""}
                        `}
                      >
                        {job.service}
                      </div>
                    ))}
                    {dayJobs.length > 3 && (
                      <div className="px-1 text-xs text-gray-500">
                        +{dayJobs.length - 3}件
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* 凡例 */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded bg-yellow-100 border border-yellow-300"></span>
            <span>相談中</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded bg-green-100 border border-green-300"></span>
            <span>確定</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-3 rounded bg-blue-100 border border-blue-300"></span>
            <span>完了</span>
          </div>
        </div>

        {/* 選択した日の案件詳細 */}
        {selectedDate && (
          <div className="mt-4 rounded-lg border bg-gray-50 p-4">
            <h4 className="mb-2 font-medium">
              {format(selectedDate, "M月d日(E)", { locale: ja })}の案件
            </h4>
            {selectedDateJobs.length === 0 ? (
              <p className="text-sm text-gray-500">この日の案件はありません</p>
            ) : (
              <div className="space-y-2">
                {selectedDateJobs.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => onJobClick?.(job)}
                    className="w-full rounded-md bg-white p-3 shadow-sm text-left transition-colors hover:bg-gray-50 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{job.service}</span>
                      <span
                        className={`
                          rounded-full px-2 py-0.5 text-xs
                          ${job.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
                          ${job.status === "confirmed" ? "bg-green-100 text-green-800" : ""}
                          ${job.status === "completed" ? "bg-blue-100 text-blue-800" : ""}
                          ${job.status === "rejected" ? "bg-red-100 text-red-800" : ""}
                          ${job.status === "cancelled" ? "bg-gray-100 text-gray-600" : ""}
                        `}
                      >
                        {job.status === "pending" ? "相談中" : ""}
                        {job.status === "confirmed" ? "確定" : ""}
                        {job.status === "completed" ? "完了" : ""}
                        {job.status === "rejected" ? "却下" : ""}
                        {job.status === "cancelled" ? "キャンセル" : ""}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      <span>{job.preferred_time}</span>
                      <span className="mx-2">|</span>
                      <span>{job.customer_name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
