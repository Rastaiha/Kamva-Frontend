import React, { FC, useEffect, useState } from "react";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { toEnglishNumber, toPersianNumber } from "commons/utils/translateNumber";
import { useSearchParams } from "react-router-dom";
import { useGetVerificationCodeMutation, useOtpLoginMutation } from "commons/redux/slices/party/UserApi";
import { LoginTabs } from ".";
import ProgramLogo from "commons/components/atoms/logos/ProgramLogo";
import { Golden } from "apps/ashbaria/constants/colors";

const TIMER_KEY = 'verification_timer_end';

const EnterVerificationCode: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [verificationCode, setVerificationCode] = useState(Array(5).fill(""));
  const [countdown, setCountdown] = useState(() => {
    const endTime = localStorage.getItem(TIMER_KEY);
    if (endTime) {
      const remaining = Math.round((parseInt(endTime) - Date.now()) / 1000);
      return remaining > 0 ? remaining : 0;
    }
    return 90;
  });

  const [otpLogin] = useOtpLoginMutation();
  const phoneNumber = searchParams.get('phoneNumber');
  const [getVerificationCode, getVerificationCodeResult] = useGetVerificationCodeMutation();

  useEffect(() => {
    if (getVerificationCodeResult.isSuccess) {
      setVerificationCode(Array(5).fill(""));
      
      toast.success('کد تایید دوباره برات ارسال شد');
      const endTime = Date.now() + (90 * 1000);
      localStorage.setItem(TIMER_KEY, endTime.toString());
      setCountdown(90);
    }
  }, [getVerificationCodeResult]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          const newValue = prev - 1;
          if (newValue === 0) {
            localStorage.removeItem(TIMER_KEY);
          }
          return newValue;
        });
      }, 1000);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [countdown]);

  const handleGetVerificationCode = () => {
    getVerificationCode({ phoneNumber, websiteDisplayName: 'آشباریا', codeType: 'create-user-account' });
  };

  const handleChangeVerificationCode = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = toEnglishNumber(event.target.value);
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      if (value && index < 4) {
        // Move to the next input field
        const nextInput = document.getElementById(`code-input-${index + 1}`);
        if (nextInput) nextInput.focus();
      } else if (newCode.every(digit => digit)) {
        // Call handleLogin if all digits are entered
        handleLogin(newCode);
      }
    }
  };

  const handleGoToPreviousPage = () => {
    setSearchParams({ tab: LoginTabs.EnterPhoneNumber });
  };

  const handleLogin = (verificationCode) => {
    otpLogin({ phoneNumber, verificationCode: verificationCode.join("") });
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Stack width={300} component={Paper} padding={2} spacing={2}>
      <ProgramLogo />
      <Stack spacing={1}>
        <Typography textAlign="center" gutterBottom>
          {`کد پنج‌رقمی رو برای شماره ${toPersianNumber(phoneNumber)} فرستادیم. این پایین واردش کن:`}
        </Typography>
        <Stack direction='row-reverse' spacing={1} justifyContent="center">
          {verificationCode.map((digit, index) => (
            <TextField
              key={index}
              id={`code-input-${index}`}
              value={digit}
              onChange={handleChangeVerificationCode(index)}
              variant="outlined"
              inputProps={{ dir: 'ltr', maxLength: 1, style: { padding: 0, textAlign: "center", height: 40, width: 40 } }}
            />
          ))}
        </Stack>
      </Stack>
      <Button variant={countdown > 0 ? 'outlined' : "contained"} onClick={handleGetVerificationCode} disabled={countdown > 0}>
        {countdown > 0 ? `ارسال مجدد در ${toPersianNumber(formatTime(countdown))}` : 'نیومد که، دوباره بفرست'}
      </Button>
      <Button onClick={handleGoToPreviousPage}>
        <Typography color={Golden}>
          {'شمارمو اشتباه نوشتم!'}
        </Typography>
      </Button>
    </Stack >
  );
};

export default EnterVerificationCode;
