'use client';

import { Button, Typography } from '@mui/material';
// import CustomYellowButton from '@/compornents/button/CustomYellowButton';
import CustomGrayButton from '@/compornents/button/CustomGrayButton';
import CustomCard from '@/compornents/card/CustomCard';

import CustomYellowButton from '@/compornents/button/CustomYellowButton';

export default function Page() {
  return (
    <main style={{ padding: 32 }}>
      <Button variant="contained">Plus Jakarta Sans ボタン</Button>
      <Typography variant="h6" style={{ marginTop: 16 }}>
        ABCDEFG 12345 テスト表示
      </Typography>
      {/* <CustomYellowButton>黄色いカスタムボタン123</CustomYellowButton> */}
      <CustomGrayButton>グレーのカスタムボタン123</CustomGrayButton>
      <CustomCard >
        <Typography variant="h6">カードの中身です123</Typography>
      </CustomCard>


      <CustomYellowButton>てすと</CustomYellowButton>

    </main>
  );
}