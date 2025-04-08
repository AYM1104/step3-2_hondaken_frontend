// このファイルは「ログインページ」のコンポーネントです
// クライアント（ブラウザ）側で動かすことを指定
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// MUIコンポーネント
import CardContent from '@mui/material/CardContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import EmailIcon from '@mui/icons-material/Email';
import FormControl from '@mui/material/FormControl';

// カスタムコンポーネント
import CustomCard from '@/components/card/CustomCard';
import Header from '@/components/header/header';
import CustomYellowButton from '@/components/button/CustomYellowButton';


// UI（見た目）の部品をMaterial UIからインポート
import {
  Box,               // レイアウト用の箱
  Typography,        // 見出しやテキスト
  Divider,           // 線で区切る
  IconButton,        // アイコン付きのボタン
} from '@mui/material';

// アイコンたち（目のマーク、メール、鍵、SNSなど）
import { Visibility, VisibilityOff } from '@mui/icons-material'; // パスワード表示・非表示
import LockIcon from '@mui/icons-material/Lock';                 // 鍵マーク
import GoogleIcon from '@mui/icons-material/Google';             // Googleのアイコン
import FacebookIcon from '@mui/icons-material/Facebook';         // Facebookのアイコン


// ----------------------
// コンポーネント本体
// ----------------------
export default function LoginPage() {
  // パスワードの表示・非表示を切り替えるための状態
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  // ログイン時の処理
  const handleLogin = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('ログイン失敗');

      const data = await res.json();
      console.log('ログイン成功', data);

      // ✅ JWTトークン保存
      localStorage.setItem('access_token', data.access_token);

      // ✅ マイページへ遷移
      router.push('/mypage');
    } catch (error) {
      console.error('ログインエラー:', error);
      alert('ログインに失敗しました');
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',             // 画面の高さ全体を使う
        display: 'flex',             // フレックスボックスにする
        justifyContent: 'center',    // 横方向：中央
        alignItems: 'center',        // 縦方向：中央
      }}
    >
      <CustomCard
        sx={{
          maxWidth: 600,
          mx: 'auto',
          mt: 8,
          height: 'auto',
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Header />
          <Typography variant="h6" fontWeight="bold" textAlign="center" mb={3}>
            ホンダドッグへようこそ
          </Typography>
          {/* メールアドレス */}
          <FormControl fullWidth margin="normal">
            <OutlinedInput
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              }
              fullWidth
              sx={{ borderRadius: '12px' }}
            />
          </FormControl>

          {/* パスワード */}
          <FormControl fullWidth margin="normal">
            <OutlinedInput
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              fullWidth
              sx={{ borderRadius: '12px' }}
            />
          </FormControl>

          {/* ログインボタン + 新規登録ボタン */}
          <Box mt={3}>
            <CustomYellowButton
              onClick={handleLogin}
              sx={{ width: '100%' }}
            >
              login
            </CustomYellowButton>

            <Box mt={2}>
              <CustomYellowButton
                onClick={() => router.push('/account/register')}
                sx={{ width: '100%' }}
              >
                新規登録
              </CustomYellowButton>
            </Box>
          </Box>

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
        </CardContent>
      </CustomCard>
    </Box>
  );
}
