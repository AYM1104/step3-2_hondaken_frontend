'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Modal,
  Chip,
  IconButton,
  Button,
  Fade,
  Backdrop,
} from '@mui/material';
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HotelIcon from '@mui/icons-material/Hotel';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PetsIcon from '@mui/icons-material/Pets';
import { useRouter } from 'next/navigation';
import dayjs, { Dayjs } from 'dayjs';

interface StoreDetailModalProps {
  open: boolean;
  onClose: () => void;
  store: {
    id: number;
    name: string;
    address: string;
    imageUrl: string;
    sizeTags: string[];
    rating: number;
    reviewCount: number;
    features: string[];
    description: string;
    price: string;
  } | null;
  startTime: string;
  endTime: string;
  selectedDate: dayjs.Dayjs;
}

export default function StoreDetailModal({
  open,
  onClose,
  store,
  startTime,
  endTime,
  selectedDate,
}: StoreDetailModalProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
    }
  }, [open]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  if (!store) return null;

  const handleReserveClick = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return alert('ログインしていません');

    const year = selectedDate.year();
    const month = (selectedDate.month() + 1).toString().padStart(2, '0');
    const day = selectedDate.date().toString().padStart(2, '0');
    const baseDate = `${year}-${month}-${day}`;

    const scheduled_start_time = `${baseDate}T${startTime}:00+09:00`;
    const scheduled_end_time = `${baseDate}T${endTime}:00+09:00`;

    const payload = {
      location_id: store.id,
      scheduled_start_time,
      scheduled_end_time,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}reservations/me`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('予約エラー:', errorText);
        alert('予約に失敗しました');
        return;
      }

      alert('予約が完了しました');
      router.push('/reserve/complete');
    } catch (err) {
      console.error('通信エラー:', err);
      alert('通信エラーが発生しました');
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={visible} timeout={500}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 400,
            bgcolor: 'background.paper',
            borderRadius: 4,
            p: 3,
            boxShadow: 24,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          {/* ✕ボタン */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: 'white',
              border: '2px solid #ccc',
              width: 36,
              height: 36,
              zIndex: 10,
            }}
          >
            <CloseIcon sx={{ color: '#FCC419' }} />
          </IconButton>

          {/* 店舗画像 */}
          {store.imageUrl && (
            <Box sx={{ width: '100%', height: 180, position: 'relative', borderRadius: 2, overflow: 'hidden', mb: 2 }}>
              <Image src={store.imageUrl} alt={store.name} fill style={{ objectFit: 'cover' }} />
            </Box>
          )}

          {/* サイズタグ */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            {store.sizeTags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{ bgcolor: '#DEE2E6', color: '#212529' }}
              />
            ))}
          </Box>

          {/* 店名・住所・レビュー */}
          <Typography variant="h6" fontWeight="bold">{store.name}</Typography>
          <Typography variant="body2" color="text.secondary">{store.address}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <StarIcon sx={{ fontSize: 18, color: '#FCC419', mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {store.rating}（{store.reviewCount} レビュー）
            </Typography>
          </Box>

          {/* Facilities セクション */}
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
            Facilities
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, mb: 2, gap: 2 }}>
            {/* 各施設アイコン */}
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <AccessTimeIcon sx={{ fontSize: 36 }} />
              <Typography variant="caption" display="block">一時預かり</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <HotelIcon sx={{ fontSize: 36 }} />
              <Typography variant="caption" display="block">宿泊</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <CameraAltIcon sx={{ fontSize: 36 }} />
              <Typography variant="caption" display="block">ｶﾒﾗ見守り</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <PetsIcon sx={{ fontSize: 36 }} />
              <Typography variant="caption" display="block">ドッグラン</Typography>
            </Box>
          </Box>

          {/* 説明セクション */}
          <Typography variant="subtitle1" fontWeight="bold">Description</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {store.description}
          </Typography>

          {/* 価格と予約ボタン */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              価格 {store.price}／時間
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#FCC419',
                color: '#212529',
                borderRadius: 999,
                fontWeight: 'bold',
              }}
              onClick={handleReserveClick} // ✅ JSTで予約送信
            >
              予約する
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}