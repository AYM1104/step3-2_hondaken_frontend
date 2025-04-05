'use client';

import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import Image from 'next/image';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useRouter } from 'next/navigation';

// 仮の予約情報（バックエンド連携前提なので動的に）
const reservationInfo = {
  storeName: 'Honda Cars 埼玉 草加店',
  date: '2024/12/23',
  time: '15:00 〜 17:00',
  qrCodeUrl: '/sample-qr.png', // 仮のQR画像
  details: [
    { label: '利用者名', value: '本橋 智彦' },
    { label: '愛犬名', value: 'あらし' },
    { label: '犬種', value: '雑種' },
    { label: '体重', value: '15.2kg' },
    { label: 'サービス種別', value: 'さんぽ・おやつ' },
    { label: '予約ID', value: '#20240416–001' },
  ],
};

export default function QRCodePage() {
  const router = useRouter();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FCC419', pb: 4 }}>
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
        {/* 左上の戻るアイコン */}
        <IconButton
          onClick={() => router.push('/mypage')}
          sx={{
            position: 'absolute',
            left: 8,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <ArrowBackIcon sx={{ color: '#212529' }} />
        </IconButton>

        {/* 中央にロゴ */}
        <Image
          src="/hondadog-logo.png"
          alt="HondaDog"
          width={160}
          height={44}
          style={{ objectFit: 'contain' }}
        />
      </Box>

      {/* QRカード全体 */}
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '32px',
          mx: 3,
          mt: 4,
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* チケット風の切り欠き */}
        <Box
          sx={{
            position: 'absolute',
            top: '45%',
            left: '-12px',
            width: '24px',
            height: '24px',
            backgroundColor: '#FCC419',
            borderRadius: '50%',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '45%',
            right: '-12px',
            width: '24px',
            height: '24px',
            backgroundColor: '#FCC419',
            borderRadius: '50%',
          }}
        />

        {/* QRコード */}
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
          <Image src={reservationInfo.qrCodeUrl} alt="QRコード" width={200} height={200} />
        </Box>

        {/* 来店情報（センタリング） */}
        <Box sx={{ px: 3, pb: 2, borderTop: '1px dashed #ccc', textAlign: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
            <EventNoteIcon sx={{ fontSize: 30, color: 'grey.600', mb: 1 }} />
            <Typography fontSize={14} color="text.secondary">
              {reservationInfo.storeName}
            </Typography>
            <Typography fontSize={14} color="text.secondary">
              {reservationInfo.date}
            </Typography>
            <Typography fontWeight="bold" fontSize={16}>
              {reservationInfo.time}
            </Typography>
          </Box>
        </Box>

        {/* 詳細エリア */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
            px: 3,
            pb: 4,
            pt: 2,
          }}
        >
          {reservationInfo.details.map((item, index) => (
            <Box key={index}>
              <Typography fontSize={12} color="text.secondary">
                {item.label}
              </Typography>
              <Typography fontWeight="bold" fontSize={14}>
                {item.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
