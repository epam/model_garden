import React, { useEffect, FC } from 'react';
import { useDispatch } from 'react-redux';
import { AppBar, CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { useLocation, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ProgressLoader } from './components';
import { dataInit } from './store/data';
import { Header, TabsContent } from './routerconfig';
import { Slide } from 'react-toastify';
import theme from './theme';
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/antd.css';
import './styles.scss';

const App: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dataInit());
  }, [dispatch]);

  if (pathname === '/') {
    return <Redirect to="/gallery" />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer transition={Slide} />
      <AppBar position="sticky">
        <Header pathname={pathname} />
      </AppBar>
      <TabsContent />
      <ProgressLoader />
    </ThemeProvider>
  );
};

export default App;
