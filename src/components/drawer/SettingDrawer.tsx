'use client';

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PetsIcon from '@mui/icons-material/Pets';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';

type Props = {
  open: boolean;
  onClose: () => void;
};

const SettingDrawer: React.FC<Props> = ({ open, onClose }) => {
  const router = useRouter();

  const handleLogout = () => {
    // ログアウト処理
    console.log('ログアウト');
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div style={{ width: 250, padding: 16 }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => router.push('/setting/user')}>
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="ユーザープロフィール" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => router.push('/setting/dog')}>
              <ListItemIcon><PetsIcon /></ListItemIcon>
              <ListItemText primary="わんちゃんプロフィール" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText
                primary="ログアウト"
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export default SettingDrawer;
