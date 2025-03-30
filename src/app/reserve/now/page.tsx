'use client';

import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import CustomTab from '@/components/tab/CustomTab';
import CustomCardNow from '@/components/card/CustomCardNow';
import CustomCardHome from '@/components/card/CustomCardHome';


const tabLabels = ['今日', '明日'];

export default function NowPage() {
  const [activeTab, setActiveTab] = useState('今日');

  return (
    <Box sx={{ p: 2 }}>
      {/* タイトル */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        いますぐ予約する
      </Typography>

      {/* タブ */}
      <Box sx={{ mt: 4 }}>
        <CustomTab
          tabs={tabLabels}
          activeTab={activeTab}
          onChange={(newIndex) => setActiveTab(newIndex)}
        />
      </Box>

      {/* タブに応じたコンテンツ */}
      <Box sx={{ mt: 4, px: 2 }}>
        {activeTab === '今日' && (
          <CustomCardNow
            title="いますぐ利用可能な店舗"
            stores={[
              {
                id: '1',
                name: 'Honda Cars 埼玉 草加店',
                distance: '1km',
                duration: '5m',
                isSelected: true,
                onSelect: () => alert('選択1'),
                onDetail: () => alert('詳細1'),
              },
              {
                id: '2',
                name: 'Honda Cars 埼玉 新越谷店',
                distance: '3km',
                duration: '15m',
                isSelected: false,
                onSelect: () => alert('選択2'),
                onDetail: () => alert('詳細2'),
              },
            ]}
          />
        )}
        {activeTab === '明日' && <Typography>おむかえ予約の内容をここに表示</Typography>}
      </Box>
    </Box>
  );
}
