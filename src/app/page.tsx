import Image from 'next/image';
import { Box } from '@mui/material';

export default function Page() {
  return (
    <Box sx={{ width: '100%', height: '400px', position: 'relative' }}>
      {/* グレーBoxに画像を敷き詰める */}
      <Box
        sx={{
          width: '100%',
          height: '400px',
          borderBottomLeftRadius: '100% 35%',
          borderBottomRightRadius: '100% 35%',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1615751072497-5f5169febe17?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3MjAxN3wwfDF8c2VhcmNofDUwfHxkb2d8ZW58MHx8fHwxNzQzMzA2NDk0fDA&ixlib=rb-4.0.3&q=85&fmt=jpg&crop=entropy&cs=tinysrgb&w=450"
          alt="Dog"
          fill
          style={{
            objectFit: 'cover',
          }}
        />
      </Box>
    </Box>
  );
}
