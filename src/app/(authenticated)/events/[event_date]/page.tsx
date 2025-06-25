"use client";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from 'react';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
import Image from "next/image";
import LocalPizzaIcon from "@mui/icons-material/LocalPizza";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PlaceIcon from "@mui/icons-material/Place";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BackpackIcon from "@mui/icons-material/Backpack";
import PhoneIcon from "@mui/icons-material/Phone";

export default function EventDatePage() {
  //   const params = useParams();
  //   const date = params?.event_date;

  // const [event, setEvent] = useState<{ date?: string; fee?: number } | null>(null);

  // useEffect(() => {
  //   if (!date) return;
  //   const fetchEvent = async () => {
  //     const docRef = doc(db, 'events', date as string);
  //     const docSnap = await getDoc(docRef);
  //     if (docSnap.exists()) {
  //       setEvent(docSnap.data() as { date?: string; fee?: number });
  //     } else {
  //       setEvent(null);
  //     }
  //   };
  //   fetchEvent();
  // }, [date]);

  return (
    <div>
      <div className="container mx-auto px-4">
        <Image
          src="/fruitshatakeTitleLogo.png"
          className={"object-contain h-12 sm:h-16 my-4 w-full"}
          width={1248 / 3}
          height={171 / 3}
          alt={"title"}
        />
        <p className="text-center text-gray-500 mt-2">
          ランチピザパーティのご案内
        </p>
      </div>
      <div className="bg-green-50 rounded-lg shadow-md p-6 my-8">
        <h2 className="text-2xl font-bold text-green-800 mb-2 text-center">
          フルーツとやさい畑の皆様へ
        </h2>
        <pre className="text-gray-700 mb-4 text-center whitespace-pre-line">
          既に暑さも増してきておりますが、皆様いかがお過ごしでしょうか。
          農園ご利用の皆様とそのご家族・ご友人を対象に、農園のピザ窯を使ったイベントを開催いたします。
        </pre>
        <pre className="text-gray-700 whitespace-pre-line">
          農園で収穫した新鮮な野菜をピザに乗せてみたり、みんなでランチを楽しみませんか？
          焼きたてのピザを味わいながら、交流や親睦を深める機会となれば幸いです。
          ご家族やお友達もお誘い合わせのうえ、ぜひご参加ください！
        </pre>
      </div>
      <div className="bg-white rounded-lg shadow-xl p-8 mb-8 border-t-4 border-orange-400">
        <div className="text-center mb-6">
          <div className="inline-block bg-orange-100 rounded-full p-4 mb-4">
            <LocalPizzaIcon style={{ fontSize: 56 }} />
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            7月5日（土）開催
          </h2>
          <p className="text-xl text-gray-600">
            みんなでワイワイ！ピザ窯イベント
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8 mx-8">
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-2xl font-bold text-green-700 mb-4 flex items-center">
            <CalendarMonthIcon className="mr-2" />
            開催日時
          </h3>
          <div className="space-y-2 text-gray-700">
            <p className="text-xl font-semibold">2025年7月5日（土）</p>
            <p className="text-lg">時間：11:00〜15:00</p>
            <p className="text-sm text-gray-600">※出入りは自由です</p>
            <p className="text-sm text-gray-600">※雨天の場合は中止となります</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-2xl font-bold text-green-700 mb-4 flex items-center">
            <PlaceIcon className="mr-2" />
            開催場所
          </h3>
          <div className="space-y-2 text-gray-700">
            <p className="text-xl font-semibold">フルーツとやさい畑</p>
            <p className="text-lg">芝生広場</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h3 className="text-2xl font-bold text-green-700 mb-6 text-center flex items-center justify-center">
          参加料金
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-orange-50 rounded-lg p-6 text-center border-2 border-orange-200">
            <div className="text-4xl mb-2 flex justify-center">
              <FamilyRestroomIcon fontSize="large" />
            </div>
            <h4 className="text-2xl font-bold text-orange-600 mb-2">大人</h4>
            <p className="text-3xl font-bold text-orange-700">500円</p>
          </div>
          <div className="bg-green-50 rounded-lg p-6 text-center border-2 border-green-200">
            <div className="text-4xl mb-2 flex justify-center">
              <ChildCareIcon fontSize="large" />
            </div>
            <h4 className="text-2xl font-bold text-green-600 mb-2">
              小学生以下
            </h4>
            <p className="text-3xl font-bold text-green-700">200円</p>
          </div>
        </div>
        <p className="text-center text-gray-600 mt-4">
          ※参加料金はピザと飲み物代に充てさせて頂きます。
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h3 className="text-2xl font-bold text-green-700 mb-6 text-center flex items-center justify-center">
          <RestaurantIcon className="mr-2" />
          当日のご用意
        </h3>

        <div className="grid md:grid-cols-1 gap-8">
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-green-600 border-b-2 border-green-200 pb-2 flex items-center">
              <CheckCircleIcon className="mr-2" />
              運営側で用意するもの
            </h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <CheckCircleIcon
                  className="text-green-500 mr-3"
                  fontSize="small"
                />
                焼きたてピザ
              </li>
              <li className="flex items-center">
                <CheckCircleIcon
                  className="text-green-500 mr-3"
                  fontSize="small"
                />
                お飲み物各種
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-orange-600 border-b-2 border-orange-200 pb-2 flex items-center">
              <BackpackIcon className="mr-2" />
              持ち込み自由
            </h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <BackpackIcon
                  className="text-orange-500 mr-3"
                  fontSize="small"
                />
                お好みの飲食物/ ピザ窯で焼きたい食材等も歓迎
              </li>
              <li className="flex items-center">
                <BackpackIcon
                  className="text-orange-500 mr-3"
                  fontSize="small"
                />
                レジャーシート
              </li>
              <li className="flex items-center">
                <BackpackIcon
                  className="text-orange-500 mr-3"
                  fontSize="small"
                />
                お子様のおやつ等
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-green-600 text-white rounded-lg shadow-lg p-8 text-center">
        <h3 className="text-2xl font-bold mb-4 flex items-center justify-center">
          <PhoneIcon className="mr-2" />
          参加ご希望の方
        </h3>
        <div className="bg-white text-green-600 inline-block px-6 py-3 rounded-lg font-semibold">
          フルーツとやさい畑 ： LINEにて参加人数をお知らせください。
          <br />
          花野菜農園 ； メールまたは電話でも受け付けております。
        </div>
      </div>
    </div>
  );
}
