'use client';

import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Image from 'next/image';
import CustomCard from './CustomCard';
import CustomYellowButton from '../button/CustomYellowButton';

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
  const [isFavorite, setIsFavorite] = useState(false);

  const RIGHT_WIDTH = 108;

  return (
    <CustomCard
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center', // ← 中央揃え（左右共通）
        gap: 2,
        width: '100%',
        minHeight: 120, // ← 最低高さを指定して中央揃えが活きるように
      }}
    >
      {/* 左：テキストグループを上下中央に配置 */}
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          mb={1}
          sx={{ wordBreak: 'break-word', lineHeight: 1.4 }}
        >
          {name}
        </Typography>
        <Typography variant="caption" display="block" mb={0.5}>
          {postalCode}
        </Typography>
        <Typography variant="caption" display="block">
          {address}
        </Typography>
      </Box>

      {/* 右：画像・ハート・ボタン（固定幅） */}
      <Box sx={{ width: RIGHT_WIDTH, minWidth: RIGHT_WIDTH }}>
        <Box sx={{ position: 'relative' }}>
          <Image
            src={imageUrl}
            alt="店舗画像"
            width={RIGHT_WIDTH}
            height={80}
            style={{
              borderRadius: 8,
              objectFit: 'cover',
              display: 'block',
            }}
          />
          <IconButton
            onClick={() => setIsFavorite((prev) => !prev)}
            size="small"
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              backgroundColor: '#ffffff',
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              '&:hover': { backgroundColor: '#f0f0f0' },
            }}
          >
            {isFavorite ? (
              <FavoriteIcon sx={{ color: '#ff4081', fontSize: 18 }} />
            ) : (
              <FavoriteBorderIcon sx={{ color: '#ff4081', fontSize: 18 }} />
            )}
          </IconButton>
        </Box>

        <Box sx={{ mt: 1, width: RIGHT_WIDTH }}>
          <CustomYellowButton
            onClick={onClickDetails}
            sx={{
              height: 32,
              fontSize: '12px',
              px: 1.5,
              py: 0.5,
              lineHeight: 1,
            }}
          >
            店舗詳細を見る
          </CustomYellowButton>
        </Box>
      </Box>
    </CustomCard>
  );
}
