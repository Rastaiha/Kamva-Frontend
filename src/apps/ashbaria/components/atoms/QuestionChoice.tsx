import React from 'react';
import { Typography, Stack } from '@mui/material';

const QuestionChoice = ({ choice, isSelected, onSelectionChange, variant, disabled, mode }) => {
  return (
    <Stack
      sx={{
        display: 'inline-block',
        width: "100%",
        border: '2px solid',
        borderColor: isSelected ? '#FE9C42' : 'transparent',
        borderRadius: '4px',
        backgroundColor: isSelected ? '#FFC66F1A' : "#00000066",
        cursor: disabled ? 'not-allowed' : 'pointer',
        padding: '10px 20px',
      }}
      onClick={() => !disabled && onSelectionChange()} // Prevent selection in review mode
    >
      <Typography
        fontSize={12}
        fontWeight={400}
        sx={{
          width: "100%",
          textAlign: "center"
        }}
      >
        {choice.text}
      </Typography>
    </Stack>
  );
};

export default QuestionChoice;
