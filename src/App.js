import './configs/styles/App.css';

import React, { useEffect } from 'react';
import { CssBaseline, LinearProgress } from '@mui/material';
import { ThemeProvider } from '@mui/styles';
import { SnackbarProvider } from 'notistack';
import { CacheProvider } from "@emotion/react";
import { connect } from 'react-redux';
import { IntlProvider } from 'react-redux-multilingual';
import { useHistory } from 'react-router';
import createEmotionCache from './configs/createEmotionCache'
import selectTheme from './configs/themes';

import Notifier from './components/Notifications/Notifications';
import { initParseServer } from './parse/init';
import { initRedirectAction } from './redux/slices/redirect';
import Root from './routes';
import translations from './translations';


const App = ({ dir, redirectTo, forceRedirect, initRedirect, loading }) => {
  const history = useHistory();
  useEffect(() => {
    if (redirectTo !== null) {
      history.push(redirectTo);
      if (forceRedirect) {
        history.push(redirectTo);
        history.push('/loading/');
        history.goBack();
      } else {
        history.push(redirectTo);
      }
      initRedirect();
    }
  }, [redirectTo, forceRedirect, initRedirect, history]);

  useEffect(() => {
    initParseServer();
  }, []);

  useEffect(() => {
    document.body.dir = dir;
  }, [dir]);

  const Loading = () => {
    if (loading) {
      return (
        <div style={{ width: '100%', position: 'fixed', top: '0px', zIndex: '99999' }}>
          <LinearProgress />
        </div>
      )
    } else {
      return (<></>)
    }
  }

  return (
    <IntlProvider translations={translations}>
      <CacheProvider value={createEmotionCache(dir)}>
        <ThemeProvider theme={selectTheme(dir)}>
          <SnackbarProvider>
            <Loading />
            <Notifier />
            <CssBaseline />
            <Root />
          </SnackbarProvider>
        </ThemeProvider>
      </CacheProvider>
    </IntlProvider>
  );
};

const mapStateToProps = (state) => ({
  dir: state.Intl.locale === 'fa' ? 'rtl' : 'ltr',
  redirectTo: state.redirect.redirectTo,
  forceRedirect: state.redirect.force,
  loading: state.account.isFetching || state.events.isFetching || state.currentState.isFetching,
});

export default connect(mapStateToProps, { initRedirect: initRedirectAction })(App);
