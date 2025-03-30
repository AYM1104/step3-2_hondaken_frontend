'use client';

import React from 'react';
import { Card, CardProps } from '@mui/material';
import { styled } from '@mui/material/styles';

// theme は使ってないので省略OK！
const StyledCard = styled(Card)<CardProps>(() => ({
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  padding: '24px',
  boxShadow: '0px 12px 32px rgba(0, 0, 0, 0.2)',
}));

// Props の型定義
type CustomCardProps = {
  children: React.ReactNode;
};

export default function CustomCard({ children }: CustomCardProps) {
  return <StyledCard>{children}</StyledCard>;
}