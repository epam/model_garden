import React, { useEffect, useState } from 'react';
import { useRouteMatch, Redirect, Link } from 'react-router-dom';
import { unwrapResult } from '@reduxjs/toolkit';
import { Container, Grid, TextField, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { Empty } from 'antd';
import { useTypedSelector, useAppDispatch } from '../../store';
import { Dataset, Severity, Alert } from '../../models';
import { getDatasetsTasks, getMediaAssets } from '../../store/gallery';
import { uploadMediaFiles } from '../../store/media';
import { ImageCard } from './ImageCard';
import { ImageGalleryHeader } from './ImageGalleryHeader';
import { TasksTable } from './TasksTable';
import { DropZone, ProgressLoader, SnackbarAlert } from '../shared';

const ImageGallery = () => {
  const dispatch = useAppDispatch();
  const photos = useTypedSelector(({ gallery }) => gallery.mediaAssets);
  const datasets = useTypedSelector(({ data }) => data.datasets);
  const buckets = useTypedSelector(({ data }) => data.buckets);
  const tasks = useTypedSelector(({ gallery }) => gallery.tasks);

  const alertState: Alert = {
    show: false,
    severity: undefined,
    message: ''
  };

  const [notification, setNotification] = useState(alertState);
  const [files, setFiles] = useState<File[]>([]);
  const [showLoader, setShowLoader] = useState(false);

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

  const filteredPhotos = useTypedSelector(({ gallery }) =>
    gallery.mediaAssets.filter((photo) =>
      searchTerm
        ? photo.filename.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )
  );

  const raiseAlert = (severity: Severity, message: string) => {
    setNotification({ show: true, severity, message });
  };
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification((prevState) => ({
      ...prevState,
      show: false,
      message: ''
    }));
  };

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

  useEffect(() => {
    if (currentBucket?.id && currentDataset?.path && files.length > 0) {
      setShowLoader(true);
      dispatch(
        uploadMediaFiles({
          files,
          bucketId: currentBucket.id,
          path: currentDataset.path
        })
      )
        .then(unwrapResult)
        .then(({ message }) => {
          raiseAlert('success', message);
          dispatch(getMediaAssets({ datasetId: parseInt(datasetId) }));
          setFiles([]);
        })
        .catch(({ message }) => {
          raiseAlert('error', message);
        })
        .finally(() => setShowLoader(false));
    }
  }, [dispatch, files, currentBucket, currentDataset, datasetId]);

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
            size="small"
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
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <DropZone setFiles={setFiles} />
          </Grid>
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
      <ProgressLoader show={showLoader} />
      <SnackbarAlert
        open={notification.show}
        onClose={handleClose}
        severity={notification.severity}
      >
        {notification.message}
      </SnackbarAlert>
    </>
  );
};
export default ImageGallery;
