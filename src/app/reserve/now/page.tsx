'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import Header from '@/components/header/header';
import CustomTab from '@/components/tab/CustomTab';
import CustomCardNow from '@/components/card/CustomCardNow';
import CustomTimePicker from '@/components/time/CustomTimePicker';
import CustomCheckBox from '@/components/checkbox/CustomCheckBox';
import CustomYellowButton from '@/components/button/CustomYellowButton';
import FacilityDialog from '@/components/dialog/FacilityDialog';
import BottomNav from '@/components/BottomNav';

import type { Store } from '@/components/card/CustomCardNow';

const tabLabels = ['今日', '明日'];

export default function NowPage() {
  const router = useRouter();

  type LocationItem = {
    id: string;
    name: string;
    distance?: string;
    duration?: string;
  };

  const [items, setItems] = useState<LocationItem[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [openFacilityId, setOpenFacilityId] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState({
    snacks: false,
    walk: false,
    medicine: false,
  });
  const [activeTab, setActiveTab] = useState('今日');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const storeCount = 2;

  const handleSelect = (id: string) => {
    setStores((prev) =>
      prev.map((store) =>
        store.id === id ? { ...store, isSelected: !store.isSelected } : store
      )
    );
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, item: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [item]: event.target.checked,
    }));
  };

  const handleCloseDialog = () => setOpenFacilityId(null);

  // 店舗データを取得
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}locations/?skip=0&limit=${storeCount}`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('店舗データが配列ではありません');
        setItems(data);
      } catch (err) {
        console.error('店舗取得エラー:', err);
      }
    };
    fetchItems();
  }, [storeCount]);

  // 店舗データをStore形式に整形
  useEffect(() => {
    const formatted = items.map((item) => ({
      id: item.id,
      name: item.name,
      distance: item.distance || '不明',
      duration: item.duration || '不明',
      isSelected: false,
      onSelect: () => handleSelect(item.id),
      onDetail: () => setOpenFacilityId(item.id),
    }));
    setStores(formatted);
  }, [items]);

  // ✅ JST時間で予約を送信
  const handleReserveClick = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return alert('ログインしていません');

    const selected = stores.find((s) => s.isSelected);
    if (!selected) return alert('店舗を選択してください');
    if (!startTime || !endTime) return alert('時間を指定してください');

    // JSTの現在日付を取得
    const jst = new Date();
    jst.setHours(jst.getHours() + 9); // UTC→JST補正
    const todayStr = jst.toISOString().split('T')[0];

    // JSTの時間として予約送信
    const scheduled_start_time = `${todayStr}T${startTime}:00+09:00`;
    const scheduled_end_time = `${todayStr}T${endTime}:00+09:00`;

    const payload = {
      location_id: selected.id,
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
        const errorMsg = await res.text();
        console.error('予約登録失敗:', errorMsg);
        alert('予約登録に失敗しました');
        return;
      }

      alert('予約完了！');
      router.push('/reserve/complete');
    } catch (err) {
      console.error('通信エラー:', err);
      alert('通信エラーが発生しました');
    }
  };

  return (
    <>
      <Box sx={{ p: 2, paddingBottom: '80px' }}>
        <Header />
        <Box sx={{ mt: 4 }}>
          <CustomTab tabs={tabLabels} activeTab={activeTab} onChange={setActiveTab} />
        </Box>

        <Box sx={{ mt: 4, px: 2 }}>
          {activeTab === '今日' && (
            <>
              <CustomCardNow title="店舗一覧" stores={stores} />

              <Box sx={{ mt: 4 }}>
                <Typography fontWeight="bold" fontSize="0.8rem" mb={1}>
                  利用時間
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <CustomTimePicker value={startTime} onChange={setStartTime} />
                    <Typography>〜</Typography>
                    <CustomTimePicker value={endTime} onChange={setEndTime} />
                  </Box>
                </LocalizationProvider>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <CustomYellowButton onClick={handleReserveClick} sx={{ height: '48px', px: 4 }}>
                  <Typography fontWeight={600}>いますぐ予約する</Typography>
                </CustomYellowButton>
              </Box>
            </>
          )}

          {activeTab === '明日' && <Typography>おむかえ予約の内容をここに表示</Typography>}
        </Box>

        {openFacilityId && (
          <FacilityDialog
            open={!!openFacilityId}
            onClose={handleCloseDialog}
            facilityId={openFacilityId}
          />
        )}
      </Box>

      <BottomNav />
    </>
  );
}
