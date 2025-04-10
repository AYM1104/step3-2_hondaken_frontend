'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// MUIコンポーネント
import { useTheme, useMediaQuery } from '@mui/material';
import { Box, Typography } from '@mui/material';

//　カスタムコンポーネント
import Header from '@/components/header/header';
import CustomYellowButton from '@/components/button/CustomYellowButton';
import CustomGrayButton from '@/components/button/CustomGrayButton';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CustomCardHome from '@/components/card/CustomCardHome';
import CustomTab from '@/components/tab/CustomTab';
import BottomNav from '@/components/BottomNavigation/BottomNavigation';

const tabLabels = ['あずける', 'おむかえ'];

// 予約データの型定義
type Reservation = {
  location_id: number;
  check_in_time: string;
  check_out_time: string;
};

export default function Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('あずける');
  // もっちゃん追加
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [locationMap, setLocationMap] = useState<Record<number, string>>({});

  // JWTトークンを取得する関数
  const getToken = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.warn('🔑 トークンが見つかりません。ログインが必要です');
      return null;
    }
    return token;
  };

  // 予約情報を取得する関数
  const getUpcomingReservations = async (token: string): Promise<Reservation[]> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}reservations/me/upcoming`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // 取得に失敗した場合
    if (!res.ok) throw new Error('❌ 予約取得に失敗しました');
    // 取得できたらJSON形式で返す
    return res.json();
  };

  // 予約情報から一意の店舗IDを取得する関数
  const uniqueLocationIds = (reservations: Reservation[]): number[] => {
    return Array.from(new Set(reservations.map((r) => r.location_id)));
  };

  // 店舗IDから店舗名を取得する関数
  const fetchLocationName = async (id: number, token: string): Promise<{ id: number; name: string }> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}locations/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    const data = await res.json();
    return { id, name: data.name };
  }; 

  // 店舗ID → 店舗名の マップ（Map） を作る関数
  const getLocationMap = async (reservations: Reservation[], token: string): Promise<Record<number, string>> => {
    // ユニークな店舗ID一覧を取得
    const ids = uniqueLocationIds(reservations);
  
    // 各IDに対して fetchLocationName を呼び出して、全件Promise化
    const locationPromises = ids.map((id) => fetchLocationName(id, token));
  
    // 全部のfetchが終わるまで待つ
    const locations = await Promise.all(locationPromises);
  
    // Mapに変換
    const map: Record<number, string> = {};
    locations.forEach(({ id, name }) => {
      map[id] = name;
    });
  
    return map;
  };



  // もっちゃん追加
  useEffect(() => {
    const fetchData = async () => {
      const token = getToken(); // JWTトークン取得
      // const token = localStorage.getItem('access_token');
      // console.log('トークンの期限切れチェックをスキップ（仮）');
      if (!token) return;
  
      try {
        const reservations = await getUpcomingReservations(token); // 予約データ取得
        setReservations(reservations);
  
        const map = await getLocationMap(reservations, token); // 店舗マップ作成
        setLocationMap(map); // stateに保存
      } catch (err) {
        console.error('📛 エラー:', err);
      }
    };
  
    fetchData();
  }, []);

  // もっちゃん追加
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // もっちゃん追加
  const formatTime = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return '';
    return `${s.getHours()}:00〜${e.getHours()}:00`;
  };

  // レスポンシブの条件を定義
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  // objectPosition を動的に決定
  let objectPosition = 'center -130px';
  if (isSm) objectPosition = 'center -230px';
  if (isMdUp) objectPosition = 'center -330px';

  return (
    <>
      <Box sx={{ width: '100%', position: 'relative', paddingBottom: '80px' }}>
        <Header />

        {/* 背景画像 */}
        <Box
          sx={{
            width: '100%',
            height: { xs: 400, sm: 500, md: 400 },
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
            style={{ objectFit: 'cover', objectPosition: objectPosition, }}
          />

          {/* ボタン（いますぐ予約、日時指定） */}
          <Box
            sx={{
              position: 'absolute',
              top: { xs: '260px', sm: '350px', md: '260px' },
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* いますぐ予約 */}
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
            
            {/* 日時を指定して予約 */}
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

        {/* タブの内容 */}
        {/* <Box sx={{ mt: 4, px: 2 }}> */}
          {/* もっちゃん追加 */}
          {activeTab === 'あずける' && reservations.length > 0 ? (
            // 予約が１件以上ある場合
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
            // まだ予約がない場合
            <Typography sx={{ mt: 2, color: 'text.secondary', textAlign: 'center' }}>
              予約はまだありません
            </Typography>
          )}

          {activeTab === 'おむかえ' && (
            <Typography>おむかえ予約の内容をここに表示</Typography>
          )}
        {/* </Box> */}
      </Box>

      <BottomNav />
    </>
  );
}