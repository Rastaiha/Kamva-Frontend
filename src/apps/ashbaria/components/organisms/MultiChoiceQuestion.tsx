import React, { FC } from 'react';
import { Button, Stack, Typography } from '@mui/material';

import TinyPreview from 'commons/components/organisms/TinyEditor/Preview';
import { WidgetModes } from 'commons/components/organisms/Widget';
import { toPersianNumber } from 'commons/utils/translateNumber';
import Choice from '../molecules/Choice';
import { MultiChoiceQuestionWidgetPropsType } from 'commons/components/organisms/Widget/questions/MultiChoiceQuestion';
import useMultiChoiceQuestionProperties from 'commons/components/organisms/Widget/questions/MultiChoiceQuestion/useMultiChoiceQuestionProperties';

const MultiChoiceQuestionWidget: FC<MultiChoiceQuestionWidgetPropsType> = ({
  useSubmitAnswerMutation,
  onAnswerChange,

  id: questionId,
  text: questionText,
  choices: questionChoices,
  mode,
  max_selections: maxSelections,
  min_selections: minSelections,
  lock_after_answer: lockAfterAnswer,
  randomize_choices: randomizeChoices,
  submittedAnswer,
}) => {

  const {
    selectedChoices,
    displayChoices,

    onChoiceSelect,
    submitAnswer,
    submitAnswerResult,
  } = useMultiChoiceQuestionProperties({
    useSubmitAnswerMutation,
    onAnswerChange,
    id: questionId,
    choices: questionChoices,
    mode,
    maxSelections,
    randomizeChoices,
    submittedAnswer,
  });

  return (
    <Stack spacing={1}>
      <TinyPreview
        styles={{ width: '100%' }}
        content={questionText}
      />
      <Stack spacing={1}>
        {displayChoices.map((choice) =>
          <Choice
            disabled={mode === WidgetModes.Review}
            key={choice.id}
            choice={choice}
            isSelected={selectedChoices.map(choice => choice.id).includes(choice.id)}
            onSelectionChange={() => onChoiceSelect(choice)}
          />
        )}
      </Stack>
      {
        mode === WidgetModes.View && maxSelections > 1 &&
        <Stack alignItems={'end'}>
          <Button
            disabled={selectedChoices?.length < minSelections || selectedChoices.length > maxSelections}
            sx={{ width: 80, alignSelf: 'end' }}
            variant='contained'
            onClick={() => submitAnswer(selectedChoices)}>
            <Typography fontWeight={400}>
              {'ثبت'}
            </Typography>
          </Button>
          <Typography variant='caption' color={'error'}>
            {selectedChoices?.length < minSelections && `باید حداقل ${toPersianNumber(minSelections)} گزینه را انتخاب کنید.`}
            {selectedChoices?.length > maxSelections && `حداکثر ${toPersianNumber(maxSelections)} گزینه را می‌توانید انتخاب کنید.`}
          </Typography>
        </Stack>
      }
    </Stack >
  );
};

export default MultiChoiceQuestionWidget;
