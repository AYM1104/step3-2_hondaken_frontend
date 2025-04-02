'use client';

import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import Image from 'next/image';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { useRouter } from 'next/navigation';

export default function ReserveCompletePage() {
  const router = useRouter();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FCC419' }}>
      {/* ヘッダー */}
      <Box
        sx={{
          position: 'relative',
          backgroundColor: 'white',
          px: 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* 家アイコン（左上） */}
        <IconButton
          onClick={() => router.push('/mypage')}
          sx={{ position: 'absolute', left: 8 }}
        >
          <HomeRoundedIcon sx={{ color: '#212529' }} />
        </IconButton>

        {/* HondaDogロゴ（センター） */}
        <Image
          src="/hondadog-logo.png"
          alt="HondaDog"
          width={150}
          height={40}
          style={{ objectFit: 'contain' }}
        />
      </Box>

      {/* 白いカード（中央） */}
      <Box
        sx={{
          position: 'relative',
          backgroundColor: 'white',
          borderRadius: 4,
          mx: 3,
          my: 6,
          px: 3,
          py: 8,
          minHeight: '520px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',

          // チケット風の左右の丸窪み
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            width: '24px',
            height: '24px',
            backgroundColor: '#FCC419',
            borderRadius: '999px',
            transform: 'translateY(-50%)',
            zIndex: 1,
          },
          '&::before': {
            left: '-10px',
          },
          '&::after': {
            right: '-10px',
          },
        }}
      >
        {/* チケット中央画像＋メッセージ */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 300,
            aspectRatio: '1',
          }}
        >
          <Image
            src="/reserve-complete.png"
            alt="予約完了"
            fill
            style={{ objectFit: 'contain' }}
          />

          {/* 中央メッセージ */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              whiteSpace: 'nowrap',
            }}
          >
            <Typography fontWeight="bold" fontSize={18}>
              予約が完了しました
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
