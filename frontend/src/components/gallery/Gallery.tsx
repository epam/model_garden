import React, { useEffect } from 'react';
import { AppState } from '../../store';
import { Bucket, Dataset } from '../../models';
import { Grid, Container, Select, FormControl, InputLabel, MenuItem } from '@material-ui/core';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { getMediaImages } from '../../store/media';
import { getDatasets } from '../../store/labelingTask';
import { GridGallery } from './GridGallery';

import { setCurrentBucketId, setCurrentDatasetId } from '../../store/labelingTask';

import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  item: {
    [theme.breakpoints.down('sm')]: {
      width: `${100 / 3}%`
    },
    [theme.breakpoints.only('md')]: {
      width: `${100 / 4}%`
    },
    [theme.breakpoints.only('lg')]: {
      width: `${100 / 6}%`
    },
    [theme.breakpoints.up('xl')]: {
      width: `${100 / 10}% `
    }
  }
}));

interface GalleryProps {
  photos: [{}];
  buckets: any;
  currentBucketId: any;
  dataset: any;
}

const GalleryComponent = (props: any) => {
  const {
    photos,
    buckets,
    currentBucketId,
    datasets,
    getMediaImages,
    setCurrentBucketId,
    currentDatasetId,
    setCurrentDatasetId,
    getDatasets
  } = props;
  const classes = useStyles();

  useEffect(() => {
    if (currentDatasetId) {
      getMediaImages({ bucketId: currentBucketId, datasetId: currentDatasetId });
    }
  }, [currentDatasetId]);

  useEffect(() => {
    if (currentBucketId) {
      getDatasets(currentBucketId);
    }
  }, [currentBucketId]);

  const handleBucketChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    if (e.target.value) {
      setCurrentBucketId(e.target.value as string);
    }
  };
  const handleDataSetChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    if (e.target.value) {
      setCurrentDatasetId(e.target.value as string);
    }
  };


  return (
    <Container maxWidth={'xl'}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl className="task__form-item">
            <InputLabel id="task-bucket-name">Bucket</InputLabel>
            <Select
              labelId="task-bucket-name"
              name="bucketId"
              variant="outlined"
              label="Bucket"
              value={currentBucketId}
              onChange={handleBucketChange}
            >
              {buckets.map((bucket: Bucket, index: number) => (
                <MenuItem key={index} value={bucket.id}>
                  {bucket.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl className="task__form-item">
            <InputLabel id="task-bucket-name">Dataset</InputLabel>
            <Select
              labelId="task-bucket-name"
              name="selectedDataset"
              variant="outlined"
              label="Dataset"
              value={currentDatasetId}
              onChange={handleDataSetChange}
            >
              {datasets.map((dataset: Dataset, index: any) => (
                <MenuItem key={index} value={dataset.id}>
                  {dataset.path}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <GridGallery photos={photos} />
    </Container>
  );
};
const mstp = ({ media, main, labelingTask }: AppState) => ({
  photos: media.photos,
  buckets: main.buckets,
  currentBucketId: labelingTask.currentBucketId,
  currentDatasetId: labelingTask.currentDatasetId,
  datasets: Array.from(labelingTask.datasets.values())
});
const actions = {
  setCurrentBucketId,
  setCurrentDatasetId,
  getMediaImages,
  getDatasets
};
export const Gallery = connect(mstp, actions)(GalleryComponent);
