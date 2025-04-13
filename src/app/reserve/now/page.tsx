'use client'; // App Router対応のクライアントコンポーネント宣言

import { useState, useEffect } from 'react'; // Reactのフック（状態管理、初期化）
import { useRouter } from 'next/navigation'; // Next.jsの画面遷移用フック
import { Box, Typography } from '@mui/material'; // UIレイアウトとテキスト表示
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; // 日付系コンポーネント用プロバイダー
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; // Dayjsで日付を扱うためのアダプター
import dayjs from 'dayjs'; // 日付操作ライブラリ
import timezone from 'dayjs/plugin/timezone'; // タイムゾーン用プラグイン（拡張が必要）
import utc from 'dayjs/plugin/utc'; // UTC用プラグイン（拡張が必要）

// カスタムコンポーネント（MUIのButtonやCardなどをプロジェクト用にラップしたもの）
import Header from '@/components/header/header';
import CustomTab from '@/components/tab/CustomTab';
import CustomCardNow, { Store as CardStore } from '@/components/card/CustomCardNow';
import CustomTimePicker from '@/components/time/CustomTimePicker';
import CustomCheckBox from '@/components/checkbox/CustomCheckBox';
import CustomYellowButton from '@/components/button/CustomYellowButton';
import StoreDetailModal from '@/components/modal/StoreDetailModal';
import FacilityDialog from '@/components/dialog/FacilityDialog'; // 施設の詳細情報を表示するためのカスタムダイアログコンポーネント
import BottomNav from '@/components/BottomNavigation/BottomNavigation';
import type { Store } from '@/components/card/CustomCardNow'; // Storeの型
import type { StoreDetailModalProps } from '@/components/modal/StoreDetailModal'; // モーダルの型

dayjs.extend(utc); // UTCプラグインを有効化
dayjs.extend(timezone); // タイムゾーンプラグインを有効化（←これをしないと .tz() が使えない）

const tabLabels = ['今日', '明日']; // タブの表示内容

export default function NowPage() {
  const router = useRouter(); // ページ遷移に使う

  type LocationItem = {
    id: string;
    name: string;
    distance?: string;
    duration?: string;
  };

  const [items, setItems] = useState<LocationItem[]>([]); // 距離や所要時間（未使用）
  const [stores, setStores] = useState<Store[]>([]); // 店舗リストの状態
  const [openFacilityId, setOpenFacilityId] = useState<string | null>(null); // モーダル表示中の店舗ID
  const [checkedItems, setCheckedItems] = useState({
    snacks: false,
    walk: false,
    medicine: false,
  }); // チェックボックスの状態
  const [activeTab, setActiveTab] = useState('今日'); // 表示中のタブ
  const [startTime, setStartTime] = useState<string>(''); // 開始時間
  const [endTime, setEndTime] = useState<string>(''); // 終了時間
  const storeCount = 2; // 表示する店舗の数

  // 店舗の選択状態を切り替える
  const handleSelect = (id: string) => {
    setStores((prev) =>
      prev.map((store) =>
        store.id === Number(id) ? { ...store, isSelected: !store.isSelected } : store
      )
    );
  };

  // チェックボックスのON/OFFを切り替え
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, item: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [item]: event.target.checked,
    }));
  };

  // モーダルを閉じる処理
  const handleCloseDialog = () => setOpenFacilityId(null);

  // 店舗一覧の取得処理（APIから）
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}locations/?skip=0&limit=${storeCount}`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('店舗データが配列ではありません');

        const enriched = await Promise.all(
          data.map(async (item: any) => {
            let imageUrl = '/Honda-dealer.png'; // 初期画像（取得失敗時）
            try {
              const imgRes = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}locations/${item.id}/image`);
              const imgData = await imgRes.json();
              imageUrl = imgData.image_url;
              console.log('📦 店舗:', item.name, '画像URL:', imageUrl);
            } catch (err) {
              console.error('画像取得エラー:', err);
            }

            return {
              id: item.id,
              name: item.name,
              distance: '1km',
              duration: '5分',
              isSelected: false,
              address: `${item.prefecture}${item.city}${item.address_line}`, // 住所の整形
              imageUrl,
              sizeTags: ['超小型犬','小型犬', '中型犬', '大型犬'], // 固定データ
              rating: 4.5,
              reviewCount: 123,
              features: [],
              description: 'スタッフによる見守りと快適な個室、広いドッグランで安心のサービスを提供します。',
              price: '500円',
              onSelect: () => handleSelect(item.id),
              onDetail: () => setOpenFacilityId(item.id),
            };
          })
        );

        setStores(enriched);
      } catch (err) {
        console.error('店舗取得エラー:', err);
      }
    };

    fetchStores(); // 初回のみ実行
  }, [storeCount]);

  // 予約ボタン押下時の処理
  const handleReserveClick = async () => {
    const token = localStorage.getItem('access_token'); // 認証トークン取得
    if (!token) return alert('ログインしていません');

    const selected = stores.find((s) => s.isSelected); // 選択された店舗
    if (!selected) return alert('店舗を選択してください');
    if (!startTime || !endTime) return alert('時間を指定してください');

    const todayStr = dayjs().tz('Asia/Tokyo').format('YYYY-MM-DD'); // 日本時間の日付
    const scheduled_start_time = `${todayStr}T${startTime}`;
    const scheduled_end_time = `${todayStr}T${endTime}`;

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
      router.push('/reserve/complete'); // 完了ページへ移動
    } catch (err) {
      console.error('通信エラー:', err);
      alert('通信エラーが発生しました');
    }
  };

  // モーダルに渡す店舗データ
  const selectedStore: Store | null =
    stores.find((s) => s.id === Number(openFacilityId)) || null;

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

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography>おやつ</Typography>
                  <CustomCheckBox
                    checked={checkedItems.snacks}
                    onChange={(e) => handleChange(e, 'snacks')}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography>おさんぽ</Typography>
                  <CustomCheckBox
                    checked={checkedItems.walk}
                    onChange={(e) => handleChange(e, 'walk')}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography>おくすり</Typography>
                  <CustomCheckBox
                    checked={checkedItems.medicine}
                    onChange={(e) => handleChange(e, 'medicine')}
                  />
                </Box>
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

        {/* モーダル表示 */}
        {openFacilityId && selectedStore && (
          <StoreDetailModal
            open
            onClose={handleCloseDialog}
            store={selectedStore}
            startTime={startTime}
            endTime={endTime}
            selectedDate={dayjs()}
          />
        )}
      </Box>

      <BottomNav /> {/* 画面下のナビゲーションバー */}
    </>
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
