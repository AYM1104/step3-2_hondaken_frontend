'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// MUIコンポーネント
import CardContent from '@mui/material/CardContent';
import EmailIcon from '@mui/icons-material/Email';
import { Box, Typography, Divider, IconButton } from '@mui/material';
import { FormControl, OutlinedInput, InputAdornment, FormHelperText } from '@mui/material';
import { Snackbar, Alert } from '@mui/material';

// MUIコンポーネント（アイコン）
import { Visibility, VisibilityOff } from '@mui/icons-material'; // パスワード表示・非表示
import LockIcon from '@mui/icons-material/Lock';                 // 鍵マーク
import GoogleIcon from '@mui/icons-material/Google';             // Googleのアイコン
import FacebookIcon from '@mui/icons-material/Facebook';         // Facebookのアイコン

// カスタムコンポーネント
import CustomCard from '@/components/card/CustomCard';
import Header from '@/components/header/header';
import CustomYellowButton from '@/components/button/CustomYellowButton';

// ----------------------
// コンポーネント本体
// ----------------------
export default function LoginPage() {

  // メールアドレスの状態を管理
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  
  // エラーメッセージの状態を管理
  const [loginError, setLoginError] = useState('');




  // パスワードの表示・非表示を切り替えるための状態
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  const router = useRouter();

  // ログインボタンが押された時の処理
  const handleLogin = async () => {

    // メールアドレスの入力チェック
    if (!email) {
      // 空白の場合
      setEmailError('メールアドレスを入力してください');
      return; 
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      // メール形式が正しくない場合
      setEmailError('正しい形式のメールアドレスを入力してください');
      return; 
    } else {
      // エラーがなければクリアしておく
      setEmailError('');
    }

    // パスワードの入力チェック
    if (!password) {
      // 空白の場合
      setEmailError('パスワードを入力してください');
      return; 
    }
    
    // 入力内容に問題なければ、ログイン処理を実行
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

      // JWTトークン保存
      localStorage.setItem('access_token', data.access_token);

      // マイページへ遷移
      router.push('/mypage');
    } catch (error) {
      console.error('ログインエラー:', error);
      setLoginError('メールアドレスまたはパスワードが間違っています');
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
            maxWidth: 350,
            mx: 'auto',
            textAlign: 'center',
            height: 'auto',
          }}
      >
          <CardContent sx={{ p: 0 }}>
              {/* ロゴ */}
              <Header />

              {/* welcomeメッセージ */}
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 'bold', textAlign: 'center', mt:5, mb:5, }}>          
                  ホンダドッグへようこそ
              </Typography>

              {/* メールアドレス */}
              <FormControl fullWidth margin="normal" error={!!emailError}>
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
                      sx={{
                          borderRadius: '12px',
                          fontSize: '0.9rem',
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#FCC419', // ← フォーカス時の色
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#FCC419', // ホバー時も同じにしたいなら
                          }
                      }}
                      // placeholderの文字サイズを調整
                      inputProps={{
                          style: { fontSize: '0.7rem' } 
                      }}
                  />
                  {emailError && (
                      <FormHelperText>{emailError}</FormHelperText>
                  )}
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
                      sx={{
                          borderRadius: '12px',
                          fontSize: '0.9rem',
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#FCC419', // ← フォーカス時の色（例：iOSブルー）
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#FCC419', // ホバー時も同じにしたいなら
                          }
                      }}
                      // placeholderの文字サイズを調整
                      inputProps={{
                          style: { fontSize: '0.7rem' } 
                      }}
                  />
              </FormControl>

              {/* ログインボタン */}
              <Box mt={3}>
                  <CustomYellowButton
                    onClick={handleLogin}
                    sx={{ width: '100%', height: '56px', fontSize: '0.9rem' }}
                  >
                    login
                  </CustomYellowButton>
              </Box>

              {/* 区切り線と文字 */}
              <Divider sx={{ my: 4, fontSize: '0.7rem' }}>Or signup with</Divider>

              {/* SNSログインボタン（GoogleとFacebook） */}
              <Box display="flex" justifyContent="center" gap={4}>
                <IconButton>
                  <GoogleIcon sx={{ fontSize: 36 }} />
                </IconButton>
                <IconButton>
                  <FacebookIcon sx={{ fontSize: 36 }} />
                </IconButton>
              </Box>


              <Box mt={3}>
                <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary', }}>
                  はじめてご利用の方は、
                  <Link href="/account/register" passHref>
                    <Typography
                      component="span"
                      sx={{
                        fontSize: '0.6rem',
                        color: '#FCC419',           // リンクカラー（必要に応じて変更OK）
                        textDecoration: 'underline', // 下線あり（お好みで）
                        cursor: 'pointer',
                        ml: 0.5,
                      }}
                    >
                      こちらから
                    </Typography>
                  </Link>
                </Typography>
              </Box>
          </CardContent>
      </CustomCard>
      <Snackbar
        open={!!loginError}
        autoHideDuration={4000}
        onClose={() => setLoginError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setLoginError('')} severity="error" sx={{ width: '100%' }}>
          {loginError}
        </Alert>
      </Snackbar>
    </Box>
    
  );
}
