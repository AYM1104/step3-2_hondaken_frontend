// app/components/BottomNav.tsx
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

// MUIコンポーネント
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SettingsIcon from '@mui/icons-material/Settings';

// カスタムコンポーネント
import SettingDrawer from '../drawer/SettingDrawer'; 


export default function BottomNav() {
  const router = useRouter();               // ページを移動するための機能
  const pathname = usePathname();           // 今見ているページのURL（パス）
  const [value, setValue] = useState(pathname); // 今どのタブが選ばれているかの状態
  const [drawerOpen, setDrawerOpen] = useState(false); // ← Drawerの開閉状態を管理

  // ページのURLが変わったら、選ばれているタブもそれに合わせて変更する
  useEffect(() => {
    setValue(pathname);
  }, [pathname]);

  // ボトムナビゲーションの選択に応じて処理を分ける関数（「検索」「お気に入り」はページ先が存在しないのでコメントアウト）
  const handleNavigationChange = (_: React.SyntheticEvent, newValue: string) => {
    if (newValue === 'home') {
      router.push('/mypage'); // ホーム
    // } else if (newValue === 'search') {
    //   router.push('/search'); // 検索
    // } else if (newValue === 'favorites') {
    //   router.push('/favorites'); // お気に入り
    } else if (newValue === 'setting') {
      setDrawerOpen(true); // 設定はDrawerを開く
    }
  };

  return (
    <>
      {/* 画面の一番下に固定するための見た目（Paper）を作る */}
      <Paper
        sx={{
          position: 'fixed',        // 固定表示にする
          bottom: 0,                // 下端にぴったりつける
          left: 0, right: 0,        // 左右いっぱいに広げる
          borderTop: '1px solid #ddd', // 上に薄い線をつける
          zIndex: 1000,             // 前面に出す（重なり順）
        }}
        elevation={3}               // 影の深さ（見た目の立体感）
      >
        {/* 実際のナビゲーションバー部分 */}
        <BottomNavigation
          showLabels                 // ラベル（文字）を常に表示する
          value={value}             // 今選ばれているタブ
          onChange={handleNavigationChange}
          sx={{ backgroundColor: 'white', height: 64, }}
        >
          {/* ホーム */}
          <BottomNavigationAction
            label="ホーム"
            value="home"
            icon={<HomeIcon />}
            sx={{ minWidth: 70, '& .MuiBottomNavigationAction-label': { fontSize: '0.6rem' } }}
          />

          {/* 検索 */}
          <BottomNavigationAction
            label="検索"
            value="search"
            icon={<SearchIcon />}
            sx={{ minWidth: 70, '& .MuiBottomNavigationAction-label': { fontSize: '0.6rem' } }}
          />

          {/* お気に入り */}
          <BottomNavigationAction
            label="お気に入り"
            value="favorites"
            icon={<FavoriteIcon />}
            sx={{ minWidth: 70, '& .MuiBottomNavigationAction-label': { fontSize: '0.6rem' } }}
          />

          {/* 設定 */}
          <BottomNavigationAction
            label="設定"
            value="setting"
            icon={<SettingsIcon />}
            sx={{ minWidth: 70, '& .MuiBottomNavigationAction-label': { fontSize: '0.6rem' } }}
          />
        </BottomNavigation>
      </Paper>

      {/* setting Drawer */}
      <SettingDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

