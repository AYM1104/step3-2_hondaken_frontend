'use client';

import React from 'react';
import { Card, CardProps } from '@mui/material';
import { styled } from '@mui/material/styles';

// カスタムスタイル付きのCard
const StyledCard = styled(Card)<CardProps>(() => ({
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  padding: '24px',
  boxShadow: '0px 12px 32px rgba(0, 0, 0, 0.2)',
}));

// Props の型定義
type CustomCardProps = {
  children: React.ReactNode;
  sx?: CardProps['sx']; // ← 追加！
};

export default function CustomCard({ children, sx }: CustomCardProps) {
  return <StyledCard sx={sx}>{children}</StyledCard>;
}