import { useEffect, useState } from 'react';
import { Box, Typography, Stack, Chip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HotelIcon from '@mui/icons-material/Hotel';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PetsIcon from '@mui/icons-material/Pets';
import CustomYellowButton from '@/components/button/CustomYellowButton';
import Image from 'next/image';

type Props = {
  id: string;
};

type Facility = {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
  description: string;
  pricePerHour: number;
};

export default function FacilityDetail({ id }: Props) {
  const [facility, setFacility] = useState<Facility | null>(null);

  useEffect(() => {
    const fetchFacility = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}locations/${id}`);
        const data = await res.json();
        setFacility(data);
      } catch (error) {
        console.error('施設情報の取得に失敗しました:', error);
      }
    };

    fetchFacility();
  }, [id]);

  if (!facility) {
    return <Typography>読み込み中...</Typography>;
  }

  return (
    <Box>
        {/* 施設画像 */}
        <Box   
          sx={{
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 24, // 左下だけ角丸
            borderBottomRightRadius: 24, // 右下だけ角丸
            overflow: 'hidden',
            mb: 2,
        }}
        >
          <Image
            src={facility.imageUrl || '/Hondadealer.png'}
            alt="店舗の画像"
            width={800}
            height={450}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </Box>

        {/* 犬のサイズチップ */}
        <Stack direction="row" spacing={1} mb={1}>
          <Chip label="小型犬" />
          <Chip label="中型犬" />
          <Chip label="大型犬" />
        </Stack>

        {/* 店舗名・場所・評価 */}
        <Typography sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
          {facility.name}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <LocationOnIcon fontSize="small" />
          <Typography sx={{ fontSize: '0.6rem' }}>{facility.address}</Typography>
          <StarIcon sx={{ color: '#FCC419', ml: 1 }} />
          <Typography sx={{ fontSize: '0.6rem' }}>
            {facility.rating} ({facility.reviewCount} レビュー)
          </Typography>
        </Stack>

        {/* Facilities */}
        <Typography sx={{ fontSize: '1rem', fontWeight: 'bold', ml: 1}}>Facilities</Typography>
        <Stack direction="row" spacing={4} mt={2} justifyContent="center" sx={{ px: 2 }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <AccessTimeIcon fontSize="medium" />
            <Typography sx={{ fontSize: '0.5rem', mt: 0.5 }}>一時預かり</Typography>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center">
            <HotelIcon fontSize="medium" />
            <Typography sx={{ fontSize: '0.5rem', mt: 0.5 }}>宿泊</Typography>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center">
            <CameraAltIcon fontSize="medium" />
            <Typography sx={{ fontSize: '0.5rem', mt: 0.5 }}>カメラ見守り</Typography>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center">
            <PetsIcon fontSize="medium" />
            <Typography sx={{ fontSize: '0.5rem', mt: 0.5 }}>ドッグラン</Typography>
          </Box>
        </Stack>

        {/* Description */}
        <Typography sx={{ fontSize: '1rem', fontWeight: 'bold', ml: 1}}>Description</Typography>
        <Typography sx={{ fontSize: '0.6rem' }}>{facility.description}</Typography>

        {/* 価格とボタン */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mt={4}>
          <Typography sx={{ fontSize: '0.6rem', ml: 1 }}>
            価格 ¥{facility.pricePerHour} / 時間
          </Typography>
          <Box
            sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                pr: 1, // 8pxのpadding-right
            }}
            >
            <CustomYellowButton>
                <Typography sx={{ fontSize: '0.6rem', fontWeight: 600 }}>
                いますぐ予約する
                </Typography>
            </CustomYellowButton>
            </Box>
        </Stack>
    </Box>
  );
}