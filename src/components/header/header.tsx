'use client';

import { AppBar, Toolbar, Box } from '@mui/material';
import Image from 'next/image';

export default function Header() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#fff', boxShadow: 'none' }}>
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src="/hondadog-logo.png"
            alt="Honda Dog ロゴ"
            width={240}  // サイズは必要に応じて調整してね
            height={36}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}