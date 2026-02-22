import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layouts/header";
import { Footer } from "@/components/layouts/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { getCraftsman, getReviews } from "@/lib/api";
import { formatPriceRange, formatDate } from "@/lib/utils";
import {
  MapPin,
  Clock,
  Award,
  Calendar,
  ArrowLeft,
  User,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CraftsmanDetailPage({ params }: PageProps) {
  const { id } = await params;

  let craftsman;
  let reviews;

  try {
    [craftsman, reviews] = await Promise.all([
      getCraftsman(id),
      getReviews(id),
    ]);
  } catch {
    notFound();
  }

  if (!craftsman) {
    notFound();
  }

  const qualifications = craftsman.qualifications
    ? craftsman.qualifications.split(",").map((q) => q.trim())
    : [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href="/craftsmen"
            className="mb-6 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            職人一覧に戻る
          </Link>

          {/* Profile Header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 sm:flex-row">
                <Avatar
                  src={craftsman.profile_image_url}
                  alt={craftsman.display_name}
                  size="xl"
                  className="mx-auto sm:mx-0"
                />
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-start">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {craftsman.display_name}
                    </h1>
                    <Badge variant="secondary">{craftsman.category}</Badge>
                  </div>

                  <div className="mt-2">
                    <Rating
                      value={craftsman.rating_avg}
                      reviewCount={craftsman.review_count}
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap justify-center gap-4 text-sm text-gray-600 sm:justify-start">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {craftsman.prefecture} {craftsman.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      経験{craftsman.experience_years}年
                    </span>
                  </div>

                  <div className="mt-4">
                    <Link href={`/craftsmen/${id}/book`}>
                      <Button size="lg" className="w-full sm:w-auto">
                        <Calendar className="mr-2 h-4 w-4" />
                        予約する
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>自己紹介</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-gray-700">
                    {craftsman.description}
                  </p>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle>レビュー ({reviews.length}件)</CardTitle>
                </CardHeader>
                <CardContent>
                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                                <User className="h-4 w-4 text-gray-500" />
                              </div>
                              <span className="font-medium text-gray-900">
                                {review.customer_name}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDate(review.created_at)}
                            </span>
                          </div>
                          <div className="mt-2">
                            <Rating value={review.rating} showValue={false} />
                          </div>
                          <p className="mt-2 text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">まだレビューはありません</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Price */}
              <Card>
                <CardHeader>
                  <CardTitle>料金目安</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPriceRange(craftsman.price_min, craftsman.price_max)}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    ※ 作業内容により変動します
                  </p>
                </CardContent>
              </Card>

              {/* Qualifications */}
              {qualifications.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      保有資格
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {qualifications.map((qual, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                          {qual}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* CTA */}
              <Card className="bg-blue-50 border-blue-100">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-blue-800">
                    この職人に依頼しますか？
                  </p>
                  <Link href={`/craftsmen/${id}/book`}>
                    <Button className="mt-3 w-full">予約に進む</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
