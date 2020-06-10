import React, { useEffect, FC } from 'react';
import { useDispatch } from 'react-redux';
import { AppBar, CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { useLocation, Redirect } from 'react-router-dom';
import { ErrorAlert } from './components';
import { getBuckets } from './store/main';
import { getLabelingToolUsers } from './store/labelingTask';
import { Tabs, LinkTabs } from './routerconfig';
import theme from './theme';

import './App.css';

const App: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBuckets());
    dispatch(getLabelingToolUsers());
  }, [dispatch]);

  if (pathname === '/') {
    return <Redirect to="/upload-images" />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorAlert />
      <AppBar position="sticky">
        <LinkTabs pathname={pathname} />
      </AppBar>
      <Tabs />
    </ThemeProvider>
  );
};

export default App;
