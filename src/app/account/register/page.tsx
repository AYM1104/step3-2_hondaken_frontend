// このファイルは「ユーザー登録ページ」のコンポーネントです
// クライアント（ブラウザ）側で動かすことを指定
'use client';

// React Hook Form というフォーム管理ライブラリ
import { useForm } from 'react-hook-form';

// Zod のバリデーションルールを React Hook Form につなぐためのもの
import { zodResolver } from '@hookform/resolvers/zod';

// Zod を使って、入力ルール（バリデーション）を定義する
import * as z from 'zod';

// ✅ これが必要（下部ナビゲーション）
import BottomNav from '@/components/BottomNav'; // ← BottomNavの読み込みを追加！

// UIパーツ（Material UI）を読み込む
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';


import { useEffect, useState } from 'react';
import Image from 'next/image';

// ----------------------
// 入力のルールをZodで定義
// ----------------------
const schema = z.object({
  name_last: z.string().min(1, '姓は必須です'),
  name_first: z.string().min(1, '名は必須です'),
  gender: z.enum(['男性', '女性', 'その他']),
  birthday: z.string(),
  postal_code: z.string().length(7, '郵便番号は7桁で入力してください'),
  prefecture: z.string().min(1, '都道府県を選択してください'),
  city: z.string().min(1, '市区町村は必須です'),
  address_line: z.string().min(1, '番地以下を入力してください'),
  phone_number: z.string(),
  email: z.string().email('正しいメール形式で入力してください'),
  password: z.string().min(6, '6文字以上のパスワードにしてください'),
});

// TypeScript用：このフォームに入力されるデータの型
type FormData = z.infer<typeof schema>;

// ----------------------
// コンポーネント本体
// ----------------------
export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    setValue,  // setValue を useForm から取得
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });






// ユーザー情報を保存するための状態（State）
const [userData, setUserData] = useState<FormData | null>(null);

const userId = 1;  // ここでuserIdを1に指定

