import { Box, Typography } from '@mui/material';

interface Props {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
}

const CustomTabSwitcher = ({ tabs, activeTab, onChange }: Props) => {
  return (
    <Box display="flex" justifyContent="center" gap={4} sx={{ py: 2 }}>
      {tabs.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <Box
            key={tab}
            onClick={() => onChange(tab)}
            sx={{
              flex: 1, // 横幅いっぱいに広げる
              textAlign: 'center', // 中央寄せ
              cursor: 'pointer',
              borderBottom: isActive ? '2px solid #FCC419' : '2px solid transparent',
              color: isActive ? '#212529' : '#ADB5BD',
              fontWeight: isActive ? 600 : 400,
              pb: 0.5,
            }}
          >
            <Typography>{tab}</Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default CustomTabSwitcher;
