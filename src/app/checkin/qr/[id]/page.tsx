'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

// MUIコンポーネント
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventNoteIcon from '@mui/icons-material/EventNote';


// カスタムコンポーネント
import Header from '@/components/header/header';

type DetailItem = {
  label: string;
  value: string;
};

type ReservationInfo = {
  storeName: string;
  date: string;
  time: string;
  qrCodeUrl: string;
  details: DetailItem[];
};


export default function QRCodePage() {
  const router = useRouter();
  const { id } = useParams(); // ← URLの予約ID

  // QRコード画像を保存する状態
  const [qrCode, setQrCode] = useState<string | null>(null);

  // 予約情報を保存する状態
  const [reservationInfo, setReservationInfo] = useState<ReservationInfo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ① QRコード取得
        const qrRes = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}qr/generate?reservation_id=${id}&qr_type=checkin`);
        const qrData = await qrRes.json();
        setQrCode(qrData.code);
  
        // ② 予約情報取得（ここで user_id などを取得）
        const reservationRes = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}reservations/${id}`);
        const reservation = await reservationRes.json();
        console.log('予約データ:', reservation);

        // ③ 利用者・犬・店舗情報を一括取得
        const [userRes, dogRes, locationRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}users/${reservation.user_id}`),
          fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}dogs/${reservation.dog_id}`),
          fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}locations/${reservation.location_id}`)
        ]);

        const [userData, dogData, locationData] = await Promise.all([
          userRes.json(),
          dogRes.json(),
          locationRes.json()
        ]);

        // 確認用
        console.log('👤 利用者情報:', userData);
        console.log('🐶 愛犬情報:', dogData);
        console.log('🏪 店舗情報:', locationData);
  
        const reservationDetail = {
          storeName: locationData.name,
          date: reservation.scheduled_start_time.split('T')[0],
          time: `${formatTime(reservation.scheduled_start_time)} 〜 ${formatTime(reservation.scheduled_end_time)}`,
          qrCodeUrl: qrData.code,
          details: [
            { label: '利用者名', value: `${userData.name_last} ${userData.name_first}` },
            { label: '愛犬名', value: dogData.name },
            { label: '犬種', value: dogData.breed },
            { label: '体重', value: `${dogData.weight}kg` },
            { label: 'オプション', value: 'さんぽ・おやつ' }, // 一旦固定
            { label: '予約ID', value: `#${reservation.id}` }
          ]
        };
  
        setReservationInfo(reservationDetail);
      } catch (err) {
        console.error('データ取得に失敗しました', err);
      }
    };
  
    if (id) fetchData();
  }, [id]);
  
  // 時刻整形関数
  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  };

  if (!reservationInfo) {
    return <p>読み込み中...</p>;
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FCC419', pb: 4 }}>
      <Box sx={{ position: 'relative' }}>
        {/* ← 戻るボタン（左寄せ・absolute配置） */}
        <IconButton
          onClick={() => router.back()}
          sx={{
            position: 'absolute',
            left: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1,
          }}
        >
          <ArrowBackIcon sx={{ color: '#212529' }} />
        </IconButton>

        {/* ロゴ（中央） */}
        <Box sx={{ textAlign: 'center' }}>
          <Header />
        </Box>
      </Box>

      {/* QRカード全体 */}
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '32px',
          mx: 3,
          mt: 4,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* チケット風の切り欠き */}
        <Box
          sx={{
            position: 'absolute',
            top: '42%',
            left: '-16px',
            width: '28px',
            height: '28px',
            backgroundColor: '#FCC419',
            borderRadius: '50%',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '42%',
            right: '-16px',
            width: '28px',
            height: '28px',
            backgroundColor: '#FCC419',
            borderRadius: '50%',
          }}
        />

        {/* QRコード */}
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
          {qrCode ? (
            <Image src={qrCode} alt="QRコード" width={200} height={200} />
          ) : (
            <Typography color="text.secondary">QRコードを読み込み中...</Typography>
          )}
        </Box>

        {/* 来店情報（センタリング） */}
        <Box
          sx={{
            position: 'relative',
            px: 3,
            pb: 2,
            mt: 4,
            textAlign: 'center',

            // 背景の点線（間隔や色を自由に変えられる）
            '::before': {
              content: '""',
              position: 'absolute',
              top: -25,
              left: 12,   // ← 両端に黄丸があるなら中央だけ点線にしたいときに調整
              right: 12,
              height: '1px',
              backgroundImage:
                'repeating-linear-gradient(to right, #ccc, #ccc 6px, transparent 6px, transparent 12px)',
            },
          }}
        >
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
            display: 'flex',
            justifyContent: 'center',
            mt: 4,
            mb: 4,
          }}
        >
          {/* 左カラム */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 2,
              pr: 4,
            }}
          >
            {reservationInfo?.details?.slice(0, 3).map((item: DetailItem, index: number) => (
              <Box key={index}>
                <Typography fontSize={12} color="text.secondary">
                  {item.label}
                </Typography>
                <Typography fontWeight="bold" fontSize={16}>
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* 右カラム */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 2,
              pl: 4,
            }}
          >
            {reservationInfo?.details?.slice(3).map((item: DetailItem, index: number) => (
              <Box key={index}>
                <Typography fontSize={12} color="text.secondary">
                  {item.label}
                </Typography>
                <Typography fontWeight="bold" fontSize={16}>
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
