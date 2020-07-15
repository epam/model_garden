import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ImageGallery from './ImageGallery';
import DatasetView from './DatasetView';

export const Gallery = () => {
  return (
    <Switch>
      <Route path="/gallery/dataset/:datasetId" component={ImageGallery} />
      <Route exact path="/gallery" component={DatasetView} />
    </Switch>
  );
};
