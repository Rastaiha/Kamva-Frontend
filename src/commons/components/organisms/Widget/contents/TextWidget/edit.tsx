import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslate } from 'react-redux-multilingual/lib/context';
import TinyEditorComponent from 'commons/components/organisms/TinyEditor/TinyEditorComponent';
import EditObjectFields from 'commons/components/organisms/forms/EditObject';
import { ContentWidgetType } from 'commons/types/widgets/ContentWidget';
import CollapsibleTitle from 'commons/components/molecules/CollapsibleTitle';

function TextEditWidget({
  onMutate,

  open,
  handleClose,
  text: oldText,
  paperId,
  id: widgetId,
  ...widgetProps
}) {
  const t = useTranslate();
  const [text, setText] = useState(oldText);
  const [widgetFields, setWidgetFields] = useState<Partial<ContentWidgetType>>({ ...widgetProps });

  const handleClick = () => {
    onMutate({
      paper: paperId,
      text,
      widgetId,
      onSuccess: handleClose,
      ...widgetFields,
    })
  };

  return (
    <Dialog disableScrollLock fullWidth open={open} maxWidth='md'>
      <DialogTitle>{t('text')}</DialogTitle>
      <DialogContent>
        <CollapsibleTitle title='مشخصات شئ'>
          <EditObjectFields
            fields={widgetFields}
            setFields={setWidgetFields}
          />
        </CollapsibleTitle>
        <DialogContentText gutterBottom>متن مورد نظر خود را وارد کنید.</DialogContentText>
        <TinyEditorComponent
          content={text}
          onChange={(text) => setText(text)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="outlined">
          {'انصراف'}
        </Button>
        <Button onClick={handleClick} color="primary" variant="contained">
          {t('submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TextEditWidget;
