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
import BottomNav from '@/components/BottomNavigation/BottomNavigation';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// ✅ 入力ルールをZodで定義（バリデーションチェックのため）
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

// ✅ TypeScript型をスキーマから生成（フォームの型定義）
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // ✅ ユーザー情報を取得して初期値にセット
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('ユーザー情報取得に失敗しました');

        const user = await res.json();
        console.log('取得したユーザー情報:', user);

        // ✅ フォームの初期値として反映
        setValue('name_last', user.name_last);
        setValue('name_first', user.name_first);
        setValue('gender', user.gender);
        setValue('birthday', user.birthday?.split('T')[0]);
        setValue('postal_code', user.postal_code);
        setValue('prefecture', user.prefecture);
        setValue('city', user.city);
        setValue('address_line', user.address_line);
        setValue('phone_number', user.phone_number);
        setValue('email', user.email);
        setValue('password', user.password); // ※パスワードがハッシュでない前提
      } catch (err) {
        console.error('ユーザー取得エラー:', err);
      }
    };

    fetchUser();
  }, [setValue]);

  // ✅ 更新ボタンを押したときの処理（PUT /users/me）
  const onSubmit = async (data: FormData) => {
    const token = localStorage.getItem('access_token');
    if (!token) return alert('ログインしていません');

    // 誕生日をISO形式に整形して送信
    const payload = {
      ...data,
      birthday: data.birthday ? new Date(data.birthday).toISOString() : null,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('更新に失敗しました');

      alert('更新しました');
      router.push('/mypage');
    } catch (error) {
      console.error('更新エラー:', error);
      alert('更新に失敗しました');
    }
  };

  return (
    <>
      {/* ✅ 入力フォーム全体 */}
      <Box component="main" sx={{
        maxWidth: 500,
        mx: 'auto',
        px: 2,
        py: 4,
        minHeight: '100vh',
        bgcolor: '#fff',
        paddingBottom: '80px',
      }}>
        {/* ✅ ロゴ表示 */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative', width: 160, height: 44 }}>
            <Image src="/hondadog-logo.png" alt="HondaDog" fill style={{ objectFit: 'contain' }} />
          </Box>
        </Box>

        <Typography variant="h5" fontWeight="bold" mb={4} textAlign="center">
          ユーザー情報
        </Typography>

        {/* ✅ ユーザー情報フォーム */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* 各フィールドをreact-hook-formで管理 */}

          {/* 姓 */}
          <Controller name="name_last" control={control} defaultValue="" render={({ field }) => (
            <TextField label="姓" fullWidth margin="normal" {...field} error={!!errors.name_last} helperText={errors.name_last?.message} />
          )} />

          {/* 名 */}
          <Controller name="name_first" control={control} defaultValue="" render={({ field }) => (
            <TextField label="名" fullWidth margin="normal" {...field} error={!!errors.name_first} helperText={errors.name_first?.message} />
          )} />

          {/* 性別 */}
          <Controller name="gender" control={control} defaultValue="男性" render={({ field }) => (
            <FormControl fullWidth margin="normal" error={!!errors.gender}>
              <InputLabel>性別</InputLabel>
              <Select {...field} label="性別">
                <MenuItem value="男性">男性</MenuItem>
                <MenuItem value="女性">女性</MenuItem>
                <MenuItem value="その他">その他</MenuItem>
              </Select>
              {errors.gender && <Typography variant="caption" color="error">{errors.gender.message}</Typography>}
            </FormControl>
          )} />

          {/* 生年月日 */}
          <Controller name="birthday" control={control} defaultValue="" render={({ field }) => (
            <TextField label="生年月日" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} {...field} />
          )} />

          {/* 郵便番号 */}
          <Controller name="postal_code" control={control} defaultValue="" render={({ field }) => (
            <TextField label="郵便番号" fullWidth margin="normal" {...field} error={!!errors.postal_code} helperText={errors.postal_code?.message} />
          )} />

          {/* 都道府県 */}
          <Controller name="prefecture" control={control} defaultValue="" render={({ field }) => (
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
          )} />

          {/* 市区町村 */}
          <Controller name="city" control={control} defaultValue="" render={({ field }) => (
            <TextField label="市区町村" fullWidth margin="normal" {...field} error={!!errors.city} helperText={errors.city?.message} />
          )} />

          {/* 番地以下 */}
          <Controller name="address_line" control={control} defaultValue="" render={({ field }) => (
            <TextField label="番地以下（建物名含む）" fullWidth margin="normal" {...field} error={!!errors.address_line} helperText={errors.address_line?.message} />
          )} />

          {/* 電話番号 */}
          <Controller name="phone_number" control={control} defaultValue="" render={({ field }) => (
            <TextField label="電話番号" fullWidth margin="normal" {...field} />
          )} />

          {/* メールアドレス */}
          <Controller name="email" control={control} defaultValue="" render={({ field }) => (
            <TextField label="メールアドレス" fullWidth margin="normal" {...field} error={!!errors.email} helperText={errors.email?.message} />
          )} />

          {/* ✅ 更新ボタン */}
          <Button type="submit" fullWidth sx={{
            mt: 3,
            borderRadius: '999px',
            py: 1.5,
            backgroundColor: '#FFD369',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1rem',
            '&:hover': { backgroundColor: '#f9c748' },
          }}>
            更新する
          </Button>
        </form>
      </Box>

      {/* ✅ 下部ナビゲーション */}
      <BottomNav />
    </>
  );
}
