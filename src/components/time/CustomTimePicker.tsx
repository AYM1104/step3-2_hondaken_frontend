import { TextField } from '@mui/material';

type Props = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  sx?: React.CSSProperties;
};

export default function CustomTimePicker({ label, value, onChange, sx }: Props) {
  return (
    <TextField
      type="time"
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      variant="standard" // 下線のみにする
      inputProps={{ step: 300 }} // 5分刻み
      InputLabelProps={{ shrink: true }}
      sx={{
        '& .MuiInputBase-root': {
          backgroundColor: '#fff',
          borderRadius: '8px', // 角丸
          fontSize: '1rem',
        },
        '& .MuiInput-underline:before': {
          borderBottom: '2px solid #ccc', // 下線の色
        },
        '& .MuiInput-underline:after': {
          borderBottom: '2px solid #FCC419', // フォーカス時の下線色
        },
        ...sx, // 親コンポーネントからのスタイル受け渡し
      }}
    />
  );
}
