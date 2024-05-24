import {
  Button,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useState, FC } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';
import { addMentorToWorkshopAction } from 'redux/slices/programs';
import { getAllWorkshopMentorsAction, removeMentorFromWorkshopAction } from 'redux/slices/workshop';
import { UserMinimalType } from 'types/models';
import InfoIcon from '@mui/icons-material/Info';
import SimpleTable from 'components/organisms/tables/SimpleTable';

type MentorsPropsType = {
  addMentorToWorkshop: Function,
  getAllWorkshopMentors: Function,
  removeMentorFromWorkshop: Function,
  fsmMentors: UserMinimalType[],
}

const Mentors: FC<MentorsPropsType> = ({
  addMentorToWorkshop,
  getAllWorkshopMentors,
  removeMentorFromWorkshop,
  fsmMentors = []
}) => {
  const { fsmId } = useParams();
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    getAllWorkshopMentors({ fsmId })
  }, [])

  const addMentor = () => {
    addMentorToWorkshop({
      username,
      fsmId,
      onSuccess: () => {
        setUsername('');
        getAllWorkshopMentors({ fsmId })
      }
    });
  };

  const removeMentor = (username) => {
    removeMentorFromWorkshop({
      fsmId,
      username,
      onSuccess: () => getAllWorkshopMentors({ fsmId })
    });
  }

  return (
    <Stack>
      <Grid
        padding={2}
        container
        spacing={2}
        alignItems="center"
        justifyContent="center"
        direction="row">

        <Grid item xs={12}>
          <Stack direction={'row'} alignItems={'center'}>
            <Typography variant='h2'>
              {'همیاران کارگاه'}
            </Typography>
            <Tooltip title='همیار کارگاه تنها به تنظیمات یک کارگاه دسترسی دارد؛ از جمله می‌تواند محتوای کارگاه را ویرایش کند، پاسخ‌های شرکت‌کنندگان را تصحیح کند یا به درخواست آن‌ها پاسخ دهد.'>
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Grid>

        <Grid item container spacing={1} justifyContent="space-evenly">
          <Grid item xs={12} sm={6}>
            <TextField
              value={username}
              size="small"
              fullWidth
              variant="outlined"
              label="نام کاربری"
              name="username"
              inputProps={{ className: 'ltr-input' }}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              disabled={!username}
              fullWidth
              variant="contained"
              color="primary"
              onClick={addMentor}>
              {'افزودن همیار جدید'}
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Divider />

      <SimpleTable
        headers={[
          { name: 'first_name', label: 'نام' },
          { name: 'last_name', label: 'نام خانوادگی' },
          { name: 'phone_number', label: 'شماره تماس' },
          { name: 'email', label: 'ایمیل' },
          { name: 'activities', label: 'عملیات' },
        ]}

        rows={fsmMentors.map(mentor => ({
          ...mentor,
          activities:
            <Tooltip title='حذف همیار' arrow>
              <IconButton size='small'
                onClick={() => removeMentor(mentor.username)}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
        }))}
      />

    </Stack>
  );
}

const mapStateToProps = (state) => ({
  fsmMentors: state.workshop.allWorkshopMentors,
});

export default connect(mapStateToProps, {
  addMentorToWorkshop: addMentorToWorkshopAction,
  getAllWorkshopMentors: getAllWorkshopMentorsAction,
  removeMentorFromWorkshop: removeMentorFromWorkshopAction,
})(Mentors);
