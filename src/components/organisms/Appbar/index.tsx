import {
  AppBar,
  Box,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  Toolbar,
  useScrollTrigger,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import React, { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom';
import {
  getOneEventInfoAction,
} from 'redux/slices/events';
import HideOnScroll from './components/HideOnScroll';
import modes from './modes';
import useWidth from 'utils/UseWidth';

type AppbarPropsType = {
  isMentor: boolean;
  getOneEventInfo: any;
  workshop: any;
  event: any;
  mode: string;
  showBackOnScroll: boolean;
  hideOnScroll: boolean;
  position: "fixed" | "absolute" | "sticky" | "static" | "relative";
  mentorId: string;
}

const ResponsiveAppBar: FC<AppbarPropsType> = ({
  isMentor,
  getOneEventInfo,
  workshop,
  event,
  mode = 'FSM',
  showBackOnScroll = false,
  hideOnScroll = false,
  position = 'fixed',
  mentorId,
}) => {
  const { programId } = useParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 30 });
  const width = useWidth();

  useEffect(() => {
    if (programId) {
      getOneEventInfo({  programId });
    }
  }, [programId])

  const {
    desktopLeftItems,
    desktopRightItems,
    mobileLeftItems,
    mobileRightItems,
    mobileMenuListItems,
  } = modes[mode]({ workshop, event, isMentor, mentorId });

  const rightItems = width === 'xs' ? mobileRightItems : desktopRightItems;
  const leftItems = width === 'xs' ? mobileLeftItems : desktopLeftItems;

  // todo: rightItems and leftItems don't contain just items! they also have a strange item

  return (
    <>
      <HideOnScroll disable={!hideOnScroll}>
        <AppBar
          sx={
            (showBackOnScroll && !trigger) ?
              {
                transition: '0.2s',
                background: 'transparent',
                boxShadow: 'none',
                paddingTop: 4,
              } :
              {
                transition: '0.2s',
              }
          }
          id='appBar'
          position={position}
          color='inherit'>
          <Container>
            <Toolbar disableGutters>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {mobileMenuListItems.length > 0 && (
                    <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                      <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => setDrawerOpen(!drawerOpen)}>
                        <MenuIcon fontSize='large' />
                      </IconButton>
                    </Box>
                  )}
                  {rightItems.map((item, index) => (
                    <Box mr={1} key={index}>
                      {item}
                    </Box>
                  ))}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {leftItems.map((item, index) => (
                    <Box ml={1} key={index}>
                      {item}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>
      <Drawer
        anchor="left" open={drawerOpen}
        onClose={() => setDrawerOpen(false)}>
        <List sx={{ width: 240 }}>
          {mobileMenuListItems.map((item, index) => (
            <ListItem key={index}>{item}</ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}

const mapStateToProps = (state) => ({
  isMentor: state.account.userInfo?.isMentor,
  event: state.events.event,
  workshop: state.workshop.workshop,
  mentorId: state.account.userInfo?.id,
})

export default connect(mapStateToProps, {
  getOneEventInfo: getOneEventInfoAction,
})(ResponsiveAppBar);