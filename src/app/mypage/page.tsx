'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';

//　カスタムコンポーネント
import Header from '@/components/header/header'; 
import CustomYellowButton from '@/components/button/CustomYellowButton';
import CustomGrayButton from '@/components/button/CustomGrayButton';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CustomCardHome from '@/components/card/CustomCardHome';
import CustomTab from '@/components/tab/CustomTab';

// タブ名
const tabLabels = ['あずける', 'おむかえ'];

// 予約データ型
type Reservation = {
  location_id: number;
  check_in_time: string;
  check_out_time: string;
};

// 店舗情報型
type Location = {
  name: string;
};

export default function Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('あずける');

  // 予約と店舗名の状態
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [storeName, setStoreName] = useState<string>('');

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}reservations/upcoming?user_id=2`);
        if (!res.ok) {
          console.error('予約取得に失敗しました', res.statusText);
          return;
        }
        const data: Reservation[] = await res.json();

        // 最初の予約を取得
        if (data.length > 0) {
          setReservation(data[0]);

          // ロケーション情報をさらに取得
          const locationRes = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}locations/${data[0].location_id}`);
          if (!locationRes.ok) {
            console.error('ロケーション取得に失敗しました', locationRes.statusText);
            return;
          }
          const locationData: Location = await locationRes.json();
          setStoreName(locationData.name);
        }
      } catch (error) {
        console.error('API呼び出しに失敗しました', error);
      }
    };

    fetchReservation();
  }, []);

  // 日付・時間の整形（エラーを避ける）
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return '';
    return `${s.getHours()}:00〜${e.getHours()}:00`;
  };

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <Header />
      {/* 背景画像（丸く切り抜き） */}
      <Box
        sx={{
          width: '100%',
          height: { xs: 400, sm: 600, md: 700 },
          borderBottomLeftRadius: { xs: '100% 35%', sm: '100% 40%', md: '100% 45%' },
          borderBottomRightRadius: { xs: '100% 35%', sm: '100% 40%', md: '100% 45%' },
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1615751072497-5f5169febe17?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3MjAxN3wwfDF8c2VhcmNofDUwfHxkb2d8ZW58MHx8fHwxNzQzMzA2NDk0fDA&ixlib=rb-4.0.3&q=85&fmt=jpg&crop=entropy&cs=tinysrgb&w=450"
          alt="Dog"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center -130px' }}
        />

        {/* ボタン2つ */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: '260px', sm: '450px', md: '530px' },
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CustomYellowButton
            sx={{ width: '80%', height: '48px', padding: '16px 24px', mb: 2 }}
            onClick={() => router.push('/reserve/now')}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PlaceOutlinedIcon sx={{ fontSize: 32 }} />
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                いますぐ予約する
              </Typography>
            </Box>
          </CustomYellowButton>

          <CustomGrayButton
            sx={{ width: '60%', height: '48px', padding: '16px 24px', mb: 2 }}
            onClick={() => router.push('/reserve/schedule')}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarMonthIcon sx={{ fontSize: 32 }} />
              <Typography sx={{ fontSize: '0.6rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                日時を指定して予約
              </Typography>
            </Box>
          </CustomGrayButton>
        </Box>
      </Box>

      {/* タブ */}
      <Box sx={{ mt: 4 }}>
        <CustomTab
          tabs={tabLabels}
          activeTab={activeTab}
          onChange={(newTab) => setActiveTab(newTab)}
        />
      </Box>

      {/* タブの中身 */}
      <Box sx={{ mt: 4, px: 2 }}>
        {activeTab === 'あずける' && reservation && (
          <CustomCardHome
            title="今日の予約"
            storeName={storeName}
            date={formatDate(reservation.check_in_time)}
            timeSlot={formatTime(reservation.check_in_time, reservation.check_out_time)}
            onClickQRCode={() => alert('QRコードを表示します')}
          />
        )}

        {activeTab === 'おむかえ' && (
          <Typography>おむかえ予約の内容をここに表示</Typography>
        )}
      </Box>
    </Box>
  );
}
