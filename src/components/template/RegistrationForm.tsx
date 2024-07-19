import { Button, Paper as MUIPaper, Stack, Typography } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import AreYouSure from 'components/organisms/dialogs/AreYouSure';
import ProgramInfo from 'components/organisms/ProgramInfo';
import useCollectWidgetsAnswers from 'components/hooks/useCollectWidgetsAnswers';
import { useGetProgramQuery } from 'redux/features/program/ProgramSlice';
import Paper from './Paper';
import { useGetMyReceiptQuery } from 'redux/features/form/ReceiptSlice';
import { useGetFormQuery, useSubmitFormMutation } from 'redux/features/form/FormSlice';
import { AnswerType } from 'types/models';

type RegistrationFormPropsType = {
  onSuccess?: any;
  onFailure?: any;
}

const RegistrationForm: FC<RegistrationFormPropsType> = ({
  onSuccess,
  onFailure,
}) => {
  const { programId } = useParams();
  const [isDialogOpen, setDialogStatus] = useState(false);
  const { answers, getAnswerCollector } = useCollectWidgetsAnswers([]);
  const { data: program } = useGetProgramQuery({ programId });
  const { data: registrationForm } = useGetFormQuery({ formId: program?.registration_form }, { skip: !Boolean(program?.registration_form) });
  const { data: registrationReceipt } = useGetMyReceiptQuery({ formId: program.registration_form });
  const [submitRegistrationForm, submitRegistrationFormResult] = useSubmitFormMutation();

  const submit = () => {
    submitRegistrationForm({
      answer_sheet_type: 'RegistrationReceipt',
      formId: registrationForm.id,
      answers,
    });
  };

  useEffect(() => {
    if (submitRegistrationFormResult?.isSuccess) {
      onSuccess();
    }
    if (submitRegistrationFormResult?.isError) {
      onFailure();
    }
  }, [submitRegistrationFormResult])

  const isSubmitButtonDisabled = (): { isDisabled: boolean; message: string; } => {
    return {
      isDisabled:
        registrationReceipt.status == 'DeadlineMissed' ||
        registrationReceipt.status == 'NotPermitted' ||
        registrationReceipt.status == 'GradeNotAvailable' ||
        registrationReceipt.status == 'StudentshipDataIncomplete',
      message:
        registrationReceipt.status == 'DeadlineMissed' ? 'مهلت ثبت‌نام تمام شده است' :
          registrationReceipt.status == 'NotPermitted' ? 'با توجه به پایه تحصیلیتان، شما مجاز به شرکت در این رویداد نیستید' :
            registrationReceipt.status == 'GradeNotAvailable' ? 'ابتدا پایه‌ی تحصیلی خود را انتخاب کنید' :
              registrationReceipt.status == 'StudentshipDataIncomplete' ? 'مشخصات دانش‌آموزی‌تان کامل نیست' :
                'خبری نیست، سلامتی!'
    }
  }

  if (!program || !registrationForm || !registrationReceipt) return null;

  return (
    <Stack spacing={2}>
      <ProgramInfo program={program} />
      <Stack width={'100%'} component={MUIPaper} padding={2} spacing={2}>
        <Paper
          mode='form'
          paperId={registrationForm.id}
          answers={answers}
          getAnswerCollector={getAnswerCollector}
        />
        {isSubmitButtonDisabled().isDisabled &&
          <Typography color={'red'} textAlign={'center'} fontSize={24} fontWeight={400}>
            {isSubmitButtonDisabled().message}
          </Typography>
        }
        <Button
          disabled={isSubmitButtonDisabled().isDisabled}
          variant="contained"
          color="primary"
          onClick={() => setDialogStatus(true)}>
          {'ثبت‌نام'}
        </Button>
      </Stack >
      <AreYouSure
        open={isDialogOpen}
        handleClose={() => {
          setDialogStatus(!isDialogOpen);
        }}
        callBackFunction={submit}
      />
    </Stack>
  );
};

export default RegistrationForm;