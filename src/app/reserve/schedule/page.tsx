'use client';

import React from 'react';
import CustomCardSchedule from '@/components/card/CustomCardSchedule';

export default function CompletePage() {
  const store = {
    name: 'Honda Cars 埼玉 草加店',
    postalCode: '〒340-0036',
    address: '埼玉県草加市苗塚町562',
    imageUrl: '/Hondadealer.png',
  };

  return (
    <div style={{ padding: '24px' }}>
      <CustomCardSchedule
        store={store}
        onClickDetails={() => console.log('詳細クリック')}
      />
    </div>
  );
}
