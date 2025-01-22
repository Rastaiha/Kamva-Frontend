import React, { useEffect, useState } from 'react';

import RegistrationForm from 'commons/template/RegistrationForm';
import RegistrationStatus from 'commons/template/RegistrationStatus';
import Payment from 'commons/template/Payment';
import { RegistrationStepNameType, RegistrationStepType } from 'commons/types/global';
import { useGetMyReceiptQuery } from 'apps/website-display/redux/features/form/ReceiptSlice';
import { useGetFormQuery } from 'apps/website-display/redux/features/form/FormSlice';
import UserSetting from 'commons/template/Setting/UserSetting';
import SchoolSetting from 'commons/template/Setting/SchoolSetting';
import UniversitySetting from 'commons/template/Setting/UniversitySetting';
import { useGetProgramQuery } from 'apps/website-display/redux/features/program/ProgramSlice';
import { useParams } from 'react-router-dom';

const useRegistrationSteps = () => {
  const { programSlug } = useParams();
  const { data: program } = useGetProgramQuery({ programSlug });
  const [currentStepNameIndex, setCurrentStepIndex] = useState<number>(0);
  const [lastActiveStepIndex, setLastActiveIndex] = useState<number>(0);
  const [steps, setSteps] = useState<RegistrationStepType[]>([]);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const { data: registrationForm } = useGetFormQuery({ formId: program?.registration_form }, { skip: !Boolean(program?.registration_form) });
  const { data: registrationReceipt } = useGetMyReceiptQuery({ formId: program?.registration_form }, { skip: !Boolean(program?.registration_form) });

  useEffect(() => {
    const goToStep = (destinationStepIndex: number) => {
      setCurrentStepIndex(destinationStepIndex);
      if (destinationStepIndex > lastActiveStepIndex) {
        setLastActiveIndex(destinationStepIndex);
      }
    }

    const goToNextStep = () => {
      goToStep(currentStepNameIndex + 1);
    }

    const getStepIndex = (stepName: RegistrationStepNameType) => {
      return _steps.indexOf(_steps.find(step => step.name === stepName));
    }

    if (!program || !registrationForm) return;
    const _steps: RegistrationStepType[] = [];

    _steps.push({
      name: 'user-setting',
      label: 'تکمیل اطلاعات شخصی',
      component: <UserSetting isInForm={true} onSuccessfulSubmission={() => goToNextStep()} />,
      onClick: () => goToStep(getStepIndex('user-setting')),
    })

    if (registrationForm.audience_type === 'Student') {
      _steps.push({
        name: 'school-setting',
        label: 'تکمیل اطلاعات دانش‌آموزی',
        component: <SchoolSetting isInForm={true} onSuccessfulSubmission={() => goToNextStep()} />,
        onClick: () => goToStep(getStepIndex('school-setting'))
      })
    }

    if (registrationForm.audience_type === 'Academic') {
      _steps.push({
        name: 'university-setting',
        label: 'تکمیل اطلاعات دانشجویی',
        component: <UniversitySetting onSuccessfulSubmission={() => goToNextStep()} />,
        onClick: () => goToStep(getStepIndex('university-setting'))
      })
    }

    _steps.push({
      name: 'form',
      label: 'ثبت‌نام در دوره',
      disabled: true,
      component: <RegistrationForm onSuccess={() => goToNextStep()} />,
      onClick: () => { }
    })

    if (registrationForm.accepting_status == 'Manual') {
      _steps.push({
        name: 'status',
        label: 'وضعیت ثبت‌نام',
        component: <RegistrationStatus />,
        onClick: () => goToStep(getStepIndex('status')),
      })
    }

    if (!program.is_free) {
      _steps.push({
        name: 'payment',
        label: 'پرداخت هزینه',
        component: <Payment />,
        onClick: () => goToStep(getStepIndex('payment')),
      })
    }

    _steps.push({
      name: 'program',
      label: 'ورود به دوره',
      component: null,
    })

    if (isFirstRender && registrationReceipt) {
      if (['Waiting', 'Rejected'].includes(registrationReceipt?.status)) {
        goToStep(getStepIndex('status'));
      }
      if (!program.is_free && registrationReceipt?.status === 'Accepted') {
        goToStep(getStepIndex('payment'));
      }
      setIsFirstRender(false);
    }

    setSteps(_steps);
  }, [program, registrationForm, currentStepNameIndex, lastActiveStepIndex, registrationReceipt]);

  return {
    currentStepNameIndex,
    lastActiveStepIndex,
    steps,
  }
}

export default useRegistrationSteps;