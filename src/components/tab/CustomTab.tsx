// components/tab/CustomTabs.tsx
'use client';

import { Tabs, Tab, Box } from '@mui/material';

interface Props {
  tabs: string[];
  activeTab: number;
  onChange: (newIndex: number) => void;
}

const CustomTabs = ({ tabs, activeTab, onChange }: Props) => {
  return (
    <Box sx={{ borderBottom: '1px solid #E0E0E0' }}>
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => onChange(newValue)}
        centered
        TabIndicatorProps={{
          style: {
            backgroundColor: '#FCC419', // 黄色い下線
            height: '3px',
          },
        }}
        sx={{
          minHeight: '48px',
          '& .MuiTab-root': {
            color: '#ADB5BD', // 非アクティブ時の色
            fontWeight: 400,
            minHeight: '48px',
          },
          '& .Mui-selected': {
            color: '#212529', // アクティブ時の色
            fontWeight: 600,
          },
        }}
      >
        {tabs.map((label, index) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>
    </Box>
  );
};

export default CustomTabs;