// ユーザー情報をAPIから取得
useEffect(() => {
  const fetchUserData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}users/${userId}`);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Fetch failed: ${response.status} - ${text}`);
      }
      const data = await response.json();
      setUserData(data);
      console.log('Fetched user data:', data);
      // 生年月日をYYYY-MM-DD形式に変換
      const formattedBirthday = new Date(data.birthday).toLocaleDateString('en-CA');
      // 取得したデータをフォームにセット
      setValue('name_last', data.name_last);
      setValue('name_first', data.name_first);
      setValue('gender', data.gender);
      setValue('birthday', formattedBirthday);
      setValue('postal_code', data.postal_code);
      setValue('prefecture', data.prefecture);
      setValue('city', data.city);
      setValue('address_line', data.address_line);
      setValue('phone_number', data.phone_number);
      setValue('email', data.email);
    } catch (error) {
      console.error('エラーが発生しました:', error);
      alert('ユーザー情報の取得中にエラーが発生しました');
    }
  };

  fetchUserData();
}, [userId, setValue]);
 




  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      alert('登録完了！');
    } else {
      alert('エラーが発生しました');
    }
  };

  return (
    <>
      {/* 登録フォーム全体のラップ */}
      <Box
        component="main"
        sx={{
          maxWidth: 500,
          mx: 'auto',
          px: 2,
          py: 4,
          minHeight: '100vh',
          bgcolor: '#fff',
          boxSizing: 'border-box',
          overflowY: 'auto',

          // ✅ BottomNavが被らないように下部余白を追加
          paddingBottom: '80px',
        }}
      >
        {/* ✅ HondaDog ロゴ（中央寄せ） */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Image
            src="/hondadog-logo.png"
            alt="HondaDog"
            style={{
              height: 50,
              objectFit: 'contain',
            }}
          />
        </Box>

        {/* タイトル */}
        <Typography
          variant="h5"
          fontWeight="bold"
          mb={4}
          sx={{ textAlign: 'center' }}
        >
          ユーザー登録
        </Typography>

        {/* 入力フォーム */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* 姓 */}
          <TextField
            label="姓"
            fullWidth
            margin="normal"
            {...register('name_last')}
            value={userData?.name_last || ''} // データがあれば表示し、なければ空文字を表示
            error={!!errors.name_last}
            helperText={errors.name_last?.message}
          />

          {/* 名 */}
          <TextField
            label="名"
            fullWidth
            margin="normal"
            {...register('name_first')}
            value={userData?.name_first || ''} // データがあれば表示し、なければ空文字を表示
            error={!!errors.name_first}
            helperText={errors.name_first?.message}
          />

          {/* 性別 */}
          <FormControl fullWidth margin="normal" error={!!errors.gender}>
            <InputLabel>性別</InputLabel>
            <Select defaultValue="" {...register('gender')} label="性別">
              <MenuItem value="男性">男性</MenuItem>
              <MenuItem value="女性">女性</MenuItem>
              <MenuItem value="その他">その他</MenuItem>
            </Select>
            {errors.gender && (
              <Typography variant="caption" color="error">
                {errors.gender.message}
              </Typography>
            )}
          </FormControl>

          {/* 生年月日 */}
          <TextField
            label="生年月日"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            {...register('birthday')}
          />

          {/* 郵便番号 */}
          <TextField
            label="郵便番号"
            fullWidth
            margin="normal"
            {...register('postal_code')}
            value={userData?.postal_code || ''} // データがあれば表示し、なければ空文字を表示
            error={!!errors.postal_code}
            helperText={errors.postal_code?.message}
          />

          {/* 都道府県 */}
          <FormControl fullWidth margin="normal" error={!!errors.prefecture}>
            <InputLabel>都道府県</InputLabel>
            <Select defaultValue="" {...register('prefecture')} label="都道府県">
              <MenuItem value="東京都">東京都</MenuItem>
              <MenuItem value="神奈川県">神奈川県</MenuItem>
              <MenuItem value="千葉県">千葉県</MenuItem>
              <MenuItem value="埼玉県">埼玉県</MenuItem>
            </Select>
            {errors.prefecture && (
              <Typography variant="caption" color="error">
                {errors.prefecture.message}
              </Typography>
            )}
          </FormControl>

          {/* 市区町村 */}
          <TextField
            label="市区町村"
            fullWidth
            margin="normal"
            {...register('city')}
            value={userData?.city || ''} // データがあれば表示し、なければ空文字を表示
            error={!!errors.city}
            helperText={errors.city?.message}
          />

          {/* 番地以下 */}
          <TextField
            label="番地以下（建物名含む）"
            fullWidth
            margin="normal"
            {...register('address_line')}
            value={userData?.address_line || ''} // データがあれば表示し、なければ空文字を表示
            error={!!errors.address_line}
            helperText={errors.address_line?.message}
          />

          {/* 電話番号 */}
          <TextField
            label="電話番号"
            fullWidth
            margin="normal"
            {...register('phone_number')}
            value={userData?.phone_number || ''} // データがあれば表示し、なければ空文字を表示
          />

          {/* メールアドレス */}
          <TextField
            label="メールアドレス"
            fullWidth
            margin="normal"
            {...register('email')}
            value={userData?.email || ''} // データがあれば表示し、なければ空文字を表示
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          {/* パスワード */}
          <TextField
            label="パスワード"
            type="password"
            fullWidth
            margin="normal"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          {/* 登録ボタン */}
          <Button
            type="submit"
            fullWidth
            sx={{
              mt: 3,
              borderRadius: '999px',
              py: 1.5,
              backgroundColor: '#FFD369',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: '#f9c748',
              },
            }}
          >
            登録する
          </Button>

          {/* 下に少しスペースを入れる */}
          <Box mt={10} />
        </form>
      </Box>

      {/* ✅ 最後にBottomNavを追加！ */}
      <BottomNav />
    </>
  );
}

