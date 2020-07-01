import React from 'react';
import { Container } from '@material-ui/core';
import { Route } from 'react-router-dom';
import { GridGallery } from './GridGallery';
import { DatasetGrid } from './datasetGrid/datasetGrid';
import GalleryDropDowns from './GalleryDropdowns';

export const Gallery = () => {
  return (
    <Container maxWidth={'xl'}>
      <Route exact path="/gallery" component={GalleryDropDowns} />
      <Route exact path="/gallery" component={DatasetGrid} />
      <Route path="/gallery/dataset/:datasetId" component={GridGallery} />
    </Container>
  );
};
