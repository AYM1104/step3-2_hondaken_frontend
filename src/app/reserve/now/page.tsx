'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

//　カスタムコンポーネント
import CustomTab from '@/components/tab/CustomTab';
import CustomCardNow from '@/components/card/CustomCardNow';
import CustomTimePicker from '@/components/time/CustomTimePicker';
import CustomCheckBox from '@/components/checkbox/CustomCheckBox';
import CustomYellowButton from '@/components/button/CustomYellowButton';
import FacilityDialog from '@/components/dialog/FacilityDialog';


const tabLabels = ['今日', '明日'];

export default function NowPage() {
  const [items, setItems] = useState<any[]>([]);
  const [dataLimit, setDataLimit] = useState<number>(2); // 取得するデータ数を設定

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // API 呼び出しでデータ数を制限（ここでは dataLimit をクエリパラメータとして指定）
        const response = await axios.get(`http://127.0.0.1:8000/locations?limit=${dataLimit}`);
        const fetchedItems = response.data;
        // コンソールログでデータを表示
        console.log('取得したデータ:', fetchedItems);
        // 取得したデータを状態にセット
        setItems(fetchedItems);
      } catch (error) {
        console.error('データ取得に失敗しました:', error);
      }
    };
    fetchItems(); // コンポーネントがマウントされた時にデータを取得
  }, [dataLimit]); // dataLimit が変更された場合に再取得

 
  // 店舗情報を格納した配列
  const [stores, setStores] = useState<any[]>([]);

  useEffect(() => {
    const fetchedStores = items.map((item: any) => ({
      id: item.id,
      name: item.name,
      distance: item.distance || '不明',
      duration: item.duration || '不明',
      isSelected: false,
      onSelect: () => handleSelect(item.id),
      onDetail: () => alert(`${item.name}の詳細`),
    }));
    setStores(fetchedStores);
  }, [items]);

  // チェックボックスの状態を管理
  const [checkedItems, setCheckedItems] = useState({
    snacks: false,
    walk: false,
    medicine: false,
  });

  // 店舗選択状態を切り替える関数
  const handleSelect = (id: string) => {
    setStores((prevStores) =>
      prevStores.map((store) =>
        store.id === id
          ? { ...store, isSelected: !store.isSelected } // 選択状態を切り替え
          : store
      )
    );
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, item: string) => {
    setCheckedItems({
      ...checkedItems,
      [item]: event.target.checked,
    });
  };

  const [activeTab, setActiveTab] = useState('今日');
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [checked, setChecked] = useState(false);

  // ダイアログ用ステート
  const [openFacilityId, setOpenFacilityId] = useState<string | null>(null)
  const handleCloseDialog = () => setOpenFacilityId(null)

  return (
    <Box sx={{ p: 2 }}>
      {/* タイトル */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        いますぐ予約する
      </Typography>

      {/* タブ */}
      <Box sx={{ mt: 4 }}>
        <CustomTab
          tabs={tabLabels}
          activeTab={activeTab}
          onChange={(newIndex) => setActiveTab(newIndex)}
        />
      </Box>

      {/* タブに応じたコンテンツ */}
      <Box sx={{ mt: 4, px: 2 }}>
        {activeTab === '今日' && (
          <>
            {/* 店舗一覧 */}
            <CustomCardNow title="店舗一覧" stores={stores} />

            {/* 利用時間 */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, fontSize: '0.8rem' }}>
                利用時間
              </Typography>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CustomTimePicker value={startTime} onChange={setStartTime} />
                  <Typography>〜</Typography>
                  <CustomTimePicker value={endTime} onChange={setEndTime} />
                </Box>
              </LocalizationProvider>
            </Box>

            {/* オプション */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, fontSize: '0.8rem' }}>
                オプション
              </Typography>

              <Box
                sx={{ display: 'flex', justifyContent: 'space-between',        alignItems: 'center' }}
              >
                <Typography>おやつ</Typography>
                <CustomCheckBox
                  checked={checkedItems.snacks}
                  onChange={(e) => handleChange(e, 'snacks')}
                />
              </Box>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between',        alignItems: 'center' }}
              >
                <Typography>おさんぽ</Typography>
                <CustomCheckBox
                  checked={checkedItems.walk}
                  onChange={(e) => handleChange(e, 'walk')}
                />
              </Box>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between',        alignItems: 'center' }}
              >
                <Typography>おくすり</Typography>
                <CustomCheckBox
                  checked={checkedItems.medicine}
                  onChange={(e) => handleChange(e, 'medicine')}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <CustomYellowButton sx={{ height: '48px', padding: '16px 24px' ,mt: 5}}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>
                      いますぐ予約する
                    </Typography>
                  </Box>
                </CustomYellowButton>
              </Box>
            </Box>
          </>
        )}

        {activeTab === '明日' && <Typography>おむかえ予約の内容をここに表示</Typography>}
      </Box>
      {/* ダイアログ表示部分 */}
      {openFacilityId && (
        <FacilityDialog
          open={!!openFacilityId}
          onClose={handleCloseDialog}
          facilityId={openFacilityId}
        />
      )}
    </Box>
  );
}
