import React, { useEffect, FC } from 'react';
import { useDispatch } from 'react-redux';
import { AppBar, CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { useLocation, Redirect } from 'react-router-dom';
import { ErrorAlert, ProgressLoader } from './components';
import { getBuckets, getLabelingToolUsers } from './store/data';
import { Header, TabsContent } from './routerconfig';
import theme from './theme';
import { useTypedSelector } from './store';

const App: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const showLoader = useTypedSelector(({ ui }) => ui.showLoader);

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
      <ProgressLoader show={showLoader} />
    </ThemeProvider>
  );
};

export default App;
