'use client';

import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)<ButtonProps>(() => ({
  backgroundColor: '#FCC419',
  color: '#343A40',
  borderRadius: '999px',
  padding: '12px 24px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  boxShadow: 'none',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: '#FAB005',
    boxShadow: 'none',
  },
}));

type CustomYellowButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  sx?: ButtonProps['sx'];
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
};

export default function CustomYellowButton({
  children,
  onClick,
  sx,
  startIcon,
  endIcon,
}: CustomYellowButtonProps) {
  return (
    <StyledButton
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