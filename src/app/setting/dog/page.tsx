'use client';

// フォームの管理ライブラリ（React Hook Form）を読み込む
import { useForm } from 'react-hook-form';
import Image from 'next/image';
// 入力チェック用のルール（Zod）をReact Hook Formと連携させるためのやつ
import { zodResolver } from '@hookform/resolvers/zod';

// 入力ルールを書くためのライブラリ（Zod）
import * as z from 'zod';

import CardContent from '@mui/material/CardContent';

// カスタムコンポーネント
import Header from '@/components/header/header';
import CustomCard from '@/components/card/CustomCard';
import BottomNav from '@/components/BottomNavigation/BottomNavigation';
import CustomYellowButton from '@/components/button/CustomYellowButton';
import CustomGrayButton from '@/components/button/CustomGrayButton';
import CustomCheckBox from '@/components/checkbox/CustomCheckBox';


// 画面に表示する部品たち（MUI：Material UI）
import {
  TextField,
  MenuItem,
  FormControlLabel,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
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
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setter(base64); // ← プレビュー用に保存
      };
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
      {/* 入力フォーム全体 */}
      <Box
        sx={{
          minHeight: '100vh',              // 画面の高さ全体を使う
          display: 'flex',             // フレックスボックスにする
          justifyContent: 'center',    // 横方向：中央
          pb: '100px',
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
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <Header />
            </Box>

            {/* タイトル */}
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 'bold', textAlign: 'center', mt:5, mb:5, }}>          
              わんちゃんプロフィール
            </Typography>

            {/* 入力フォーム */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* 名前 */}
              <TextField
                label="名前"
                fullWidth
                margin="normal"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={{
                  fontSize: '0.9rem',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FCC419', // ← ホバー時の色を変更！
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FCC419', // ← フォーカス時の色も同じに
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.8rem',
                  },
                  '& input': {
                    fontSize: '0.8rem', // ← 入力文字サイズ
                  }
                }}
              />

              {/* サイズ */}
              <FormControl fullWidth margin="normal" error={!!errors.type}>
                <InputLabel sx={{ fontSize: '0.8rem' }}>サイズ</InputLabel>
                <Select 
                  label="サイズ" 
                  defaultValue="" 
                  {...register('type')}
                  sx={{
                    fontSize: '0.9rem',
                    borderRadius: '12px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FCC419',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FCC419',
                    },
                    '& .MuiSelect-select': {
                      fontSize: '0.8rem',
                    },
                  }}
                  >
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

              {/* 犬種 */}
              <TextField
                label="犬種"
                fullWidth
                margin="normal"
                {...register('breed')}
                error={!!errors.breed}
                helperText={errors.breed?.message}
                sx={{
                  fontSize: '0.9rem',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FCC419',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FCC419',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.8rem',
                  },
                  '& input': {
                    fontSize: '0.8rem',
                  }
                }}
              />

              {/* 誕生日 */}
              <TextField
                label="誕生日"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                {...register('birthday')}
                sx={{
                  fontSize: '0.9rem',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FCC419',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FCC419',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.8rem',
                  },
                  '& input': {
                    fontSize: '0.8rem',
                  }
                }}
              />

              {/* 体重 */}
              <TextField
                label="体重（kg）"
                placeholder="例：4.5"
                fullWidth
                margin="normal"
                {...register('weight')}
                error={!!errors.weight}
                helperText={errors.weight?.message}
                sx={{
                  fontSize: '0.9rem',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FCC419',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FCC419',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.8rem',
                  },
                  '& input': {
                    fontSize: '0.8rem',
                  }
                }}
              />

              {/* ワクチン接種済み */}
              <FormControlLabel
                sx={{ justifyContent: 'flex-start', width: '100%', ml: 0 }}
                control={
                  <CustomCheckBox
                    {...register('is_vaccinated')}
                    onChange={(e) => setValue('is_vaccinated', e.target.checked)}
                  />
                }
                label={
                  <Typography sx={{ fontSize: '0.8rem' }}>
                    ワクチン接種済み
                  </Typography>
                }
              />

              {/* 去勢・避妊済み */}
              <FormControlLabel
                sx={{ justifyContent: 'flex-start', width: '100%', ml: 0 }}
                control={
                  <CustomCheckBox
                    {...register('is_neutered')}
                    onChange={(e) => setValue('is_neutered', e.target.checked)}
                  />
                }
                label={
                  <Typography sx={{ fontSize: '0.8rem' }}>
                    去勢・避妊済み
                  </Typography>
                }
              />

              {/* ペットの写真アップロード */}
              <Box my={3}>
                {/* テキスト：左揃え */}
                <Box sx={{ textAlign: 'left', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontSize: '0.8rem' }}>
                    ペットの写真
                  </Typography>
                </Box>

                {/* ボタン：右揃え */}
                <Box sx={{ textAlign: 'right' }}>
                  {/* アップロードボタン */}
                  <label htmlFor="dog-upload">
                    <CustomGrayButton
                      component="span"
                      sx={{
                        fontSize: '0.75rem',
                        padding: '6px 12px',
                        minWidth: 'auto',
                      }}
                    >
                      写真をアップロード
                    </CustomGrayButton>
                  </label>
                  <input
                    id="dog-upload"
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setDogImage)}
                  />

                  {/* プレビュー：ボタンの外側に置く！ */}
                  {dogImage && (
                    <Box sx={{ textAlign: 'left', mt: 1 }}>
                      <Image
                        src={dogImage}
                        alt="ペット写真"
                        width={120}
                        height={120}
                        style={{ objectFit: 'cover', borderRadius: '12px' }}
                      />
                    </Box>
                  )}
                </Box>
              </Box>

          {/* ワクチン証明書アップロード */}
          <Box my={3}>
            {/* ラベル：左揃え */}
            <Box sx={{ textAlign: 'left', mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontSize: '0.8rem' }}>
                ワクチン証明書
              </Typography>
            </Box>

            {/* アップロードボタン：右揃え */}
            <Box sx={{ textAlign: 'right' }}>
              <label htmlFor="dog-upload">
                <CustomGrayButton 
                  component="label"
                  sx={{
                    fontSize: '0.75rem',        // ボタンの文字を小さく
                    padding: '6px 12px',
                    minWidth: 'auto',
                  }}
                >
                  証明書をアップロード
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setVaccineImage)}
                  />

                  {/* プレビュー：ボタンの外側に置く！ */}
                  {vaccineImage && (
                    <Box sx={{ textAlign: 'left', mt: 1 }}>
                      <Image
                        src={vaccineImage}
                        alt="証明書"
                        width={120}
                        height={120}
                        style={{ objectFit: 'cover', borderRadius: '12px' }}
                      />
                    </Box>
                  )}
                </CustomGrayButton>
              </label>
            </Box>
          </Box>


              {/* 更新ボタン */}
              <Box mt={5}>
                <CustomYellowButton
                  type="submit"
                  sx={{ width: '100%', height: '56px', fontSize: '0.9rem' }}
                >
                  更新する
                </CustomYellowButton>
              </Box>
            </form>
          </CardContent>
        </CustomCard>
      </Box>

      {/* 下部ナビゲーション */}
      <BottomNav />
    </>
  );
}