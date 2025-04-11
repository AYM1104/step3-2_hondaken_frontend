// ✅ App Router 対応のクライアントコンポーネント宣言
'use client';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// MUIコンポーネント
import { Box, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar, PickersDay } from '@mui/x-date-pickers';

// カスタムコンポーネント 
import Header from '@/components/header/header';
import CustomCardSchedule from '@/components/card/CustomCardSchedule';
import CustomTimePicker from '@/components/time/CustomTimePicker';
import StoreDetailModal from '@/components/modal/StoreDetailModal'; // 
import BottomNav from '@/components/BottomNavigation/BottomNavigation';

dayjs.extend(utc);
dayjs.extend(timezone);

// Store型定義
type Store = {
  id: number;
  name: string;
  postalCode: string;
  address: string; // ここに都道府県+市区町村+番地を結合したものを入れる
  imageUrl: string;
  sizeTags: string[];
  rating: number;
  reviewCount: number;
  features: string[];
  description: string;
  price: string;
};

// APIから来るデータ用の型
type RawStore = {
  id: number;
  name: string;
  postal_code: string;
  prefecture: string;
  city: string;
  address_line: string;
};

export default function SchedulePage() {
  const [stores, setStores] = useState<Store[]>([]); // APIから取得した店舗一覧
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState(dayjs()); // カレンダーの日付
  const [openModal, setOpenModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  // モーダル開閉
  const handleOpenModal = (store: Store) => {
    setSelectedStore(store);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStore(null);
  };

  // 店舗情報をAPIから取得（上位2件だけ）
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}locations/?skip=0&limit=2`);
        const data = await res.json();

        // フォーマット整形
        const formatted = data.map((item: RawStore) => ({
          id: item.id,
          name: item.name,
          postalCode: item.postal_code,
          // ✅ 住所は「都道府県 + 市区町村 + 番地」の形式で結合
          address: `${item.prefecture}${item.city}${item.address_line}`,
          imageUrl: '/Honda-dealer.png', // 固定画像
          sizeTags: ['小型犬', '中型犬', '大型犬'],
          rating: 4.5,
          reviewCount: 123,
          features: ['一時預かり', '宿泊', 'カメラ見守り', 'ドッグラン'],
          description: 'スタッフによる見守りと快適な個室、広いドッグランで安心のサービスを提供します。',
          price: '￥500',
        }));

        setStores(formatted);
      } catch (error) {
        console.error('店舗取得失敗:', error);
      }
    };

    fetchStores();
  }, []);

  return (
    <>
      <Box sx={{ p: 3, pb: '100px' }}>
        {/* ロゴ */}
        <Header />

        {/* カレンダー */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(newDate)}
            slots={{
              day: (props) => {
                const isSelected = dayjs(props.day).isSame(selectedDate, 'day');
                return (
                  <PickersDay
                    {...props}
                    sx={{
                      ...(isSelected && {
                        bgcolor: '#FCC419',
                        color: 'black',
                        '&:hover': {
                          bgcolor: '#e6b800',
                        },
                      }),
                    }}
                  />
                );
              },
            }}
          />
        </LocalizationProvider>
        </Box>

        {/* 利用時間選択 */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
            利用時間
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CustomTimePicker label="開始時間" value={startTime} onChange={setStartTime} />
              <Typography>〜</Typography>
              <CustomTimePicker label="終了時間" value={endTime} onChange={setEndTime} />
            </Box>
          </LocalizationProvider>
        </Box>

        {/* 店舗カード一覧 */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
            予約店舗
          </Typography>
          {stores.map((store, index) => (
            <Box key={index} sx={{ mb: 1.5 }}>
              <CustomCardSchedule
                store={store}
                onClickDetails={() => handleOpenModal(store)}
              />
            </Box>
          ))}
        </Box>
      </Box>

      {/* モーダル */}
      {selectedStore && (
        <StoreDetailModal
          open={openModal}
          onClose={handleCloseModal}
          store={selectedStore}
          startTime={startTime}
          endTime={endTime}
          selectedDate={selectedDate}
        />
      )}

      <BottomNav />
    </>
  );
}