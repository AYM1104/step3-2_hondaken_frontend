'use client';

import CustomCard from './CustomCard';
import CustomYellowButton from '../button/CustomYellowButton';
import CustomGrayButton from '../button/CustomGrayButton';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { Box, Typography, Stack } from '@mui/material';

export type Store = {
  id: number;
  name: string;
  distance: string; // 例: "1km"
  duration: string; // 例: "5m"
  isSelected?: boolean;
  onSelect: () => void;
  onDetail: () => void;
};

type CustomCardNowProps = {
  title: string;
  stores: Store[];
};

const CustomCardNow = ({ title, stores }: CustomCardNowProps) => {
  return (
    <CustomCard>
      <Stack spacing={2}>
        {/* タイトル */}
        <Typography sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
          {title}
        </Typography>

        {/* 店舗リスト */}
        {stores.map((store) => (
          <Box key={store.id}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 0.6 }}
            >
              {/* 左：店舗名 */}
              <Typography sx={{ fontSize: '0.6rem', fontWeight: 600 }}>
                {store.name}
              </Typography>

              {/* 右：選択ボタン */}
              {store.isSelected ? (
                <CustomYellowButton
                    sx={{ width: '24px', height: '16px', borderRadius: '20px', px: 0 }}
                    onClick={store.onSelect}
                >
                    <Typography sx={{ fontSize: '0.6rem', fontWeight: 600 }}>
                        選択
                    </Typography>
                </CustomYellowButton>
              ) : (
                <CustomGrayButton
                    sx={{ width: '24px', height: '16px', borderRadius: '20px', px: 0 }}
                    onClick={store.onSelect}
                >
                    <Typography sx={{ fontSize: '0.6rem', fontWeight: 600 }}>
                        選択
                    </Typography>
                </CustomGrayButton>
              )}
            </Box>

            {/* 距離・時間 + 店舗詳細ボタン */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap={1}>
                <DirectionsCarIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                <Typography sx={{ color: 'text.secondary', fontSize: '0.6rem' }}>
                  {store.distance}, {store.duration}
                </Typography>
              </Box>

              <CustomGrayButton
                sx={{ width: '24px', height: '16px', borderRadius: '20px', px: 0 }}
                onClick={store.onDetail}
              >
                <Typography sx={{ fontSize: '0.6rem', fontWeight: 600 }}>
                    店舗詳細
                </Typography>
              </CustomGrayButton>
            </Box>
          </Box>
        ))}
      </Stack>
    </CustomCard>
  );
};

export default CustomCardNow;
