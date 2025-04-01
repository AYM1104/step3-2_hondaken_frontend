// components/dialog/FacilityDialog.tsx
'use client';

import Dialog from '@mui/material/Dialog';
import FacilityDetail from '../facility/FacilityDetail';

type Props = {
  open: boolean;
  onClose: () => void;
  facilityId: string;
};

export default function FacilityDialog({ open, onClose, facilityId }: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <FacilityDetail id={facilityId} />
    </Dialog>
  );
}