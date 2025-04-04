'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';

import CustomYellowButton from '@/components/button/CustomYellowButton';
import CustomGrayButton from '@/components/button/CustomGrayButton';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CustomCardHome from '@/components/card/CustomCardHome';
import CustomTab from '@/components/tab/CustomTab';

const tabLabels = ['あずける', 'おむかえ'];

export default function Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('あずける');

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      {/* 背景画像（丸く切り抜き） */}
      <Box
        sx={{
          width: '100%',
          height: {
            xs: 400,
            sm: 600,
            md: 700,
          },
          // borderBottomLeftRadius: '100% 35%',
          // borderBottomRightRadius: '100% 35%',
          borderBottomLeftRadius: {
            xs: '100% 35%',
            sm: '100% 40%',
            md: '100% 45%',
          },
          borderBottomRightRadius: {
            xs: '100% 35%',
            sm: '100% 40%',
            md: '100% 45%',
          },
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1615751072497-5f5169febe17?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3MjAxN3wwfDF8c2VhcmNofDUwfHxkb2d8ZW58MHx8fHwxNzQzMzA2NDk0fDA&ixlib=rb-4.0.3&q=85&fmt=jpg&crop=entropy&cs=tinysrgb&w=450"
          alt="Dog"
          fill
          style={{
            objectFit: 'cover',
            objectPosition: 'center -130px',
          }}
        />

        {/* ボタン2つ */}
        <Box
          sx={{
            position: 'absolute',
            top: {
              xs: '260px',
              sm: '450px',
              md: '530px',
            },
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* いますぐ予約する */}
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
          onChange={(newIndex) => setActiveTab(newIndex)}
        />
      </Box>

      {/* タブの中身 */}
      <Box sx={{ mt: 4, px: 2 }}>
        {activeTab === 'あずける' && (
          <CustomCardHome
            title="今日の予約"
            storeName="Honda Cars 青山店"
            date="2025年12月31日"
            timeSlot="15:00〜17:00"
            onClickQRCode={() => alert('QRコードを表示します')}
          />
        )}
        {activeTab === 'おむかえ' && <Typography>おむかえ予約の内容をここに表示</Typography>}
      </Box>
    </Box>
  );
}