// このファイルは「ログインページ」のコンポーネントです
// クライアント（ブラウザ）側で動かすことを指定
'use client';

// UI（見た目）の部品をMaterial UIからインポート
import {
  Box,               // レイアウト用の箱
  TextField,         // 入力欄
  Typography,        // 見出しやテキスト
  Button,            // ボタン
  InputAdornment,    // 入力欄のアイコンをつけるための機能
  Divider,           // 線で区切る
  IconButton,        // アイコン付きのボタン
} from '@mui/material';

// アイコンたち（目のマーク、メール、鍵、SNSなど）
import { Visibility, VisibilityOff } from '@mui/icons-material'; // パスワード表示・非表示
import EmailIcon from '@mui/icons-material/Email';               // メールのアイコン
import LockIcon from '@mui/icons-material/Lock';                 // 鍵マーク
import GoogleIcon from '@mui/icons-material/Google';             // Googleのアイコン
import FacebookIcon from '@mui/icons-material/Facebook';         // Facebookのアイコン

// Reactの状態管理（useState）を使う
import { useState } from 'react';

// ✅ 下部ナビゲーション（共通メニュー）
import BottomNav from '@/components/BottomNav'; // ← 共通のナビゲーションバー

// ----------------------
// コンポーネント本体
// ----------------------
export default function LoginPage() {
  // パスワードの表示・非表示を切り替えるための状態
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {/* 画面中央に配置された箱 */}
      <Box
        sx={{
          maxWidth: 400,                    // 横幅の最大値
          mx: 'auto',                       // 横中央に配置
          px: 3, py: 6,                     // 内側余白
          minHeight: '100dvh',             // 画面全体の高さを確保
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',        // 縦方向に中央寄せ
          bgcolor: '#fff',                 // 背景色を白に
          paddingBottom: '80px',           // ✅ 下部ボタンの分の余白
        }}
      >
        {/* ✅ ロゴ画像（中央寄せ） */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <img
            src="/hondadog-logo.png"
            alt="HondaDog"
            style={{
              height: 50,
              objectFit: 'contain',
            }}
          />
        </Box>

        {/* タイトル（ログイン） */}
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
          ログイン
        </Typography>

        {/* メールアドレス入力欄 */}
        <TextField
          fullWidth
          margin="normal"
          placeholder="アドレス"
          InputProps={{
            startAdornment: (
              // 入力欄の先頭にメールのアイコンを表示
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* パスワード入力欄 */}
        <TextField
          fullWidth
          margin="normal"
          type={showPassword ? 'text' : 'password'} // パスワード表示切り替え
          placeholder="Password"
          InputProps={{
            startAdornment: (
              // 鍵マークを表示
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            ),
            endAdornment: (
              // 目のアイコンで表示・非表示を切り替えられるようにする
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* ログインボタン */}
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            py: 1.5,
            borderRadius: '999px',     // 丸い形にする
            backgroundColor: '#FFD369',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1rem',
            '&:hover': { backgroundColor: '#f9c748' },
          }}
        >
          ログイン
        </Button>

        {/* 区切り線と文字 */}
        <Divider sx={{ my: 4 }}>Or signup with</Divider>

        {/* SNSログインボタン（GoogleとFacebook） */}
        <Box display="flex" justifyContent="center" gap={4}>
          <IconButton>
            <GoogleIcon sx={{ fontSize: 36 }} />
          </IconButton>
          <IconButton>
            <FacebookIcon sx={{ fontSize: 36 }} />
          </IconButton>
        </Box>
      </Box>

      {/* ✅ 共通の下部ナビゲーションバー */}
      <BottomNav />
    </>
  );
}
