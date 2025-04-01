'use client';

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CustomCardSchedule from '@/components/card/CustomCardSchedule';
import CustomTimePicker from '@/components/time/CustomTimePicker';
import { DateCalendar } from '@mui/x-date-pickers';
import BottomNav from '@/components/BottomNav';

export default function SchedulePage() {
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('17:00');

  const stores = [
    {
      name: 'Honda Cars 埼玉 草加店',
      postalCode: '340-0036',
      address: '埼玉県草加市苗塚町562',
      imageUrl: '/Hondadealer.png',
    },
    {
      name: 'Honda Cars 埼玉 草加南店',
      postalCode: '340-0035',
      address: '埼玉県草加市西町1212-1',
      imageUrl: '/Hondadealer.png',
    },
    {
      name: 'Honda Cars 埼玉 八潮店',
      postalCode: '340-0816',
      address: '埼玉県八潮市中央1-14-5',
      imageUrl: '/Hondadealer.png',
    },
  ];

  return (
    <>
      <Box sx={{ p: 3, pb: '100px' }}> {/* 下部ナビ分の余白 */}
       {/* ✅ ロゴ画像（中央寄せ） */}
       <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <img
            src="/hondadog-logo.png"
            alt="HondaDog"
            style={{
              height: 50,
              objectFit: 'contain',
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar />
          </LocalizationProvider>
        </Box>

        {/* 利用時間セクション */}
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

        {/* 予約店舗リスト */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
            予約店舗
          </Typography>
          {stores.map((store, index) => (
            <Box key={index} sx={{ mb: 1.5 }}> {/* カード同士の余白 1.5=12px */}
              <CustomCardSchedule
                store={store}
                onClickDetails={() => console.log('詳細クリック')}
              />
            </Box>
          ))}
        </Box>
      </Box>

      {/* ✅ 下部ナビ */}
      <BottomNav />
    </>
  );
}
