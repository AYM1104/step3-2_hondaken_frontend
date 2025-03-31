'use client';

import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import CustomTab from '@/components/tab/CustomTab';
import CustomCardNow from '@/components/card/CustomCardNow';

import CustomTimePicker from '@/components/time/CustomTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

import CustomCheckBox from '@/components/checkbox/CustomCheckBox';


const tabLabels = ['今日', '明日'];


export default function NowPage() {
  const [activeTab, setActiveTab] = useState('今日');
  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs('2022-04-17T09:00'));
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs('2022-04-17T17:00'));
  const [checked, setChecked] = useState(false);

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
          <>
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

            {/* 利用時間セクション */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                利用時間
              </Typography>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CustomTimePicker label="開始時間" value={startTime} onChange={setStartTime} />
                  <Typography>〜</Typography>
                  <CustomTimePicker label="終了時間" value={endTime} onChange={setEndTime} />
                </Box>
              </LocalizationProvider>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                オプション
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between', // ← テキストとチェックボックスを左右に配置
                  alignItems: 'center',            // ← 上下を中央に揃える
                  px: 2,
                  py: 1,
                }}
              >
                <Typography>おやつ</Typography>

                <CustomCheckBox
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                />
              </Box>
            </Box>
          </>
        )}

        {activeTab === '明日' && <Typography>おむかえ予約の内容をここに表示</Typography>}
      </Box>
    </Box>
  );
}
