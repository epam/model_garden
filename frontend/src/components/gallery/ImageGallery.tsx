import React, { useEffect } from 'react';
import { Container, Grid } from '@material-ui/core';
import { useRouteMatch, Redirect, Link } from 'react-router-dom';
import { Empty } from 'antd';

import { useTypedSelector, useAppDispatch } from '../../store';
import { getMediaAssets } from '../../store/data';
import { ImageCard } from './ImageCard';
import { ImageGalleryHeader } from './ImageGalleryHeader';
import { Dataset } from '../../models';

const ImageGallery = () => {
  const dispatch = useAppDispatch();
  const photos = useTypedSelector(({ data }) => data.mediaAssets);
  const datasets = useTypedSelector(({ data }) => data.datasets);
  const buckets = useTypedSelector(({ data }) => data.buckets);

  const {
    params: { datasetId }
  } = useRouteMatch();
  const currentDataset = datasets.find(
    (dataset: Dataset) => dataset.id.toString() === datasetId
  ); //@todo: update once we change arrays to object
  const currentBucket = buckets.find(
    (busket) => busket.id === currentDataset?.bucket
  ); //@todo: update once we change arrays to object

  useEffect(() => {
    if (datasets.length > 0) {
      dispatch(getMediaAssets({ datasetId: parseInt(datasetId) }));
    }
  }, [dispatch, datasetId, datasets.length]);

  if (datasets.length === 0) {
    return <Redirect to="/gallery" />;
  }
  return (
    <>
      <ImageGalleryHeader
        bucket={currentBucket?.name}
        dataset={currentDataset?.path}
        imageCount={currentDataset?.items_number}
        labelCount={currentDataset?.xmls_number}
        createdAt={currentDataset?.created_at}
      />
      <Container maxWidth={'xl'}>
        {!photos.length && (
          <Link
            to={{
              pathname: '/add-dataset/upload-images',
              state: {
                dataset: datasets.find(
                  (dataset: any) => dataset.id === parseInt(datasetId)
                )
              }
            }}
          >
            <Empty description="this dataset doesn't have any images yet, click to upload" />
          </Link>
        )}

        <Grid container spacing={2}>
          {photos.map((tile: any) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={tile.remote_path}>
              <ImageCard
                imageSrc={tile.remote_path}
                xmlPath={tile.remote_xml_path}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};
export default ImageGallery;
