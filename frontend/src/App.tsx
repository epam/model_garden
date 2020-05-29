import React, { useEffect, FC } from 'react';
import { useDispatch } from 'react-redux';
import { AppBar } from '@material-ui/core';
import { useLocation, Redirect } from 'react-router-dom';
import { ErrorAlert } from './components';
import { getBuckets } from './store/main';
import { Tabs, LinkTabs } from './routerconfig';

import './App.css';

const App: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBuckets());
  }, [dispatch]);

  if (pathname === '/') {
    return <Redirect to="/upload-images" />;
  }

  return (
    <div className="App">
      <ErrorAlert />
      <AppBar position="static">
        <LinkTabs pathname={pathname} />
      </AppBar>
      <Tabs />
    </div>
  );
};

export default App;
