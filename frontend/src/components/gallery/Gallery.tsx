import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import ImageGallery from './ImageGallery';
import DatasetView from './DatasetView';

export const Gallery = () => {
  const { url } = useRouteMatch();

  return (
    <Switch>
      <Route
        path={`${url}/bucket/:bucketId/dataset/:datasetId`}
        component={ImageGallery}
      />
      <Route exact path={url} component={DatasetView} />
    </Switch>
  );
};
