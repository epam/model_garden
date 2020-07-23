import React, { useEffect, FC } from 'react';
import { useDispatch } from 'react-redux';
import { AppBar, CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { useLocation, Redirect } from 'react-router-dom';
import { ErrorAlert } from './components';
import { getBuckets, getLabelingToolUsers } from './store/data';
import { Header, TabsContent } from './routerconfig';
import theme from './theme';

const App: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBuckets());
    dispatch(getLabelingToolUsers());
  }, [dispatch]);

  if (pathname === '/') {
    return <Redirect to="/add-dataset" />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorAlert />
      <AppBar position="sticky">
        <Header pathname={pathname} />
      </AppBar>
      <TabsContent />
    </ThemeProvider>
  );
};

export default App;
