import {
  Button,
  Dialog,
  Divider,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Stack,
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslate } from 'react-redux-multilingual/lib/context';
import UploadFileButton from 'commons/components/molecules/UploadFileButton';
import EditObjectFields from 'commons/components/organisms/forms/EditObjectFields';
import { ContentWidgetType } from 'commons/types/widgets/ContentWidget';


const AudioEditWidget = ({
  onMutate,
  handleClose,

  paperId,
  open,
  link: previousLink,
  id: widgetId,
  ...widgetProps
}) => {
  const t = useTranslate();
  const [link, setLink] = useState<string>(previousLink || '');
  const [widgetFields, setWidgetFields] = useState<Partial<ContentWidgetType>>({ ...widgetProps });

  const handleClick = () => {
    onMutate({
      paper: paperId,
      link,
      widgetId,
      onSuccess: handleClose,
      ...widgetFields,
    });
  };

  return (
    <Dialog disableScrollLock open={open}>
      <DialogTitle>صوت</DialogTitle>
      <DialogContent>
        <EditObjectFields
          fields={widgetFields}
          setFields={setWidgetFields}
        />
        <Stack spacing={2}>
          <UploadFileButton setFileLink={setLink} />
          <Divider>یا</Divider>
          <DialogContentText>{t('uploadFileFillUrl')}</DialogContentText>
          <TextField
            fullWidth
            label="آدرس صوت"
            value={link}
            inputProps={{ className: 'ltr-input' }}
            placeholder="http://example.com/example.mp3"
            onChange={(e) => setLink(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleClose}>
          {'انصراف'}
        </Button>
        <Button onClick={handleClick} color="primary" variant="contained">
          {t('submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AudioEditWidget;
