"use client";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PlaceIcon from "@mui/icons-material/Place";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BackpackIcon from "@mui/icons-material/Backpack";
import Slideshow from "@/components/Slideshow";
import { Timestamp } from "firebase/firestore";
import LogoImage from "@/components/fruitshatake/logoImage";
import EventRegistrationForm from "@/components/fruitshatake/EventRegistrationForm";
import Image from "next/image";

export type Event = {
  id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  images?: string[];
  flyerImage?: string; // チラシ画像専用
  simpleMode?: boolean; // チラシ画像のみ表示するかどうか
  notes?: string[];
  date?: Timestamp;
  place?: string;
  timeRange?: string;
  adultFee?: number;
  childFee?: number;
  feeNotes?: string[];
  providedItems?: string[];
  takeItems?: string[];
};

interface EventDetailProps {
  event: Event | null;
  eventId?: string;
  showLogo?: boolean;
  showRegistrationForm?: boolean;
  simpleMode?: boolean; // チラシ画像のみを表示するモード
}

export default function EventDetail({
  event,
  eventId,
  showLogo = true,
  showRegistrationForm = true,
  simpleMode = false,
}: EventDetailProps) {
  // イベントデータのsimpleModeフラグを優先、なければpropsのsimpleModeを使用
  const isSimpleMode = event?.simpleMode ?? simpleMode;

  // シンプルモード: チラシ画像と申し込みフォームのみ表示
  if (isSimpleMode && event?.flyerImage) {
    return (
      <div className="m-4">
        {showLogo && (
          <div className="container mx-auto px-4">
            <LogoImage />
          </div>
        )}

        {/* チラシ画像 */}
        <div className="max-w-4xl mx-auto mb-8 relative">
          <Image
            src={event.flyerImage}
            alt={event.title || "イベントチラシ"}
            width={800}
            height={600}
            className="w-full h-auto rounded-lg shadow-lg"
            priority
          />
        </div>

        {/* イベント参加申し込みフォーム */}
        {showRegistrationForm && eventId && (
          <div className="max-w-4xl mx-auto mb-8">
            <EventRegistrationForm
              eventId={eventId}
              eventTitle={event?.title}
            />
          </div>
        )}
      </div>
    );
  }

  // 通常モード: 詳細情報を全て表示
  return (
    <div className="m-4">
      {showLogo && (
        <div className="container mx-auto px-4">
          <LogoImage />
        </div>
      )}
      <div className="bg-green-50 rounded-lg border-2 border-green-200 shadow-md p-5 mb-4">
        <h2 className="text-2xl font-bold text-green-800 mb-2 text-center">
          {event?.title}
        </h2>
        <p className="text-lg text-center mt-2">- {event?.subtitle} -</p>
        <pre className="text-gray-700 text-base my-4 whitespace-pre-wrap">
          {event?.description}
        </pre>
      </div>
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-3xl">
          <div className="relative">
            <Slideshow images={event?.images || []} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8 mx-8">
        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-2xl font-bold text-green-700 mb-4 flex items-center">
            <CalendarMonthIcon className="mr-2" />
            開催日時
          </h3>
          <div className="space-y-2 text-gray-700">
            <p className="text-xl font-semibold">
              {event?.date
                ? event.date.toDate().toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    weekday: "short",
                  })
                : "日程未定"}
            </p>
            <p className="text-lg">{event?.timeRange}</p>
            {event?.notes && (
              <ul className="list-disc pl-4 space-y-2">
                {event.notes.map((note, index) => (
                  <li key={index} className="text-lg list-outside list-none">
                    <p className="text-sm text-gray-600">{note}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-2xl font-bold text-green-700 mb-4 flex items-center">
            <PlaceIcon className="mr-2" />
            開催場所
          </h3>
          <div className="space-y-2 text-gray-700">
            <p className="text-xl font-semibold">{event?.place}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg p-8 mb-8">
        <h3 className="text-2xl font-bold text-green-700 mb-6 text-center flex items-center justify-center">
          参加料金
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {!event?.adultFee && !event?.childFee && (
            <div className="bg-orange-50 rounded-lg p-6 text-center border-2 border-red-200">
              <p className="text-2xl font-bold text-red-700">
                {event?.adultFee ? `${event.adultFee}円` : "無料"}
              </p>
            </div>
          )}
          {event?.childFee && (
            <div className="bg-orange-50 rounded-lg p-6 text-center border-2 border-orange-200">
              <div className="text-4xl mb-2 flex justify-center">
                <FamilyRestroomIcon fontSize="large" />
              </div>
              <h4 className="text-2xl font-bold text-orange-600 mb-2">大人</h4>
              <p className="text-3xl font-bold text-orange-700">
                {event?.adultFee}円
              </p>
            </div>
          )}
          {event?.childFee && (
            <div className="bg-green-50 rounded-lg p-6 text-center border-2 border-green-200">
              <div className="text-4xl mb-2 flex justify-center">
                <ChildCareIcon fontSize="large" />
              </div>
              <h4 className="text-2xl font-bold text-green-600 mb-2">
                小学生以下
              </h4>
              <p className="text-3xl font-bold text-green-700">
                {event?.childFee}円
              </p>
            </div>
          )}
        </div>
        {event?.feeNotes && (
          <ul className="list-disc pl-4 space-y-2 mt-4">
            {event.feeNotes.map((note, index) => (
              <li key={index} className="text-lg list-outside list-none">
                <p className="text-base text-gray-600">{note}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg p-8 mb-8">
        <h3 className="text-2xl font-bold text-green-700 mb-6 text-center flex items-center justify-center">
          当日のご用意
        </h3>

        <div className="grid md:grid-cols-1 gap-8">
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-green-600 border-b-2 border-green-200 pb-2 flex items-center">
              <CheckCircleIcon className="mr-2" />
              運営側で用意するもの
            </h4>
            {event?.providedItems && (
              <ul className="space-y-2 text-gray-700">
                {event.providedItems.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircleIcon
                      className="text-green-500 mr-3"
                      fontSize="small"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {event?.takeItems && (
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-orange-600 border-b-2 border-orange-200 pb-2 flex items-center">
                <BackpackIcon className="mr-2" />
                持ち込み自由
              </h4>
              <ul className="space-y-2 text-gray-700">
                {event.takeItems.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <BackpackIcon
                      className="text-orange-500 mr-3"
                      fontSize="small"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="bg-yellow-50 rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-yellow-700 mb-2 flex items-center">
          ゴミのお持ち帰りのお願い
        </h3>
        <pre className="text-gray-700 whitespace-pre-wrap">
          {`イベント終了後は、各自でゴミのお持ち帰りにご協力をお願いいたします。
皆様が気持ちよくご利用いただけるよう、ご理解とご協力をお願いいたします。`}
        </pre>
      </div>

      {/* イベント参加申し込みフォーム */}
      {showRegistrationForm && eventId && (
        <div className="mb-8">
          <EventRegistrationForm eventId={eventId} eventTitle={event?.title} />
        </div>
      )}
    </div>
  );
}
