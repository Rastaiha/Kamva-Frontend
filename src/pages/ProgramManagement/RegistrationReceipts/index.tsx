import {
  Button,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import React, { FC, useEffect } from 'react';
import RegisterUsersViaCSV from './RegisterUsersViaCSV';
import RegisterOneUser from './RegisterOneUser';
import AnswerSheetTable from 'components/organisms/tables/AnswerSheet';
import { useGetFormRespondentsAnswersMutation } from 'redux/features/report/ReportSlice';
import downloadFromURL from 'utils/downloadFromURL';
import { MEDIA_BASE_URL } from 'configs/Constants';
import isValidURL from 'utils/validators/urlValidator';

type RegistrationReceiptsPropsType = {
  formId: string;
}

const RegistrationReceipts: FC<RegistrationReceiptsPropsType> = ({
  formId,
}) => {

  const [getFormRespondentsAnswers, result] = useGetFormRespondentsAnswersMutation();

  const downloadExcelExport = () => {
    getFormRespondentsAnswers({ formId })
  }

  useEffect(() => {
    if (result.isSuccess) {
      let url = result.data.file;
      if (!isValidURL(url)) {
        url = `${MEDIA_BASE_URL}${result.data.file}`;
      }
      downloadFromURL(url, `registrants-answers.xlsx`);
    }
  }, [result])

  return (
    <Stack spacing={2} alignItems={'stretch'} justifyContent={'center'}>
      <Stack padding={2} spacing={2}>
        <RegisterOneUser />
      </Stack>
      <Divider />

      <Stack padding={2} spacing={2}>
        <RegisterUsersViaCSV />
      </Stack>
      <Divider />

      <Stack spacing={2}>
        <Stack padding={2} direction={'row'} alignItems={'start'} justifyContent={'space-between'}>
          <Typography variant='h2' gutterBottom>
            {'شرکت‌کنندگان'}
          </Typography>
          <Button variant='contained' onClick={downloadExcelExport} disabled={result.isLoading}>
            {'خروجی اکسل'}
          </Button>
        </Stack>
        <AnswerSheetTable formId={formId} />
      </Stack>
    </Stack>
  );
}

export default RegistrationReceipts;