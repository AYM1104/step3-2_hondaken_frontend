// ✅ App Router 対応のクライアントコンポーネント宣言
'use client';

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers';
import CustomCardSchedule from '@/components/card/CustomCardSchedule';
import CustomTimePicker from '@/components/time/CustomTimePicker';
import StoreDetailModal from '@/components/modal/StoreDetailModal'; // ✅ モーダルを default import
import BottomNav from '@/components/BottomNav';
import Image from 'next/image';

export default function SchedulePage() {
  // 型定義
  type Store = {
    name: string;
    postalCode: string;
    address: string;
    imageUrl: string;
    sizeTags: string[];
    rating: number;
    reviewCount: number;
    features: string[];
    description: string;
    price: string;
  };



  // ✅ 利用時間の状態管理（文字列）
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');

  // ✅ モーダル表示制御用の状態管理
  const [openModal, setOpenModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  // ✅ 店舗情報データ（仮）
  const stores = [
    {
      name: 'Honda Cars 埼玉 草加店',
      postalCode: '340-0036',
      address: '埼玉県草加市苗塚町562',
      imageUrl: '/Hondadealer.png',
      sizeTags: ['小型犬', '中型犬', '大型犬'],
      rating: 4.5,
      reviewCount: 239,
      features: ['一時預かり', '宿泊', 'カメラ見守り', 'ドッグラン'],
      description:
        '冷暖房完備の個室、スタッフによる見守り、広々ドッグランなど、わんちゃんがリラックスして過ごせる環境を整えています。',
      price: '￥500',
    },
    {
      name: 'Honda Cars 埼玉 草加南店',
      postalCode: '340-0035',
      address: '埼玉県草加市西町1212-1',
      imageUrl: '/Hondadealer.png',
      sizeTags: ['小型犬', '中型犬', '大型犬'],
      rating: 4.5,
      reviewCount: 339,
      features: ['一時預かり', '宿泊', 'カメラ見守り', 'ドッグラン'],
      description:
        '冷暖房完備の個室、スタッフによる見守り、広々ドッグランなど、わんちゃんがリラックスして過ごせる環境を整えています。',
      price: '￥600',
    },
    {
      name: 'Honda Cars 埼玉 八潮店',
      postalCode: '340-0816',
      address: '埼玉県八潮市中央1-14-5',
      imageUrl: '/Hondadealer.png',
      sizeTags: ['小型犬', '中型犬', '大型犬'],
      rating: 4.5,
      reviewCount: 49,
      features: ['一時預かり', '宿泊', 'カメラ見守り', 'ドッグラン'],
      description:
        '冷暖房完備の個室、スタッフによる見守り、広々ドッグランなど、わんちゃんがリラックスして過ごせる環境を整えています。',
      price: '￥550',
    },
  ];

  // ✅ モーダルを開く処理
  const handleOpenModal = (store: Store) => {
    setSelectedStore(store);
    setOpenModal(true);
  };

  // ✅ モーダルを閉じる処理
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStore(null);
  };

  return (
    <>
      <Box sx={{ p: 3, pb: '100px' }}> {/* ✅ 下部ナビ分の余白 */}
        {/* ✅ ロゴ画像（中央寄せ） */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Image
            src="/hondadog-logo.png"
            alt="HondaDog"
            style={{ height: 50, objectFit: 'contain' }}
          />
        </Box>

        {/* ✅ カレンダー */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar />
          </LocalizationProvider>
        </Box>

        {/* ✅ 利用時間セクション */}
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

        {/* ✅ 予約店舗リスト */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
            予約店舗
          </Typography>
          {stores.map((store, index) => (
            <Box key={index} sx={{ mb: 1.5 }}>
              <CustomCardSchedule
                store={store}
                onClickDetails={() => {
                  if (store.sizeTags) handleOpenModal(store); // ✅ 詳細ありの店舗だけ開く
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      {/* ✅ モーダル表示 */}
      {selectedStore && (
        <StoreDetailModal
          open={openModal}
          onClose={handleCloseModal}
          store={selectedStore}
        />
      )}

      {/* ✅ 下部ナビゲーション */}
      <BottomNav />
    </>
  );
}