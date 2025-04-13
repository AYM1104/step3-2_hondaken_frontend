'use client';

import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

// カスタムスタイル付きのグレーボタン
const StyledButton = styled(Button)<ButtonProps>(() => ({
  backgroundColor: '#CED4DA',
  color: '#343A40',
  borderRadius: '999px',
  padding: '12px 12px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  boxShadow: 'none',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: '#BFC4CA',
    boxShadow: 'none',
  },
}));

// Propsの型定義
type CustomGrayButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  sx?: ButtonProps['sx'];
  startIcon?: React.ReactNode; 
  endIcon?: React.ReactNode;   
  component?: React.ElementType;
};

export default function CustomGrayButton({
  children,
  onClick,
  sx,
  startIcon,
  endIcon,
}: CustomGrayButtonProps) {
  return (
    <StyledButton
      component="label"
      variant="contained"
      onClick={onClick}
      sx={sx}
      startIcon={startIcon}
      endIcon={endIcon}
    >
      {children}
    </StyledButton>
  );
}
