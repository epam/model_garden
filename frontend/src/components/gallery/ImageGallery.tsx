import React, { useEffect, useState } from 'react';
import { useRouteMatch, Redirect, Link } from 'react-router-dom';
import { unwrapResult } from '@reduxjs/toolkit';
import {
  Container,
  Grid,
  TextField,
  InputAdornment,
  Button
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { Empty } from 'antd';
import { useTypedSelector, AppState } from '../../store';
import { Dataset, Bucket } from '../../models';
import { getMediaAssets, imageGalleryInit } from '../../store/gallery';
import { uploadMediaFiles } from '../../store/media';
import { ImageCard } from './ImageCard';
import { ImageGalleryHeader } from './ImageGalleryHeader';
import { TasksTable } from './TasksTable';
import { DropZone } from '../shared';
import { TaskForm } from './TaskForm';
import { connect } from 'react-redux';

const ImageGallery = (props: any) => {
  const { photos, datasets, buckets, tasks } = props;
  const { uploadMediaFiles, imageGalleryInit, getMediaAssets } = props;
  const [files, setFiles] = useState<File[]>([]);

  const {
    params: { datasetId, bucketId }
  } = useRouteMatch();

  const currentDataset = datasets.find(
    (dataset: Dataset) => dataset.id === datasetId
  ); //@todo: update once we change arrays to object

  const currentBucket = buckets.find(
    (bucket: Bucket) => bucket.id === bucketId
  ); //@todo: update once we change arrays to object

  const [searchTerm, setSearchTerm] = useState('');
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [checklist, setCheckList] = useState([]);

  const filteredPhotos = useTypedSelector(({ gallery }) =>
    gallery.mediaAssets.filter((photo) =>
      searchTerm
        ? photo.filename.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )
  );

  useEffect(() => {
    imageGalleryInit({
      bucketId,
      datasetId
    });
  }, [imageGalleryInit, bucketId, datasetId]);

  useEffect(() => {
    if (currentBucket?.id && currentDataset?.path && files.length > 0) {
      uploadMediaFiles({
        files,
        bucketId: currentBucket.id,
        path: currentDataset.path
      })
        .then(unwrapResult)
        .then(() => {
          getMediaAssets({ datasetId });
          setFiles([]);
        });
    }
  }, [
    uploadMediaFiles,
    getMediaAssets,
    files,
    currentBucket,
    currentDataset,
    datasetId
  ]);

  if (
    datasets.length &&
    !datasets.find((dataset: any) => dataset.id === datasetId)
  ) {
    //in case we use an old URL with a dataset that doesnt exist
    return <Redirect to="/gallery" />;
  }

  return (
    <>
      <ImageGalleryHeader />
      <Container maxWidth={'xl'}>
        <TasksTable tasks={tasks} />
        {!photos.length && (
          <Link
            to={{
              pathname: '/add-dataset/upload-images',
              state: {
                dataset: currentDataset
              }
            }}
          >
            <Empty description="this dataset doesn't have any images yet, click to upload" />
          </Link>
        )}
        <Grid container spacing={2}>
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
          <Grid item xs={12} sm={6} md={3}>
            <Button
              color="primary"
              variant="contained"
              startIcon={<AddBoxIcon />}
              onClick={(e: any) => setOpenTaskModal(true)}
            >
              CREATE NEW TASK
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <DropZone setFiles={setFiles} />
          </Grid>
          {filteredPhotos.map((image: any) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={image.remote_path}>
              <ImageCard
                checklist={checklist}
                setCheckList={setCheckList}
                imageSrc={image.remote_path}
                xmlPath={image.remote_xml_path}
              />
            </Grid>
          ))}
        </Grid>
        <TaskForm
          setOpenTaskModal={setOpenTaskModal}
          openTaskModal={openTaskModal}
        />
      </Container>
    </>
  );
};

const MapStateToProps = ({ gallery, data }: AppState) => ({
  photos: gallery.mediaAssets,
  datasets: data.datasets,
  buckets: data.buckets,
  tasks: gallery.tasks
});

export default connect(MapStateToProps, {
  imageGalleryInit,
  uploadMediaFiles,
  getMediaAssets
})(ImageGallery);
