'use client';

import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

// カスタムスタイル付きのグレーボタン
const StyledButton = styled(Button)<ButtonProps>(() => ({
  backgroundColor: '#CED4DA',
  color: '#343A40',
  borderRadius: '999px',
  padding: '12px 24px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#BFC4CA',
    boxShadow: 'none',
  },
}));

// Propsの型定義
type CustomGrayButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  sx?: ButtonProps['sx']; // ← 追加：sxを受け取れるように
};

export default function CustomGrayButton({
  children,
  onClick,
  sx,
}: CustomGrayButtonProps) {
  return (
    <StyledButton variant="contained" onClick={onClick} sx={sx}>
      {children}
    </StyledButton>
  );
}
