'use client';

import CustomCard from "./CustomCard";
import CustomGrayButton from "../button/CustomGrayButton";
import { Box, Typography, Stack } from '@mui/material';

type CustomCardHomeProps = {
    // このカードに渡せるデータの種類（型） を定義
    title: string;
    storeName: string;
    date: string;
    timeSlot: string;
    onClickQRCode: () => void;
};
  
const CustomCardHome = ({
    title,
    storeName,
    date,
    timeSlot,
    onClickQRCode,
}: CustomCardHomeProps) => {
    return (
        <CustomCard>
            <Stack spacing={2}>
            {/* タイトル */}
            <Typography sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                {title}
                {/* 今日の予約 */}
            </Typography>
    
            {/* 店舗名（グレー） */}
            <Typography sx={{ fontSize: '0.6rem' }}>
                {storeName}
                {/* 店舗名 */}
            </Typography>
    
            {/* 日付とボタンを横並びにする */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                {/* 左：日付と時間帯 */}
                <Box>
                    <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>
                        {date}
                        {/* 日付 */}
                    </Typography>
                    <Typography sx={{ fontSize: '0.6rem', fontWeight: 'bold' }}>
                        {timeSlot}
                        {/* 時間帯 */}
                    </Typography>
                </Box>

                {/* 右：QRコードボタン */}
                <CustomGrayButton onClick={onClickQRCode} sx={{ width: 'fit-content', px: 3 }}>
                    <Typography sx={{ fontSize: '0.6rem', fontWeight: 600 }}>
                        QRコードを表示
                    </Typography>
                </CustomGrayButton>
            </Box>

        </Stack>
      </CustomCard>
    );
  };
  
  export default CustomCardHome;

