'use client';

import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Image from 'next/image';
import CustomCard from './CustomCard';
import CustomYellowButton from '../button/CustomYellowButton';

// 型ファイル（types/store.ts）を使わず、inlineで型定義
type CustomCardScheduleProps = {
  store: {
    name: string;
    postalCode: string;
    address: string;
    imageUrl: string;
  };
  onClickDetails: () => void;
};

export default function CustomCardSchedule({
  store,
  onClickDetails,
}: CustomCardScheduleProps) {
  const { name, postalCode, address, imageUrl } = store;

  // お気に入り状態を管理（ハートのON/OFF）
  const [isFavorite, setIsFavorite] = useState(false);
  const handleToggleFavorite = () => setIsFavorite((prev) => !prev);

  return (
    <CustomCard sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {/* 左側：店舗情報（テキスト） */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle1" fontWeight="bold" mb={1}>
          {name}
        </Typography>
        <Typography variant="body2">{postalCode}</Typography>
        <Typography variant="body2">{address}</Typography>
      </Box>

      {/* 右側：画像＋ハート＋ボタン */}
      <Box sx={{ position: 'relative', width: 140, minWidth: 140 }}>
        {/* 店舗画像（Next.jsのImageコンポーネント） */}
        <Image
          src={imageUrl}
          alt="店舗画像"
          width={140}
          height={95}
          style={{ borderRadius: '12px', objectFit: 'cover' }}
        />

        {/* お気に入りアイコンボタン */}
        <IconButton
          onClick={handleToggleFavorite}
          size="small"
          sx={{
            position: 'absolute',
            top: 6,
            right: 6,
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          }}
        >
          {isFavorite ? (
            <FavoriteIcon sx={{ color: '#ff4081' }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: '#ff4081' }} />
          )}
        </IconButton>

        {/* 「店舗詳細を見る」ボタン */}
        <Box sx={{ mt: 1 }}>
          <CustomYellowButton
            onClick={onClickDetails}
            sx={{
              height: 36,
              fontSize: '14px',
              fontWeight: 600,
              borderRadius: '50px',
              px: 2,
              py: 0,
            }}
          >
            店舗詳細を見る
          </CustomYellowButton>
        </Box>
      </Box>
    </CustomCard>
  );
}
