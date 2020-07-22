import React, { useEffect, useState } from 'react';
import { Container, Grid, TextField, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useRouteMatch, Redirect, Link } from 'react-router-dom';
import { Empty } from 'antd';
import { useTypedSelector, useAppDispatch } from '../../store';
import { getMediaAssets } from '../../store/data';
import { getDatasetsTasks } from '../../store/gallery';
import { ImageCard } from './ImageCard';
import { ImageGalleryHeader } from './ImageGalleryHeader';
import { Dataset } from '../../models';
import { TasksTable } from './TasksTable';

const ImageGallery = () => {
  const dispatch = useAppDispatch();
  const photos = useTypedSelector(({ data }) => data.mediaAssets);
  const datasets = useTypedSelector(({ data }) => data.datasets);
  const buckets = useTypedSelector(({ data }) => data.buckets);
  const tasks = useTypedSelector(({ gallery }) => gallery.tasks);

  const {
    params: { datasetId }
  } = useRouteMatch();
  const currentDataset = datasets.find(
    (dataset: Dataset) => dataset.id.toString() === datasetId
  ); //@todo: update once we change arrays to object
  const currentBucket = buckets.find(
    (busket) => busket.id === currentDataset?.bucket
  ); //@todo: update once we change arrays to object
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPhotos = useTypedSelector(({ data }) =>
    data.mediaAssets.filter((photo) =>
      searchTerm
        ? photo.filename.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )
  );

  useEffect(() => {
    if (datasets.length > 0) {
      dispatch(getMediaAssets({ datasetId: parseInt(datasetId) }));
    }
  }, [dispatch, datasetId, datasets.length]);

  useEffect(() => {
    //@todo: update once we will have API request by dataset Id
    if (currentDataset?.path) {
      dispatch(getDatasetsTasks({ dataset: currentDataset.path }));
    }
  }, [dispatch, currentDataset]);

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
        <TasksTable tasks={tasks} />
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
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            name="path"
            label="Search By File Name"
            value={searchTerm}
            disabled={!datasetId}
            onChange={(e: any) => {
              setSearchTerm(e.target.value);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid container spacing={2}>
          {filteredPhotos.map((image: any) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={image.remote_path}>
              <ImageCard
                imageSrc={image.remote_path}
                xmlPath={image.remote_xml_path}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};
export default ImageGallery;
