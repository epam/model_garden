import React, { FC } from 'react';
import { Tabs as TabsMUI, Tab } from '@material-ui/core';
import { Route, Switch, Link } from 'react-router-dom';

import { AddExistingDataset, UploadImages, LabelingTask, TasksStatuses } from './components';

interface Config {
  component: FC;
  label: string;
  path: string;
}

const config: Config[] = [
  {
    component: UploadImages,
    label: 'Upload Images',
    path: '/upload-images'
  },
  {
    component: AddExistingDataset,
    label: 'Add Existing Dataset',
    path: '/add-existing-dataset'
  },
  {
    component: LabelingTask,
    label: 'Create Labeling Tasks',
    path: '/labelling-task'
  },
  {
    component: TasksStatuses,
    label: 'Tasks statuses',
    path: '/tasks-statuses'
  }
];

export const Tabs: FC<{}> = () => (
  <Switch>
    {config.map(({ label, path, component }) => (
      <Route key={label} path={path} component={component} />
    ))}
  </Switch>
);

export const LinkTabs: FC<{ pathname: string }> = ({ pathname }) => (
  <TabsMUI value={config.findIndex(({ path }) => path === pathname)}>
    {config.map(({ label, path }) => (
      <Tab label={label} key={label} component={Link} to={path} />
    ))}
  </TabsMUI>
);
