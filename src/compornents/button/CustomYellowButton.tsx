'use client';

import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

// Buttonに渡すpropsの型を維持しつつスタイリング
const StyledButton = styled(Button)<ButtonProps>(() => ({
  backgroundColor: '#FCC419',
  color: '#343A40',
  borderRadius: '999px',
  padding: '12px 24px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#FAB005',
    boxShadow: 'none',
  },
}));

// Propsの型定義
type CustomYellowButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  sx?: ButtonProps['sx']; // ← 追加：sxを外から渡せるように！
};

export default function CustomYellowButton({
  children,
  onClick,
  sx,
}: CustomYellowButtonProps) {
  return (
    <StyledButton variant="contained" onClick={onClick} sx={sx}>
      {children}
    </StyledButton>
  );
}
