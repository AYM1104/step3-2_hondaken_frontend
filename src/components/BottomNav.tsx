// app/components/BottomNav.tsx

// 'use client' を書くことで、このファイルは「ブラウザ側（クライアント側）」で動くように指定している
'use client';

// Material UI（MUI）の部品を読み込んでいる
import {
  BottomNavigation,         // 下のナビゲーションバー
  BottomNavigationAction,   // ナビゲーションの中の1つ1つのボタン
  Paper,                    // 見た目に影をつけたりするためのコンポーネント
} from '@mui/material';

// ナビゲーションで使うアイコンたち
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SettingsIcon from '@mui/icons-material/Settings';

// Next.js の機能で、ページの移動や現在のURLを扱う
import { useRouter, usePathname } from 'next/navigation';

// Reactの機能：状態（useState）や、変化を感知する（useEffect）を使う
import { useState, useEffect } from 'react';

import SettingDrawer from './drawer/SettingDrawer'; // ← ここを追記（パスに合わせて調整）

// BottomNavコンポーネントの本体
export default function BottomNav() {
  const router = useRouter();               // ページを移動するための機能
  const pathname = usePathname();           // 今見ているページのURL（パス）
  const [value, setValue] = useState(pathname); // 今どのタブが選ばれているかの状態
  const [drawerOpen, setDrawerOpen] = useState(false); // ← Drawerの開閉状態を管理

  // ページのURLが変わったら、選ばれているタブもそれに合わせて変更する
  useEffect(() => {
    setValue(pathname);
  }, [pathname]);

  const handleChange = (_: any, newValue: string) => {
    if (newValue === 'setting') {
      setDrawerOpen(true); // settingのときはDrawerを開く
    } else {
      router.push(newValue); // 他のタブはページ遷移
    }
  };

  return (
    <>
      // 画面の一番下に固定するための見た目（Paper）を作る
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
          // onChange={(_, newValue) => {
          //   router.push(newValue);  // タブがクリックされたらそのページへ移動
          // }}
          onChange={handleChange}
          sx={{ backgroundColor: 'white' }}
        >
          {/* ナビゲーションに表示するボタンたち */}
          <BottomNavigationAction label="home" value="/" icon={<HomeIcon />} />
          <BottomNavigationAction label="検索" value="/search" icon={<SearchIcon />} />
          <BottomNavigationAction label="お気に入り" value="/favorites" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="setting" value="setting" icon={<SettingsIcon />} />
        </BottomNavigation>
      </Paper>
      {/* setting Drawer */}
      <SettingDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

