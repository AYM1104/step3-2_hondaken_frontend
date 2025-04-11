'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // ← これが必要
import { Box, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// カスタムコンポーネント
import Header from '@/components/header/header';
import CustomTab from '@/components/tab/CustomTab';
import CustomCardNow, { Store as CardStore } from '@/components/card/CustomCardNow';
import CustomTimePicker from '@/components/time/CustomTimePicker';
import CustomCheckBox from '@/components/checkbox/CustomCheckBox';
import CustomYellowButton from '@/components/button/CustomYellowButton';
import StoreDetailModal from '@/components/modal/StoreDetailModal';
import BottomNav from '@/components/BottomNavigation/BottomNavigation';

const tabLabels = ['今日', '明日'];

// CustomCardNowと共通のStore型を拡張してAPIデータ整形用に使う
interface Store extends CardStore {
  postalCode?: string;
  address: string;
  imageUrl: string;
  sizeTags: string[];
  rating: number;
  reviewCount: number;
  features: string[];
  description: string;
  price: string;
}

type LocationApiResponse = {
  id: number;
  name: string;
  prefecture: string;
  city: string;
  address_line: string;
};

export default function NowPage_withModal() {
  const router = useRouter();

  const [stores, setStores] = useState<Store[]>([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [activeTab, setActiveTab] = useState('今日');
  // チェックボックスの状態を管理
  const [checkedItems, setCheckedItems] = useState({
    snacks: false,
    walk: false,
    medicine: false,
  });

  const handleOpenModal = (store: Store) => {
    setSelectedStore(store);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStore(null);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, item: string) => {
    setCheckedItems({
      ...checkedItems,
      [item]: event.target.checked,
    });
  };

  // 店舗選択状態を切り替える関数
  const handleSelect = (id: number) => {
    setStores((prevStores) =>
      prevStores.map((store) =>
        store.id === id
          ? { ...store, isSelected: !store.isSelected }
          : store
      )
    );
  };

  const handleReserveClick = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return alert('ログインしていません');
  
    const selected = stores.find((s) => s.isSelected);
    if (!selected) return alert('店舗を選択してください');
    if (!startTime || !endTime) return alert('時間を指定してください');
  
    const jst = new Date();
    jst.setHours(jst.getHours() + 9);
    const todayStr = jst.toISOString().split('T')[0];
  
    const scheduled_start_time = `${todayStr}T${startTime}:00+09:00`;
    const scheduled_end_time = `${todayStr}T${endTime}:00+09:00`;
  
    const payload = {
      location_id: selected.id,
      scheduled_start_time,
      scheduled_end_time,
    };
  
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
  };

  useEffect(() => {
    const fetchStores = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}locations/?skip=0&limit=2`);
      const data = await res.json();
      const formatted = data.map((item: LocationApiResponse) => ({
        id: item.id,
        name: item.name,
        distance: '1km',
        duration: '5分',
        isSelected: false,
        address: `${item.prefecture}${item.city}${item.address_line}`,
        imageUrl: '/Honda-dealer.png',
        sizeTags: ['小型犬', '中型犬', '大型犬'],
        rating: 4.5,
        reviewCount: 123,
        features: [],
        description: 'スタッフによる見守りと快適な個室、広いドッグランで安心のサービスを提供します。',
        price: '500円',
        onSelect: () => {},
        onDetail: () => {},
      }));
      setStores(formatted);
    };
    fetchStores();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {/* ロゴ */}
      <Header />

      {/* タブ */}
      <Box sx={{ mt: 4 }}>
        <CustomTab tabs={tabLabels} activeTab={activeTab} onChange={setActiveTab} />
      </Box>
      {activeTab === '今日' && (
        <>

          {/* 店舗一覧 */}
          <Box sx={{ mt: 4 }}>
          <CustomCardNow
            title="店舗一覧"
            stores={stores.map((store) => ({
              ...store,
              onSelect: () => handleSelect(store.id),
              onDetail: () => handleOpenModal(store),
            }))}
          />
          </Box>

          {/* 利用時間 */}
          <Box sx={{ mt: 4 }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 'bold', mb: 1 }}>利用時間</Typography>
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
                <CustomYellowButton onClick={handleReserveClick} sx={{ height: '48px', padding: '16px 24px' ,mt: 5}}>
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

      {selectedStore && (
        <StoreDetailModal
          open={openModal}
          onClose={handleCloseModal}
          store={selectedStore}
          startTime={startTime}
          endTime={endTime}
          selectedDate={dayjs()}
        />
      )}
      <BottomNav />
    </Box>
    
  );
}
//   // 型定義
//   type LocationItem = {
//     id: string;
//     name: string;
//     distance?: string;
//     duration?: string;
//   };

//   // ルーターインスタンスを作成
//   const router = useRouter();
  
//   const [items, setItems] = useState<LocationItem[]>([]);
//   const [stores, setStores] = useState<Store[]>([]);
//   // const [dataLimit] = useState<number>(2); // 取得するデータ数を設定
//   const storeCount = 2; 
  
  // いますぐ予約ボタンをクリックしたときの処理
  // const handleReserveClick = () => {
  //   router.push('/reserve/complete');
  // };

  // 上記を以下に修正（もっちゃん）
  

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}locations/?skip=0&limit=${storeCount}`);
//         if (!response.ok) {
//           throw new Error(`Fetch failed: ${response.status}`);
//         }
  
//         const data = await response.json();
  
//         if (!Array.isArray(data)) {
//           console.error("配列ではないデータが返ってきました:", data);
//           return;
//         }
  
//         setItems(data);
//         console.log("取得したitems:", data);
//       } catch (error) {
//         console.error("店舗情報の取得に失敗しました:", error);
//       }
//     };
  
//     fetchItems();
//   }, [storeCount]);

    



  

  

//   const [activeTab, setActiveTab] = useState('今日');
//   const [startTime, setStartTime] = useState<string>("");
//   const [endTime, setEndTime] = useState<string>("");
//   // // const [checked, setChecked] = useState(false);

//   // ダイアログ用ステート
//   const [openFacilityId, setOpenFacilityId] = useState<string | null>(null)
//   const handleCloseDialog = () => setOpenFacilityId(null)

//   return (
//     <Box sx={{ p: 2 }}>
//       <Header />

//       {/* タブ */}
//       <Box sx={{ mt: 4 }}>
//         <CustomTab
//           tabs={tabLabels}
//           activeTab={activeTab}
//           onChange={(newIndex) => setActiveTab(newIndex)}
//         />
//       </Box>

//       {/* タブに応じたコンテンツ */}
//       <Box sx={{ mt: 4, px: 2 }}>
//         {activeTab === '今日' && (
//           <>
//             {/* 店舗一覧 */}
//             <CustomCardNow title="店舗一覧" stores={stores} />

//             {/* 利用時間 */}
//             <Box sx={{ mt: 4 }}>
//               <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, fontSize: '0.8rem' }}>
//                 利用時間
//               </Typography>

//               <LocalizationProvider dateAdapter={AdapterDayjs}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                   <CustomTimePicker value={startTime} onChange={setStartTime} />
//                   <Typography>〜</Typography>
//                   <CustomTimePicker value={endTime} onChange={setEndTime} />
//                 </Box>
//               </LocalizationProvider>
//             </Box>

            
     
      

//         {activeTab === '明日' && <Typography>おむかえ予約の内容をここに表示</Typography>}
//       </Box>
//       {/* ダイアログ表示部分 */}
//       {openFacilityId && (
//         <FacilityDialog
//           open={!!openFacilityId}
//           onClose={handleCloseDialog}
//           facilityId={openFacilityId}
//         />
//       )}
//     </Box>
//   );
// }
