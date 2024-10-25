import React, { FC, useEffect, useState } from "react";
import { Button, Card, Grid, Paper, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useGetFSMStateQuery } from "apps/fsm/redux/slices/fsm/FSMStateSlice";
import { useGetMyPlayerQuery } from "apps/fsm/redux/slices/fsm/PlayerSlice";
import Hint from "../components/organisms/hint/Hint";
import NoHintFound from "../components/organisms/hint/NoHintFound";

type HintsTemplatePropsType = {
  onClose: any;
}

const HintsTemplate: FC<HintsTemplatePropsType> = ({
  onClose,
}) => {
  const { fsmId } = useParams();
  const { data: currentUserPlayer } = useGetMyPlayerQuery({ fsmId });
  const fsmStateId = currentUserPlayer?.current_state;
  const { data: state } = useGetFSMStateQuery({ fsmStateId }, { skip: !Boolean(fsmStateId) });
  const [selectedHintId, setSelectedHinId] = useState<string>(null);

  const hints = state?.hints;

  useEffect(() => {
    if (hints?.length === 1) {
      setSelectedHinId(hints[0].id);
    }
  }, [hints])

  if (hints && hints.length === 0) {
    return (
      <NoHintFound onClose={onClose} />
    )
  }

  if (selectedHintId) {
    return (
      <Hint onClose={onClose} hintId={selectedHintId} />
    )
  }

  return (
    <Grid container spacing={2} padding={2} alignItems={'center'} justifyContent={'start'}>
      {hints.map(hint =>
        <Grid item key={hint.id} xs={3}>
          <Button onClick={() => setSelectedHinId(hint.id)}>
            {hint.id}
          </Button>
        </Grid>
      )}
    </Grid>
  )
}

export default HintsTemplate;