import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Divider,
  Box,
  Stack
} from '@mui/material';
import React, { useState, useMemo, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router';
import Pagination from '@mui/material/Pagination';

import TeamInfoCard from 'components/organisms/cards/TeamInfo';
import {
  addUserToTeamAction,
  createRequestMentorAction,
  createTeamAction,
  getRequestMentorAction,
  removeRequestMentorAction,
} from 'redux/slices/programs';
import NoDataFound from 'components/molecules/NoDataFound';
import { useGetProgramQuery } from 'redux/features/program/ProgramSlice';

function Teams({
  addUserToTeam,
  createTeam,

  allProgramTeams: allProgramTeams,
}) {
  const { fsmId, programId } = useParams();
  const { data: program } = useGetProgramQuery({ programId });
  const [newTeamName, setNewTeamName] = useState('');
  const [username, setUserName] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [teams, setTeams] = useState([])
  const [teamsCards, setTeamsCards] = useState([])

  const itemsPerPage = 12;
  const [page, setPage] = React.useState(1);
  const [noOfPages, setNoOfPages] = React.useState(
    Math.ceil(allProgramTeams.length / itemsPerPage)
  );

  useEffect(() => {
    setTeamsCards(
      teams
        .slice((page - 1) * itemsPerPage, page * itemsPerPage)
        .map((team) => (
          <Grid container item xs={12} sm={6} md={4} key={team.id} alignItems='center' justifyContent='center'>
            <TeamInfoCard
              {...team}
              teamId={team.id}
              fsmId={fsmId}
              chatRoom={team.chat_room}
            />
          </Grid>
        ))
    )
  }, [page, teams])

  const handleChange = (_, value) => {
    setPage(value);
  };

  useMemo(() => {
    setNoOfPages(Math.ceil(allProgramTeams.length / itemsPerPage))
    setTeams(
      allProgramTeams?.slice().sort((a, b) => {
        if (!isNaN(parseInt(a.name)) && !isNaN(parseInt(b.name)) && parseInt(b.name) !== parseInt(a.name)) {
          return parseInt(a.name) - parseInt(b.name)
        }
        return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)
      })
    )
  }, [allProgramTeams])

  const doCreateTeam = () => {
    createTeam({ name: newTeamName, registration_form: program?.registration_form })
  }

  const doAddUserToTeam = () => {
    addUserToTeam({ teamId: selectedTeamId, username })
  }

  return (
    <Stack spacing={2}>
      <Stack spacing={2} padding={2}>
        <Typography gutterBottom variant='h2'>
          {'ساخت گروه'}
        </Typography>
        <Stack>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                value={newTeamName || ''}
                size="small"
                fullWidth
                variant="outlined"
                label="نام گروه"
                onChange={(e) => { setNewTeamName(e.target.value) }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                disabled={!newTeamName}
                fullWidth
                variant="contained"
                color="primary"
                onClick={doCreateTeam}>
                {'بساز'}
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </Stack>

      <Divider />

      <Stack spacing={2} padding={2}>
        <Typography variant='h2' gutterBottom>
          {'افزودن کاربر به گروه'}
        </Typography>
        <Stack>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={4}>
              <TextField
                value={username || ''}
                size="small"
                fullWidth
                variant="outlined"
                label="نام کاربری"
                inputProps={{ className: 'ltr-input' }}
                onChange={(e) => { setUserName(e.target.value) }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl size="small" fullWidth variant="outlined">
                <InputLabel>گروه</InputLabel>
                <Select defaultValue="" onChange={(e) => setSelectedTeamId(e.target.value)} label="گروه">
                  {allProgramTeams?.map((team) => (
                    <MenuItem key={team.id} value={team.id || ''}>
                      {team.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                disabled={!username || !selectedTeamId}
                fullWidth
                variant="contained"
                color="primary"
                onClick={doAddUserToTeam}>
                {'بیافزا'}
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </Stack>

      <Divider />

      <Stack spacing={2} padding={2}>
        <Typography variant='h2' gutterBottom>
          {'تیم‌ها'}
        </Typography>
        {teams.length > 0 &&
          <Pagination
            sx={{ alignSelf: 'center' }}
            count={noOfPages}
            page={page}
            onChange={handleChange}
            defaultPage={1}
            color="primary"
            showFirstButton
            showLastButton
          />
        }
        <Stack>
          <Grid container spacing={2}
            alignItems='stretch'
            justifyContent="center"
            sx={(theme) => ({
              height: '100%',
              justifyContent: 'start',
              [theme.breakpoints.down('sm')]: {
                justifyContent: 'center',
                marginRight: "0px",
              },
            })}>
            {teamsCards}
          </Grid>
        </Stack>
        {teams.length === 0 &&
          <NoDataFound variant={4} />
        }
      </Stack>
    </Stack>
  );
}

const mapStateToProps = (state) => ({
  allWorkshops: state.programs.myWorkshops || [],
  allProgramTeams: state.programs.allProgramTeams || [],
  requestTeams: state.programs.requestTeams || {},
});

export default connect(mapStateToProps, {
  getRequestMentor: getRequestMentorAction,
  createRequestMentor: createRequestMentorAction,
  removeRequestMentor: removeRequestMentorAction,
  createTeam: createTeamAction,
  addUserToTeam: addUserToTeamAction,
})(Teams);
