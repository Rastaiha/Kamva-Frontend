import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  FormLabel,
  Autocomplete,
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslate } from 'react-redux-multilingual/lib/context';
import UploadFileButton from 'commons/components/molecules/UploadFileButton';
import EditObjectFields from 'commons/components/organisms/forms/EditObjectFields';
import { ContentWidgetType } from 'commons/types/widgets/ContentWidget';
import TinyEditorComponent from 'commons/components/organisms/TinyMCE/ReactTiny/TinyEditorComponent';
import { useGetFSMStatesQuery } from 'apps/fsm/redux/slices/fsm/FSMSlice';
import { useParams } from 'react-router-dom';

const ButtonWidgetEditor = ({
  onMutate,
  handleClose,

  paperId,
  open,
  id: widgetId,
  ...widgetProps
}) => {
  const t = useTranslate();
  const { fsmId } = useParams();
  const [buttonFields, setButtonFields] = useState({
    label: widgetProps.label || '',
    background_image: widgetProps.background_image || '',
    destination_page_url: widgetProps.destination_page_url || '',
    destination_states: widgetProps.destination_states || [],
  });
  const [widgetFields, setWidgetFields] = useState<Partial<ContentWidgetType>>({ ...widgetProps });
  const { data: fsmStates = [] } = useGetFSMStatesQuery({ fsmId });

  const handleClick = () => {
    onMutate({
      ...widgetFields,
      paper: paperId,
      widgetId,
      onSuccess: handleClose,
      ...buttonFields,
    })
  };

  return (
    <Dialog disableScrollLock open={open}>
      <DialogTitle>{'دکمه'}</DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <EditObjectFields
            fields={widgetFields}
            setFields={setWidgetFields}
          />
          <Stack>
            <FormLabel>{'متن دکمه'}</FormLabel>
            <TinyEditorComponent
              content={buttonFields.label}
              onChange={(text) => setButtonFields({
                ...buttonFields,
                label: text,
              })}
            />
          </Stack>

          <Stack direction={'row'} spacing={2} alignItems={'start'}>
            <TextField
              fullWidth
              label={'تصویر دکمه'}
              value={buttonFields.background_image}
              inputProps={{ className: 'ltr-input' }}
              placeholder="https://..."
              onChange={(e) => setButtonFields({
                ...buttonFields,
                background_image: e.target.value
              })}
              helperText={t('uploadFileFillUrl')}
            />
            <UploadFileButton
              setFileLink={(link) => setButtonFields({
                ...buttonFields,
                background_image: link,
              })}
            />
          </Stack>

          <Autocomplete
            multiple
            fullWidth
            getOptionLabel={(option) => option.title}
            onChange={(event, selectedOptions) => {
              setButtonFields({
                ...buttonFields,
                destination_states: selectedOptions.map(selectedOption => selectedOption.id),
              });
            }}
            value={fsmStates.filter(state => buttonFields.destination_states.includes(state.id))}
            renderInput={(params) =>
              <TextField
                {...params}
                label='گام‌های مقصد'
              />
            }
            options={fsmStates}
          />

          <TextField
            fullWidth
            label="لینک مقصد"
            disabled={buttonFields.destination_states.length > 0}
            value={buttonFields.destination_page_url}
            inputProps={{ className: 'ltr-input' }}
            placeholder="https://..."
            onChange={(e) => setButtonFields({
              ...buttonFields,
              destination_page_url: e.target.value
            })}
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

export default ButtonWidgetEditor;
