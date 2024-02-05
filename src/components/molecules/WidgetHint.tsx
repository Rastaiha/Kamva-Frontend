import { Box, Chip } from '@mui/material';
import { Help as HelpIcon } from '@mui/icons-material';
import React, { FC, useState } from 'react';

import HelpDialog from 'components/organisms/dialogs/FSMStateHelpDialog';

type WidgetHintPropsType = {
  hints: any[],
}

const WidgetHint: FC<WidgetHintPropsType> = ({ hints }) => {
  const [openViewHintDialog, setViewHintDialog] = useState(false);
  const [hasClickedHintDialog, setClickedHintDialog] = useState(false);

  return (
    <>
      <Box sx={{ position: 'absolute', right: -20, top: -10, rotate: '-24deg' }}>
        <Chip
          size='small'
          color='secondary'
          sx={{
            color: 'white',
            opacity: 0.4,
            animation: !hasClickedHintDialog ? "starred 15s infinite" : 'none',
            ":hover": { opacity: 1, animation: 'none' },
          }}
          onClick={() => { setViewHintDialog(true); setClickedHintDialog(true); }}
          icon={<HelpIcon fontSize='small' />}
          label="راهنمایی" />
      </Box>
      <HelpDialog
        open={openViewHintDialog}
        handleClose={() => setViewHintDialog(false)}
        helps={hints}
      />
    </>

  );
};

export default WidgetHint;
