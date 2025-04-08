// このファイルは「ユーザー登録ページ」のコンポーネントです
// クライアント（ブラウザ）側で動かすことを指定
'use client';

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

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import BottomNav from '@/components/BottomNav'; // ← BottomNavの読み込み！

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();

  // DB登録のためのリクエストをバックエンドに送る
  const onSubmit = async (data: FormData) => {
    console.log('送信データ:', data);

    const payload = {
      ...data,
      birthday: data.birthday ? new Date(data.birthday).toISOString() : null,
    };

    console.log('送信Payload:', payload);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error('登録に失敗しました');
      }

      alert('登録完了！ログインページに移動します');
      router.push('/account/login');
    } catch (error) {
      console.error('登録エラー:', error);
      alert('登録に失敗しました');
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
          paddingBottom: '80px',
        }}
      >
        {/* ✅ HondaDog ロゴ（中央寄せ） */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative', width: 160, height: 44 }}>
            <Image
              src="/hondadog-logo.png"
              alt="HondaDog"
              fill
              style={{ objectFit: 'contain' }}
            />
          </Box>
        </Box>

        <Typography variant="h5" fontWeight="bold" mb={4} textAlign="center">
          ユーザー登録
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name_last"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField label="姓" fullWidth margin="normal" {...field} error={!!errors.name_last} helperText={errors.name_last?.message} />
            )}
          />

          <Controller
            name="name_first"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField label="名" fullWidth margin="normal" {...field} error={!!errors.name_first} helperText={errors.name_first?.message} />
            )}
          />

          <Controller
            name="gender"
            control={control}
            defaultValue="男性"
            render={({ field }) => (
              <FormControl fullWidth margin="normal" error={!!errors.gender}>
                <InputLabel>性別</InputLabel>
                <Select {...field} label="性別">
                  <MenuItem value="男性">男性</MenuItem>
                  <MenuItem value="女性">女性</MenuItem>
                  <MenuItem value="その他">その他</MenuItem>
                </Select>
                {errors.gender && <Typography variant="caption" color="error">{errors.gender.message}</Typography>}
              </FormControl>
            )}
          />

          <Controller
            name="birthday"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField label="生年月日" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} {...field} />
            )}
          />

          <Controller
            name="postal_code"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField label="郵便番号" fullWidth margin="normal" {...field} error={!!errors.postal_code} helperText={errors.postal_code?.message} />
            )}
          />

          <Controller
            name="prefecture"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <FormControl fullWidth margin="normal" error={!!errors.prefecture}>
                <InputLabel>都道府県</InputLabel>
                <Select {...field} label="都道府県">
                  <MenuItem value="東京都">東京都</MenuItem>
                  <MenuItem value="神奈川県">神奈川県</MenuItem>
                  <MenuItem value="千葉県">千葉県</MenuItem>
                  <MenuItem value="埼玉県">埼玉県</MenuItem>
                </Select>
                {errors.prefecture && <Typography variant="caption" color="error">{errors.prefecture.message}</Typography>}
              </FormControl>
            )}
          />

          <Controller
            name="city"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField label="市区町村" fullWidth margin="normal" {...field} error={!!errors.city} helperText={errors.city?.message} />
            )}
          />

          <Controller
            name="address_line"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField label="番地以下（建物名含む）" fullWidth margin="normal" {...field} error={!!errors.address_line} helperText={errors.address_line?.message} />
            )}
          />

          <Controller
            name="phone_number"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField label="電話番号" fullWidth margin="normal" {...field} />
            )}
          />

          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField label="メールアドレス" fullWidth margin="normal" {...field} error={!!errors.email} helperText={errors.email?.message} />
            )}
          />

          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField label="パスワード" type="password" fullWidth margin="normal" {...field} error={!!errors.password} helperText={errors.password?.message} />
            )}
          />

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

          <Box mt={10} />
        </form>
      </Box>

      <BottomNav />
    </>
  );
}
