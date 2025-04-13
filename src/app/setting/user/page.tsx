'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// MUIコンポーネント
import {
  Box,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import CardContent from '@mui/material/CardContent';

// カスタムコンポーネント
import Header from '@/components/header/header';
import CustomCard from '@/components/card/CustomCard';
import BottomNav from '@/components/BottomNavigation/BottomNavigation';
import CustomYellowButton from '@/components/button/CustomYellowButton';



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

  // ユーザー情報を取得して初期値にセット
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

        // フォームの初期値として反映
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

  // 更新ボタンを押したときの処理（PUT /users/me）
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
              ユーザープロフィール
            </Typography>

            {/* フォーム */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* 姓 */}
              <Controller
                name="name_last"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="姓"
                    variant="outlined" // ← デフォルトの囲みスタイル
                    fullWidth
                    margin="normal"
                    error={!!errors.name_last}
                    helperText={errors.name_last?.message}
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
                )}
              />

              {/* 名 */}
              <Controller
                name="name_first"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="名"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!errors.name_first}
                    helperText={errors.name_first?.message}
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
                )}
              />

              {/* 性別 */}
              <Controller
                name="gender"
                control={control}
                defaultValue="男性"
                render={({ field }) => (
                  <FormControl fullWidth margin="normal" error={!!errors.gender}>
                    <InputLabel sx={{ fontSize: '0.8rem' }}>性別</InputLabel>
                    <Select
                      {...field}
                      label="性別"
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
                )}
              />

              {/* 生年月日 */}
              <Controller
                name="birthday"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="生年月日"
                    type="date"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.birthday}
                    helperText={errors.birthday?.message}
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
                )}
              />

              {/* 郵便番号 */}
              <Controller
                name="postal_code"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="郵便番号"
                    fullWidth
                    margin="normal"
                    error={!!errors.postal_code}
                    helperText={errors.postal_code?.message}
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
                )}
              />

              {/* 都道府県 */}
              <Controller
                name="prefecture"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControl fullWidth margin="normal" error={!!errors.prefecture}>
                    <InputLabel sx={{ fontSize: '0.8rem' }}>都道府県</InputLabel>
                    <Select
                      {...field}
                      label="都道府県"
                      sx={{
                        fontSize: '0.9rem',
                        borderRadius: '12px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#ccc',
                        },
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
                )}
              />

              {/* 市区町村 */}
              <Controller
                name="city"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="市区町村"
                    fullWidth
                    margin="normal"
                    error={!!errors.city}
                    helperText={errors.city?.message}
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
                )}
              />

              {/* 番地以下 */}
              <Controller
                name="address_line"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="番地以下（建物名含む）"
                    fullWidth
                    margin="normal"
                    error={!!errors.address_line}
                    helperText={errors.address_line?.message}
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
                )}
              />

              {/* 電話番号 */}
              <Controller
                name="phone_number"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="電話番号"
                    fullWidth
                    margin="normal"
                    error={!!errors.phone_number}
                    helperText={errors.phone_number?.message}
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
                )}
              />
              
              {/* メールアドレス */}
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="メールアドレス"
                    fullWidth
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email?.message}
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
                )}
              />

              {/* 更新ボタン */}
              <Box mt={3}>
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
