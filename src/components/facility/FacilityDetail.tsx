// components/facility/FacilityDetail.tsx
import { Box, Typography, Stack, Chip } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import StarIcon from '@mui/icons-material/Star'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import HotelIcon from '@mui/icons-material/Hotel'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import PetsIcon from '@mui/icons-material/Pets'
import CustomCard from '@/components/card/CustomCard'
import CustomYellowButton from '@/components/button/CustomYellowButton'

export default function FacilityDetail({ id }: { id: string }) {
  // TODO: idに応じたデータを取得する（今は仮）

  return (
    <Box p={2}>
        <CustomCard>
        {/* 施設画像 */}
        <Box sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
            <img
                src="https://plus.unsplash.com/premium_photo-1661877049198-e81833f96f6d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3MjAxN3wwfDF8c2VhcmNofDEwNXx8cGV0JTIwaG90ZWx8ZW58MHx8fHwxNzQzNTIyMTQ1fDA&ixlib=rb-4.0.3&q=85&q=85&fmt=jpg&crop=entropy&cs=tinysrgb&w=450"
                alt="施設の画像"
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
            Honda Cars 埼玉 草加店
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
            <LocationOnIcon fontSize="small" />
            <Typography sx={{ fontSize: '0.6rem' }}>埼玉県草加市</Typography>
            <StarIcon sx={{ color: '#FCC419', ml: 1 }} />
            <Typography sx={{ fontSize: '0.6rem' }}>4.5 (999 レビュー)</Typography>
        </Stack>

        {/* Facilities */}
        <Typography sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
            Facilities
        </Typography>
        <Stack direction="row" spacing={4} mt={2} justifyContent="center">
        <Box display="flex" flexDirection="column" alignItems="center">
            <AccessTimeIcon fontSize="large" />
            <Typography sx={{ fontSize: '0.5rem', mt: 0.5 }}>一時預かり</Typography>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center">
            <HotelIcon fontSize="large" />
            <Typography sx={{ fontSize: '0.5rem', mt: 0.5 }}>宿泊</Typography>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center">
            <CameraAltIcon fontSize="large" />
            <Typography sx={{ fontSize: '0.5rem', mt: 0.5 }}>カメラ見守り</Typography>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center">
            <PetsIcon fontSize="large" />
            <Typography sx={{ fontSize: '0.5rem', mt: 0.5 }}>ドッグラン</Typography>
        </Box>
        </Stack>

        {/* Description */}
        <Typography mt={3} fontWeight="bold">
            Description
        </Typography>
        <Typography sx={{ fontSize: '0.6rem' }}>
            冷暖房完備の個室、スタッフによる見守り、広々ドッグランなど、
            わんちゃんがリラックスして過ごせる環境を整えています。
        </Typography>

        {/* 価格とボタン */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mt={4}>
            <Typography sx={{ fontSize: '0.6rem' }}>価格 ¥500 / 時間</Typography>
            <Box width={160}>
            <CustomYellowButton>
                <Typography sx={{ fontSize: '0.6rem', fontWeight: 600 }}>
                    いますぐ予約する
                </Typography>
            </CustomYellowButton>
            </Box>
        </Stack>
        </CustomCard>
    </Box>
  )
}