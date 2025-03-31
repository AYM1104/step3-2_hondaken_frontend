// components/checkbox/CustomYellowCheckbox.tsx
'use client';

import { Checkbox, CheckboxProps } from '@mui/material';

const CustomYellowCheckbox = (props: CheckboxProps) => {
  return (
    <Checkbox
      sx={{
        color: '#BDBDBD',
        borderRadius: '8px', // ← ここで角丸に！
        p: '4px',
        '&.Mui-checked': {
          color: '#FCC419',
        },
        '& .MuiSvgIcon-root': {
          borderRadius: '8px', // ← アイコン自体の角も丸く
          backgroundColor: '#fff',
        },
      }}
      {...props} // 外から checked, onChange など渡せるようにする
    />
  );
};

export default CustomYellowCheckbox;
