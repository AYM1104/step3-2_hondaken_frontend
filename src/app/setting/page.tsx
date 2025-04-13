// このファイルは「愛犬プロフィール登録ページ」を作るコンポーネントです
// ブラウザ側で動かすよ！という宣言
'use client';

// フォームの管理ライブラリ（React Hook Form）を読み込む
import { useForm } from 'react-hook-form';

// 入力チェック用のルール（Zod）をReact Hook Formと連携させるためのやつ
import { zodResolver } from '@hookform/resolvers/zod';

// 入力ルールを書くためのライブラリ（Zod）
import * as z from 'zod';

// ✅ 下部ナビ（BottomNav）を読み込み
import BottomNav from '@/components/BottomNavigation/BottomNavigation';

import Header from '@/components/header/header';

// 画面に表示する部品たち（MUI：Material UI）
import {
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  Avatar,
} from '@mui/material';

import { useState } from 'react';

// ---------------------------
// 入力ルールをZodで定義する
// ---------------------------
const schema = z.object({
  name: z.string().min(1, '名前は必須です'),
  type: z.enum(['超小型', '小型', '中型', '大型'], {
    required_error: 'サイズを選択してください',
  }),
  breed: z.string().min(1, '犬種は必須です'),
  birthday: z.string(),
  weight: z.string().refine(
    (val) => !isNaN(parseFloat(val)),
    '体重は数値で入力してください'
  ),
  is_vaccinated: z.boolean().optional(),
  is_neutered: z.boolean().optional(),
});

// 入力データの型を自動で作る（TypeScript用）
type FormData = z.infer<typeof schema>;

// ---------------------------
// ページ本体
// ---------------------------
export default function DogRegisterPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      is_vaccinated: false,
      is_neutered: false,
    },
  });

  const [dogImage, setDogImage] = useState<string | null>(null);
  const [vaccineImage, setVaccineImage] = useState<string | null>(null);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    const transformed = {
      ...data,
      weight: parseFloat(data.weight),
      birthday: data.birthday ? new Date(data.birthday).toISOString() : null,
    };

    // ✅ JWTトークンを取得
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('ログインしていません');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}dogs/me`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transformed),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('登録失敗:', errorText);
        alert('登録に失敗しました');
        return;
      }

      alert('登録完了！');
    } catch (err) {
      console.error('通信エラー:', err);
      alert('通信エラーが発生しました');
    }
  };

  return (
    <>
      {/* メインの登録フォーム */}
      <Box
        maxWidth="500px"
        mx="auto"
        p={4}
        boxShadow={3}
        borderRadius={3}
        bgcolor="#fff"
        sx={{
          // ✅ BottomNavと被らないように下部余白を追加
          paddingBottom: '80px',
        }}
      >
        {/* ✅ HondaDog ロゴ（中央寄せ） */}
        <Header />

        {/* タイトル */}
        <Typography
          variant="h5"
          fontWeight="bold"
          mb={4}
          sx={{ textAlign: 'center' }}
        >
          愛犬プロフィール登録
        </Typography>

        {/* 入力フォーム */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="名前"
            fullWidth
            margin="normal"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <FormControl fullWidth margin="normal" error={!!errors.type}>
            <InputLabel>サイズ</InputLabel>
            <Select label="サイズ" defaultValue="" {...register('type')}>
              <MenuItem value="超小型">超小型</MenuItem>
              <MenuItem value="小型">小型</MenuItem>
              <MenuItem value="中型">中型</MenuItem>
              <MenuItem value="大型">大型</MenuItem>
            </Select>
            {errors.type && (
              <Typography variant="caption" color="error">
                {errors.type.message}
              </Typography>
            )}
          </FormControl>
          <TextField
            label="犬種"
            fullWidth
            margin="normal"
            {...register('breed')}
            error={!!errors.breed}
            helperText={errors.breed?.message}
          />
          <TextField
            label="誕生日"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            {...register('birthday')}
          />
          <TextField
            label="体重（kg）"
            placeholder="例：4.5"
            fullWidth
            margin="normal"
            {...register('weight')}
            error={!!errors.weight}
            helperText={errors.weight?.message}
          />
          <FormControlLabel
            control={
              <Checkbox
                {...register('is_vaccinated')}
                onChange={(e) => setValue('is_vaccinated', e.target.checked)}
              />
            }
            label="ワクチン接種済み"
          />
          <FormControlLabel
            control={
              <Checkbox
                {...register('is_neutered')}
                onChange={(e) => setValue('is_neutered', e.target.checked)}
              />
            }
            label="去勢・避妊済み"
          />

          {/* ペットの写真アップロード */}
          <Box my={3}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              ペットの写真
            </Typography>
            {dogImage && (
              <Avatar
                src={dogImage}
                alt="pet"
                sx={{ width: 120, height: 120, mb: 1 }}
              />
            )}
            <Button
              variant="outlined"
              component="label"
              sx={{
                color: '#FFD369',
                borderColor: '#FFD369',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(255, 211, 105, 0.1)',
                  borderColor: '#FFD369',
                },
              }}
            >
              写真をアップロード
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleImageChange(e, setDogImage)}
              />
            </Button>
          </Box>

          {/* ワクチン証明書アップロード */}
          <Box my={3}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              ワクチン証明書
            </Typography>
            {vaccineImage && (
              <Avatar
                src={vaccineImage}
                alt="vaccine"
                sx={{ width: 120, height: 120, mb: 1 }}
              />
            )}
            <Button
              variant="outlined"
              component="label"
              sx={{
                color: '#FFD369',
                borderColor: '#FFD369',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(255, 211, 105, 0.1)',
                  borderColor: '#FFD369',
                },
              }}
            >
              証明書をアップロード
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleImageChange(e, setVaccineImage)}
              />
            </Button>
          </Box>

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
        </form>
      </Box>

      {/* ✅ 最後にBottomNav追加（固定表示） */}
      <BottomNav />
    </>
  );
}
