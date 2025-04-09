'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';

import Header from '@/components/header/header';
import CustomYellowButton from '@/components/button/CustomYellowButton';
import CustomGrayButton from '@/components/button/CustomGrayButton';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CustomCardHome from '@/components/card/CustomCardHome';
import CustomTab from '@/components/tab/CustomTab';
import BottomNav from '@/components/BottomNav';

const tabLabels = ['あずける', 'おむかえ'];

type Reservation = {
  location_id: number;
  check_in_time: string;
  check_out_time: string;
};

export default function Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('あずける');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [locationMap, setLocationMap] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchReservations = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.warn('🔑 JWTが存在しません。ログインしてください');
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}reservations/me/upcoming`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          console.error('❌ 予約取得に失敗しました', res.statusText);
          return;
        }

        const data: Reservation[] = await res.json();
        setReservations(data);

        const uniqueLocationIds = Array.from(new Set(data.map((r) => r.location_id)));
        const locationPromises = uniqueLocationIds.map((id) =>
          fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}locations/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => res.json().then((data) => ({ id, name: data.name })))
        );

        const locations = await Promise.all(locationPromises);
        const map: Record<number, string> = {};
        locations.forEach(({ id, name }) => {
          map[id] = name;
        });
        setLocationMap(map);
      } catch (err) {
        console.error('通信エラー:', err);
      }
    };

    fetchReservations();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return '';
    return `${s.getHours()}:00〜${e.getHours()}:00`;
  };

  return (
    <>
      <Box sx={{ width: '100%', position: 'relative', paddingBottom: '80px' }}>
        <Header />

        {/* 背景エリア */}
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
            src="https://images.unsplash.com/photo-1615751072497-5f5169febe17?auto=format&q=80&fit=crop&w=450"
            alt="Dog"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center -130px' }}
          />

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

        {/* タブ切替 */}
        <Box sx={{ mt: 4 }}>
          <CustomTab
            tabs={tabLabels}
            activeTab={activeTab}
            onChange={(newTab) => setActiveTab(newTab)}
          />
        </Box>

        {/* タブ内容 */}
        <Box sx={{ mt: 4, px: 2 }}>
          {activeTab === 'あずける' && reservations.length > 0 ? (
            reservations.map((r, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <CustomCardHome
                  title={`予約情報 ${index + 1}`}
                  storeName={locationMap[r.location_id] || '店舗情報取得中'}
                  date={formatDate(r.check_in_time)}
                  timeSlot={formatTime(r.check_in_time, r.check_out_time)}
                  onClickQRCode={() => alert('QRコードを表示します')}
                />
              </Box>
            ))
          ) : (
            <Typography sx={{ mt: 2, color: 'text.secondary', textAlign: 'center' }}>
              予約はまだありません
            </Typography>
          )}

          {activeTab === 'おむかえ' && (
            <Typography>おむかえ予約の内容をここに表示</Typography>
          )}
        </Box>
      </Box>

      <BottomNav />
    </>
  );
}