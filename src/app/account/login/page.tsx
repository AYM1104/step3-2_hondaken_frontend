// このファイルは「ログインページ」のコンポーネントです
// クライアント（ブラウザ）側で動かすことを指定
'use client';

// MUIコンポーネント
import CardContent from '@mui/material/CardContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import EmailIcon from '@mui/icons-material/Email';
import FormControl from '@mui/material/FormControl';

// カスタムコンポーネント
import CustomCard from '@/components/card/CustomCard';
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
               // メールのアイコン
import LockIcon from '@mui/icons-material/Lock';                 // 鍵マーク
import GoogleIcon from '@mui/icons-material/Google';             // Googleのアイコン
import FacebookIcon from '@mui/icons-material/Facebook';         // Facebookのアイコン

// Reactの状態管理（useState）を使う
import { useState } from 'react';

// ✅ 下部ナビゲーション（共通メニュー）
// import BottomNav from '@/components/BottomNav'; // ← 共通のナビゲーションバー
import { useRouter } from 'next/navigation';
import Header from '@/components/header/header';


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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!res.ok) throw new Error('ログイン失敗');
  
      const data = await res.json();
      console.log('ログイン成功', data);
  
      // ログイン成功後に /mypage へ遷移
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

          {/* ボタン */}
          <Box mt={3}>
          <CustomYellowButton
            onClick={handleLogin}
            sx={{ width: '100%' }}
          >
            login
          </CustomYellowButton>
          </Box>

          {/* サインアップに誘導 */}




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


    


    // <Box
    //   sx={{
    //     maxWidth: 600,                    // 横幅の最大値
    //     mx: 'auto',                       // 横中央に配置
    //     px: 3, py: 6,                     // 内側余白
    //     minHeight: '100dvh',             // 画面全体の高さを確保
    //     display: 'flex',
    //     flexDirection: 'column',
    //     justifyContent: 'center',        // 縦方向に中央寄せ
    //     bgcolor: '#fccccc',                 // 背景色を白に
    //     paddingBottom: '80px',           // 下部ボタンの分の余白
    //   }}
    // >
    //   <Header />





        
  
        
        // <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
        //   Sign In
        // </Typography>

        
          // <FormControl fullWidth margin="normal">
          //   <Box mb={2}>
              {/* メールアドレス*/}
            //   <OutlinedInput
            //     placeholder="メールアドレス"
            //     value={email}
            //     onChange={(e) => setEmail(e.target.value)}
            //     startAdornment={
            //       <InputAdornment position="start">
            //         <EmailIcon />
            //       </InputAdornment>
            //     }
            //   />
            // </Box>

            {/* パスワード */}
            // <OutlinedInput
            //   type={showPassword ? 'text' : 'password'}
            //   placeholder="Password"
            //   value={password}
            //   onChange={(e) => setPassword(e.target.value)}
            //   startAdornment={
            //     <InputAdornment position="start">
            //       <LockIcon />
            //     </InputAdornment>
            //   }
            //   endAdornment={
            //     <InputAdornment position="end">
            //       <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
            //         {showPassword ? <VisibilityOff /> : <Visibility />}
            //       </IconButton>
            //     </InputAdornment>
            //   }
            // />
            {/* ログインボタン */}
        //     <CustomYellowButton onClick={handleLogin}>login</CustomYellowButton>
        //   </FormControl>
        // </Box>
        
        
    //     {/* 区切り線と文字 */}
    //     <Divider sx={{ my: 4 }}>Or signup with</Divider>

    //     {/* SNSログインボタン（GoogleとFacebook） */}
    //     <Box display="flex" justifyContent="center" gap={4}>
    //       <IconButton>
    //         <GoogleIcon sx={{ fontSize: 36 }} />
    //       </IconButton>
    //       <IconButton>
    //         <FacebookIcon sx={{ fontSize: 36 }} />
    //       </IconButton>
    //     </Box>
    // </Box>
  //   );
  // }

      {/* 画面中央に配置された箱 */}
      {/* <Box
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
      > */}
        

        {/* タイトル（ログイン） */}
        {/* <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
          Sign In
        </Typography> */}

        {/* メールアドレス入力欄 */}
        {/* <TextField
          fullWidth
          margin="normal"
          placeholder="アドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
        /> */}

        {/* <TextField
          fullWidth
          margin="normal"
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        /> */}

        {/* ログインボタン */}
        {/* <CustomYellowButton onClick={handleLogin}>login</CustomYellowButton> */}







        {/* <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          sx={{
            mt: 3,
            py: 1.5,
            borderRadius: '999px',
            backgroundColor: '#FFD369',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1rem',
            '&:hover': { backgroundColor: '#f9c748' },
          }}
        >
          ログイン
        </Button> */}

        {/* 区切り線と文字 */}
        {/* <Divider sx={{ my: 4 }}>Or signup with</Divider> */}

        {/* SNSログインボタン（GoogleとFacebook） */}
        {/* <Box display="flex" justifyContent="center" gap={4}>
          <IconButton>
            <GoogleIcon sx={{ fontSize: 36 }} />
          </IconButton>
          <IconButton>
            <FacebookIcon sx={{ fontSize: 36 }} />
          </IconButton>
        </Box> */}
      

      {/* 共通の下部ナビゲーションバー
      <BottomNav /> */}
      {/* </Box> */}
    // 
//   );
// }
