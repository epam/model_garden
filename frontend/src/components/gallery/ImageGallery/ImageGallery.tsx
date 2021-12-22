import React, { useEffect, useState } from 'react';
import { useRouteMatch, Redirect, Link } from 'react-router-dom';
import {
  Container,
  Grid,
  TextField,
  InputAdornment,
  Button,
  Tooltip
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { Empty } from 'antd';
import { connect } from 'react-redux';

import { isProd, includesIgnoreCase } from '../../../utils';
import { useTypedSelector, TAppState } from '../../../store';
import { IDataset, IBucket } from '../../../models';
import { createLabelingTask } from '../../../store/labelingTask';
import { getMediaAssets, imageGalleryInit } from '../../../store/gallery';
import { uploadMediaFiles } from '../../../store/media';
import { ImageCard } from './ImageCard';
import { ImageGalleryHeader } from './ImageGalleryHeader';
import { TasksTable } from './TasksTable';
import { DropZone } from '../../shared';
import { TaskForm } from './TaskForm';
import { removeDataset } from '../../../store/data';

const ImageGalleryComponent = (props: any) => {
  const { photos, datasets, buckets, tasks } = props;
  const {
    uploadMediaFiles: propsUploadMediaFiles,
    imageGalleryInit: propsImageGalleryInit,
    getMediaAssets: propsGetMediaAssets,
    removeDataset: propsRemoveDataset
  } = props;

  const {
    params: { datasetId, bucketId }
  } = useRouteMatch();

  const currentDataset = datasets.find(
    (dataset: IDataset) => dataset.id === datasetId
  ); //@todo: update once we change arrays to object

  const currentBucket = buckets.find(
    (bucket: IBucket) => bucket.id === bucketId
  ); //@todo: update once we change arrays to object

  const [searchTerm, setSearchTerm] = useState('');
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [checklist, setCheckList] = useState([]);

  const filteredPhotos = useTypedSelector(({ gallery }) =>
    searchTerm
      ? gallery.mediaAssets.filter((photo) =>
          includesIgnoreCase(photo.filename, searchTerm)
        )
      : gallery.mediaAssets
  );

  useEffect(() => {
    propsImageGalleryInit({
      bucketId,
      datasetId
    });
  }, [propsImageGalleryInit, bucketId, datasetId]);

  const onDrop = (acceptedFiles: any) => {
    propsUploadMediaFiles({
      files: acceptedFiles,
      bucketId: currentBucket.id,
      path: currentDataset.path,
      format: currentDataset.dataset_format
    }).then(({ type }: any) => {
      if (type.match('fulfilled')) {
        propsGetMediaAssets({ datasetId });
      }
    });
  };

  if (
    datasets.length &&
    !datasets.find((dataset: any) => dataset.id === datasetId)
  ) {
    //in case we use an old URL with a dataset that doesn't exist
    return <Redirect to="/gallery" />;
  }

  return (
    <>
      <ImageGalleryHeader
        removeDataset={propsRemoveDataset}
        areTasks={!!tasks.length}
      />
      <Container maxWidth={'xl'}>
        <TasksTable tasks={tasks} datasetId={datasetId} />
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

          {!isProd() && (
            <Grid item xs={12} sm={6} md={3}>
              <Tooltip
                title={!checklist.length ? 'No images selected' : ''}
                arrow
              >
                <span>
                  <Button
                    disabled={!checklist.length}
                    color="primary"
                    variant="contained"
                    startIcon={<AddBoxIcon />}
                    onClick={() => setOpenTaskModal(true)}
                  >
                    CREATE NEW TASK
                  </Button>
                </span>
              </Tooltip>
            </Grid>
          )}
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <DropZone onDrop={onDrop} />
          </Grid>
          {filteredPhotos.map((image: any) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={image.remote_path}>
              <ImageCard
                datasetFormat={currentDataset.dataset_format}
                image={image}
                checklist={checklist}
                setCheckList={setCheckList}
              />
            </Grid>
          ))}
        </Grid>
        <TaskForm
          setOpenTaskModal={setOpenTaskModal}
          openTaskModal={openTaskModal}
          createLabelingTask={createLabelingTask}
          checklist={checklist}
          setCheckList={setCheckList}
          currentDataset={currentDataset}
        />
      </Container>
    </>
  );
};

const mapStateToProps = ({ gallery, data }: TAppState) => ({
  photos: gallery.mediaAssets,
  datasets: data.datasets,
  buckets: data.buckets,
  tasks: gallery.tasks
});

const mapActionsToProps = {
  imageGalleryInit,
  uploadMediaFiles,
  getMediaAssets,
  removeDataset
};

export const ImageGallery = connect(
  mapStateToProps,
  mapActionsToProps
)(ImageGalleryComponent);
