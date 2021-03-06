import React, { FC } from 'react';
import { makeStyles, Tabs, Tab } from '@material-ui/core';
import { Route, Switch, Link } from 'react-router-dom';

import { TasksStatuses, Gallery } from './components';

interface IConfig {
  component: FC;
  label: string;
  path: string;
}

const useStyles = makeStyles(() => ({
  root: {
    minWidth: 'auto',
    paddingLeft: '1rem',
    paddingRight: '1rem'
  }
}));

const config: IConfig[] = [
  {
    component: Gallery,
    label: 'Gallery',
    path: '/gallery'
  },
  {
    component: TasksStatuses,
    label: 'Tasks statuses',
    path: '/tasks-statuses'
  }
];

export const TabsContent: FC<{}> = () => (
  <Switch>
    {config.map(({ label, path, component }) => (
      <Route key={label} path={path} component={component} />
    ))}
  </Switch>
);

export const Header: FC<{ pathname: string }> = ({ pathname }) => {
  const classes = useStyles();
  return (
    <Tabs
      value={config.findIndex(({ path }) => pathname.includes(path))}
      variant="scrollable"
      scrollButtons="auto"
    >
      {config.map(({ label, path }) => (
        <Tab
          label={label}
          key={label}
          component={Link}
          to={path}
          className={classes.root}
        />
      ))}
    </Tabs>
  );
};
